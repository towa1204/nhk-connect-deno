import { HTTPException } from "hono/http-exception";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Env } from "../common/env.ts";
import {
  getConfigAllRoute,
  getProgramTitleRoute,
  postNHKAPIRoute,
  postNotificationRoute,
  postProgramTitleRoute,
} from "./route.ts";
import { loadConfig } from "../common/dao.ts";
import {
  NHKAPISchema,
  NotificationSchema,
  ProgramTitleSchema,
} from "./schema.ts";
import { getNHKAPIRoute } from "./route.ts";
import { getNotificationRoute } from "./route.ts";

const api = new OpenAPIHono<Env>({
  defaultHook: (result, c) => {
    if (!result.success) {
      console.log(result.error.issues);
      return c.json({
        code: "BAD_REQUEST",
        message: result.error.issues.map((issue) => issue.message).join(", "),
      }, 400);
    }
  },
});

api.onError((err, c) => {
  console.error("INTERNAL_SERVER_ERROR\n", err);
  return c.json({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred. Please try again later.",
  }, 500);
});

api.openapi(getConfigAllRoute, async (c) => {
  try {
    const config = await loadConfig(c.var.kv);
    return c.json(config, 200);
  } catch (err) {
    throw new HTTPException(500, { cause: err });
  }
});

/**
 * ProgramTitle
 */

api.openapi(getProgramTitleRoute, async (c) => {
  const result = await c.var.kv.get(["config", "programs"]);
  const validationResult = ProgramTitleSchema.safeParse(result.value);
  if (!validationResult.success) {
    throw new HTTPException(500, { message: "取得データマッピングエラー" });
  }
  return c.json(validationResult.data, 200);
});

api.openapi(postProgramTitleRoute, async (c) => {
  const json = c.req.valid("json");

  const result = await c.var.kv.set(
    ["config", "programs"],
    json,
  );
  if (!result.ok) {
    throw new HTTPException(500, { message: "KV Setエラー" });
  }

  return c.body(null, 200);
});

/**
 * NHKAPI
 */

api.openapi(getNHKAPIRoute, async (c) => {
  const result = await c.var.kv.get(["config", "nhkapi"]);
  const validationResult = NHKAPISchema.safeParse(result.value);
  if (!validationResult.success) {
    throw new HTTPException(500, { message: "取得データマッピングエラー" });
  }
  return c.json(validationResult.data, 200);
});

api.openapi(postNHKAPIRoute, async (c) => {
  const json = c.req.valid("json");

  const result = await c.var.kv.set(["config", "nhkapi"], json);
  if (!result.ok) {
    throw new HTTPException(500, { message: "KV Setエラー" });
  }

  return c.body(null, 200);
});

/**
 * Notification
 */

api.openapi(getNotificationRoute, async (c) => {
  const result = await c.var.kv.get(["config", "notification"]);

  const validationResult = NotificationSchema.safeParse(result.value);
  if (!validationResult.success) {
    throw new HTTPException(500, { message: "取得データマッピングエラー" });
  }
  return c.json(validationResult.data, 200);
});

api.openapi(postNotificationRoute, async (c) => {
  const json = c.req.valid("json");

  const result = await c.var.kv.set(["config", "notification"], json);
  if (!result.ok) {
    throw new HTTPException(500, { message: "KV Setエラー" });
  }

  return c.body(null, 200);
});

export default api;
