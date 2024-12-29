import { Config, ConfigSchema } from "../api/schema.ts";
import { NotFoundConfigError } from "../common/exception.ts";
import { KV_KEYS } from "../common/KvKey.ts";
import { IConfigRepository } from "../common/types.ts";

export class ConfigRepository implements IConfigRepository {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async get(): Promise<Config> {
    const entries = await this.#kv.list({ prefix: KV_KEYS.CONFIG });

    const receiveConfig = {};
    for await (const entry of entries) {
      Object.assign(receiveConfig, entry.value);
    }

    const res = ConfigSchema.safeParse(receiveConfig);
    if (!res.success) {
      throw new NotFoundConfigError({
        message: `Found Invalid value: ${JSON.stringify(receiveConfig)}`,
        cause: res.error,
      });
    }

    return res.data;
  }
}
