import {
  Config,
  SetNHKAPIRequest,
  SetNotificationRequest,
  SetProgramRequest,
} from "./schema.ts";

/**
 * DenoKVに格納されている設定情報を読み込む
 * @param kv DenoKv
 * @returns nhk-connect-deno設定情報
 */
export async function loadConfig(kv: Deno.Kv) {
  const configPrograms = await kv.get<SetProgramRequest>([
    "config",
    "programs",
  ]);
  if (configPrograms.value == null) {
    throw new Error("failed to load config programs");
  }

  const configNHKAPI = await kv.get<SetNHKAPIRequest>(["config", "nhkapi"]);
  if (configNHKAPI.value == null) {
    throw new Error("failed to load config NHKAPI");
  }

  const configNotification = await kv.get<SetNotificationRequest>([
    "config",
    "notification",
  ]);
  if (configNotification.value == null) {
    throw new Error("failed to load config Notification");
  }

  const config: Config = {
    ...configPrograms.value,
    ...configNHKAPI.value,
    ...configNotification.value,
  };

  return config;
}
