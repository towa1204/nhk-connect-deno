import { Notification } from "../api/schema.ts";
import { KV_KEYS } from "./KvKey.ts";
import { Repository } from "./types.ts";

export class NotificationRepository implements Repository<Notification> {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async get(): Promise<Notification | null> {
    const result = await this.#kv.get<Notification>(KV_KEYS.NOTIFICATION);
    return result.value;
  }

  async save(value: Notification): Promise<void> {
    const result = await this.#kv.set(KV_KEYS.NOTIFICATION, value);
    if (!result.ok) {
      throw new Error(
        `Failed to set. key: ${KV_KEYS.NOTIFICATION}, value: ${value}`,
      );
    }
  }
}
