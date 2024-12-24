import { loadConfig } from "./common/dao.ts";

const res = await loadConfig(await Deno.openKv("./dev.db"));
console.log(res);
