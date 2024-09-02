import { Context, Hono } from "hono";
import {
  SetNHKAPIRequest,
  SetNHKAPISchema,
  SetNotificationRequest,
  SetNotificationSchema,
  SetProgramRequest,
  SetProgramSchema,
} from "./schema.ts";
import { loadConfig } from "./config.ts";
import { resMessage } from "./message.ts";

export function registAPIRouter(app: Hono, kv: Deno.Kv, apiKey: string) {
  // APIキー認証
  app.use("/config/*", async (c, next) => {
    if (c.req.query("key") !== apiKey) {
      return c.json(resMessage("Please specify valid apikey"), 401);
    }
    await next();
  });

  app.get("/config/all", GetConfig);

  app.post("/config/programs", SetPrograms);
  app.post("/config/nhkapi", SetNHKAPI);
  app.post("/config/notification", SetNotification);

  async function GetConfig(c: Context) {
    try {
      const config = await loadConfig(kv);
      return c.json(config);
    } catch (err) {
      console.error(err);
      return c.json(resMessage("Load Config Error"), 500);
    }
  }

  async function SetPrograms(c: Context) {
    const requestJson = await c.req.json();

    const validationResult = SetProgramSchema.safeParse(requestJson);
    if (!validationResult.success) {
      console.log(validationResult.error.issues);
      return c.json(resMessage("Invalid JSON"), 400);
    }
    const validatedPrograms: SetProgramRequest = requestJson;

    const result = await kv.set(
      ["config", "programs"],
      validatedPrograms,
    );
    if (!result.ok) {
      console.log(`${validatedPrograms}の登録に失敗`);
      c.json("Failed set programs", 500);
    }

    return c.json(resMessage("OK"));
  }

  async function SetNHKAPI(c: Context) {
    const requestJson = await c.req.json();

    const validationResult = SetNHKAPISchema.safeParse(requestJson);
    if (!validationResult.success) {
      console.log(validationResult.error.issues);
      return c.json(resMessage("Invalid JSON"), 400);
    }
    const validatedNHKAPI: SetNHKAPIRequest = requestJson;

    const result = await kv.set(
      ["config", "nhkapi"],
      validatedNHKAPI,
    );
    if (!result.ok) {
      console.log(`${validatedNHKAPI}の登録に失敗`);
      c.json(resMessage("Faild set NHKAPI"), 500);
    }

    return c.json(resMessage("OK"));
  }

  async function SetNotification(c: Context) {
    const requestJson = await c.req.json();

    const validationResult = SetNotificationSchema.safeParse(requestJson);
    if (!validationResult.success) {
      console.log(validationResult.error.issues);
      return c.json(resMessage("Invalid JSON"), 400);
    }
    const validatedNotification: SetNotificationRequest = requestJson;

    const result = await kv.set(
      ["config", "notification"],
      validatedNotification,
    );
    if (!result.ok) {
      console.log(`${validatedNotification}の登録に失敗`);
      c.json(resMessage("Failed set notification"), 500);
    }

    return c.json(resMessage("OK"));
  }
}
