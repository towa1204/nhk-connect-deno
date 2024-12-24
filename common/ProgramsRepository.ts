import { ProgramTitle } from "../api/schema.ts";
import { KV_KEYS } from "./KvKey.ts";
import { Repository } from "./types.ts";

export class ProgramsRepository implements Repository<ProgramTitle> {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async get(): Promise<ProgramTitle | null> {
    const result = await this.#kv.get<ProgramTitle>(KV_KEYS.PROGRAMS);
    return result.value;
  }

  async save(value: ProgramTitle): Promise<void> {
    const result = await this.#kv.set(KV_KEYS.PROGRAMS, value);
    if (!result.ok) {
      throw new Error(
        `Failed to set. key: ${KV_KEYS.PROGRAMS}, value: ${value}`,
      );
    }
  }
}
