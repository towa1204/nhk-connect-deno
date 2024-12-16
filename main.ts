import { mountDenoCron } from "./cron/cron.ts";
import { getEnvObject } from "./common/env.ts";
import { createApp } from "./api/app.ts";

const env = getEnvObject();
const kv = env.kvPath != undefined
  ? await Deno.openKv(env.kvPath)
  : await Deno.openKv();

const app = createApp(env, kv);

Deno.serve({ port: env.portNumber }, app.fetch);

mountDenoCron(kv);
