import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { runDenoCron } from "./backend-app/cron.ts";
import { registRouter } from "./backend-app/api.ts";

const kv = await Deno.openKv("sample");
const app = new Hono();

app.use(logger());

registRouter(app, kv);

app.use("/*", serveStatic({ root: "./frontend-app/dist/" }));

Deno.serve(app.fetch);

await runDenoCron(kv);
