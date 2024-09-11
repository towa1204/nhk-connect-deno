import { Config, ConfigSchema } from "../api/schema.ts";

/**
 * DenoKVに格納されている設定情報を読み込む
 * @param kv DenoKv
 * @returns nhk-connect-deno設定情報
 */
export async function loadConfig(kv: Deno.Kv): Promise<Config> {
  const receiveConfig = {};
  const entries = await kv.list({ prefix: ["config"] });
  for await (const entry of entries) {
    Object.assign(receiveConfig, entry.value);
  }

  const res = ConfigSchema.safeParse(receiveConfig);
  if (!res.success) {
    throw new Error("failed to load config", res.error);
  }

  return res.data;
}
