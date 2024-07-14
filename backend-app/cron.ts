import { loadConfig } from "./config.ts";
import { notifyWatchPrograms } from "./service.ts";

/**
 * Deno KVから設定情報を読み込む
 * Deno Cronの実行はオプショナルにする（フラグつけたとき）
 * Deno KVのインスタンスをどうわたすか？
 */
export async function runDenoCron(kv: Deno.Kv) {
  const config = await loadConfig(kv);

  Deno.cron("notification-daily job", "30 22 * * *", async () => {
    console.log("### 日次通知処理 START ###");
    await notifyWatchPrograms(config, "daily");
    console.log("### 日次通知処理 END ###");
  });

  Deno.cron("notification-weekly job", "30 22 * * 1", async () => {
    console.log("### 週次通知処理 START ###");
    await notifyWatchPrograms(config, "weekly");
    console.log("### 週次通知処理 END ###");
  });
}
