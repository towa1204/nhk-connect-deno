import { NHKAPI } from "../api/schema.ts";
import { KV_KEYS } from "./KvKey.ts";
import { Repository } from "./types.ts";

export class NhkApiRepository implements Repository<NHKAPI> {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async get(): Promise<NHKAPI | null> {
    const result = await this.#kv.get<NHKAPI>(KV_KEYS.NHKAPI);
    return result.value;
  }

  async save(value: NHKAPI): Promise<void> {
    const result = await this.#kv.set(KV_KEYS.NHKAPI, value);
    if (!result.ok) {
      throw new Error(
        `Failed to set. key: ${KV_KEYS.NHKAPI}, value: ${value}`,
      );
    }
  }
}
