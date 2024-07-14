import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { basicAuth } from "hono/basic-auth";
import { runDenoCron } from "./backend-app/cron.ts";
import { registAPIRouter } from "./backend-app/api.ts";
import { getEnv } from "./env.ts";

const kv = await Deno.openKv("sample");
const app = new Hono();

const apiKey = getEnv("NCD_API_KEY");
const user = getEnv("NCD_USER");
const passwd = getEnv("NCD_PASSWD");

app.use(logger());

// ※APIはAPI_KEY認証
const api = app.basePath("/api");
registAPIRouter(api, kv, apiKey);

// ※Web画面はBasic認証
app.use(
    "/*",
    basicAuth({
        username: user,
        password: passwd,
    }),
);
app.use("/*", serveStatic({ root: "./frontend-app/dist/" }));
app.get("*", serveStatic({ path: "./frontend-app/dist/index.html" }));

Deno.serve(app.fetch);

await runDenoCron(kv);
