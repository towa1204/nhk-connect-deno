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

export function registRouter(app: Hono, kv: Deno.Kv) {
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
      return c.json("Error", 500);
    }
  }

  async function SetPrograms(c: Context) {
    const requestJson = await c.req.json();

    const validationResult = SetProgramSchema.safeParse(requestJson);
    if (!validationResult.success) {
      console.log(validationResult.error.issues);
      return c.json("Invalid Body", 401);
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

    return c.json("OK");
  }

  async function SetNHKAPI(c: Context) {
    const requestJson = await c.req.json();
    // デフォルト値追加
    requestJson["services"] = ["g1", "e1"];

    const validationResult = SetNHKAPISchema.safeParse(requestJson);
    if (!validationResult.success) {
      console.log(validationResult.error.issues);
      return c.json("Invalid Body", 401);
    }
    const validatedNHKAPI: SetNHKAPIRequest = requestJson;

    const result = await kv.set(
      ["config", "nhkapi"],
      validatedNHKAPI,
    );
    if (!result.ok) {
      console.log(`${validatedNHKAPI}の登録に失敗`);
      c.json("Failed set nhkapi", 500);
    }

    return c.json("OK");
  }

  async function SetNotification(c: Context) {
    const requestJson = await c.req.json();

    const validationResult = SetNotificationSchema.safeParse(requestJson);
    if (!validationResult.success) {
      console.log(validationResult.error.issues);
      return c.json("Invalid Body", 401);
    }
    const validatedNotification: SetNotificationRequest = requestJson;

    const result = await kv.set(
      ["config", "notification"],
      validatedNotification,
    );
    if (!result.ok) {
      console.log(`${validatedNotification}の登録に失敗`);
      c.json("Failed set notification", 500);
    }

    return c.json("OK");
  }
}
