import { swaggerUI } from "@hono/swagger-ui";
import { basicAuth } from "hono/basic-auth";
import { bearerAuth } from "hono/bearer-auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { EnvObject } from "./common/env.ts";
import api from "./api/api.ts";
import { OpenAPIHono } from "@hono/zod-openapi";

export type Env = {
  Variables: {
    kv: Deno.Kv;
  };
};

export function createApp(env: EnvObject, kv: Deno.Kv) {
  const app = new OpenAPIHono<Env>();

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
      "/",
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
      "/",
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

  return app;
}
