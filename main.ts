import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { notifyWatchPrograms } from "./service.ts";

const app = new Hono();

app.use("/*", serveStatic({ root: "./frontend-app/dist/" }));

Deno.serve(app.fetch);

Deno.cron("notification-daily job", "30 22 * * *", async () => {
  console.log("### 日次通知処理 START ###");
  await notifyWatchPrograms("daily");
  console.log("### 日次通知処理 END ###");
});

Deno.cron("notification-weekly job", "30 22 * * 1", async () => {
  console.log("### 週次通知処理 START ###");
  await notifyWatchPrograms("weekly");
  console.log("### 週次通知処理 END ###");
});
