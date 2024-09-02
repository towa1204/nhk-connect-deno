import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { runDenoCron } from "./cron/cron.ts";
import { registAPIRouter } from "./api/controller.ts";
import { getEnv } from "./env.ts";

const kv = await Deno.openKv();
const app = new Hono();
const apiKey = getEnv("NCD_API_KEY");

app.use("/api/*", cors());
app.use(logger());

// ※APIはAPI_KEY認証
const api = app.basePath("/api");
registAPIRouter(api, kv, apiKey);

Deno.serve(app.fetch);

await runDenoCron(kv);
