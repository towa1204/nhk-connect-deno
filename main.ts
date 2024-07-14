import "@std/dotenv/load";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { runDenoCron } from "./backend-app/cron.ts";
import { registRouter } from "./backend-app/api.ts";

const kv = await Deno.openKv("sample");
const app = new Hono();

const apiKey = Deno.env.get("API_KEY");
if (apiKey == null) {
    console.error("envにAPI_KEYがセットされていません");
    Deno.exit(1); // Deno Deployでこれやって大丈夫？
}

app.use(logger());

registRouter(app, kv, apiKey);

app.use("/*", serveStatic({ root: "./frontend-app/dist/" }));

Deno.serve(app.fetch);

await runDenoCron(kv);
