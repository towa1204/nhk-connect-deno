import { loadConfig } from "./api/config.ts";
import { notifyWatchPrograms } from "./cron/service.ts";

const kv = await Deno.openKv("sample");
// const allEntries = await Array.fromAsync(kv.list({ prefix: [] }));
// console.log(allEntries);

const config = await loadConfig(kv);
console.log(config);
await notifyWatchPrograms(config, "daily");
