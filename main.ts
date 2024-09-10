import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { basicAuth } from "hono/basic-auth";
import { bearerAuth } from "hono/bearer-auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { runDenoCron } from "./cron/cron.ts";
import { registAPIRouter } from "./api/controller.ts";
import { Env, getEnvObject } from "./env.ts";
import api from "./api/api.ts";

const env = getEnvObject();
const kv = env.kvPath != undefined
  ? await Deno.openKv(env.kvPath)
  : await Deno.openKv();
const app = new OpenAPIHono<Env>();

// apply Middleware
app
  .use("/api/*", cors())
  .use(logger())
  .use(
    "/doc",
    bearerAuth({
      token: env.bearer.token,
    }),
  )
  .use(
    "/api/*",
    bearerAuth({
      token: env.bearer.token,
    }),
  )
  .use(
    "/ui",
    basicAuth({
      username: env.basic.user,
      password: env.basic.passwd,
    }),
  )
  .use(async (c, next) => {
    c.set("kv", kv);
    await next();
  });

app.route("/api/config", api);

// OpenAPI document
app
  .doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "nhk-connect API",
    },
  })
  .get(
    "/ui",
    swaggerUI({
      url: "/doc",
      requestInterceptor: `
      request => {
        if (request.url === '/doc') {
          request.headers['authorization'] = \`Bearer ${env.bearer.token}\`;
        }
        return request;
      }`,
    }),
  );

Deno.serve(app.fetch);

// await runDenoCron(kv);
