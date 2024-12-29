import { NHKAPI } from "../api/schema.ts";
import { NotFoundConfigError, SetConfigError } from "../common/exception.ts";
import { KV_KEYS } from "../common/KvKey.ts";
import { Repository } from "../common/types.ts";

export class NhkApiRepository implements Repository<NHKAPI> {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async get(): Promise<NHKAPI> {
    const result = await this.#kv.get<NHKAPI>(KV_KEYS.NHKAPI);
    if (result.value == null) {
      throw new NotFoundConfigError({
        message: `Not Found value. key: ${KV_KEYS.NHKAPI}`,
      });
    }
    return result.value;
  }

  async save(value: NHKAPI): Promise<void> {
    const result = await this.#kv.set(KV_KEYS.NHKAPI, value);
    if (!result.ok) {
      throw new SetConfigError({
        message: `Failed to set. key: ${KV_KEYS.NHKAPI}, value: ${value}`,
      });
    }
  }
}
