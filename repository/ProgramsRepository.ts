import { ProgramTitle } from "../api/schema.ts";
import { NotFoundConfigError, SetConfigError } from "../common/exception.ts";
import { KV_KEYS } from "../common/KvKey.ts";
import { Repository } from "../common/types.ts";

export class ProgramsRepository implements Repository<ProgramTitle> {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async get(): Promise<ProgramTitle> {
    const result = await this.#kv.get<ProgramTitle>(KV_KEYS.PROGRAMS);
    if (result.value == null) {
      throw new NotFoundConfigError({
        message: `Not Found value. key: ${KV_KEYS.PROGRAMS}`,
      });
    }
    return result.value;
  }

  async save(value: ProgramTitle): Promise<void> {
    const result = await this.#kv.set(KV_KEYS.PROGRAMS, value);
    if (!result.ok) {
      throw new SetConfigError({
        message: `Failed to set. key: ${KV_KEYS.PROGRAMS}, value: ${value}`,
      });
    }
  }
}
