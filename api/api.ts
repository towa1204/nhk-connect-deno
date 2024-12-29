import { HTTPException } from "hono/http-exception";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getConfigAllRoute,
  getProgramTitleRoute,
  postNHKAPIRoute,
  postNotificationRoute,
  postProgramTitleRoute,
} from "./route.ts";
import { getNHKAPIRoute } from "./route.ts";
import { getNotificationRoute } from "./route.ts";
import { Env } from "./app.ts";

const api = new OpenAPIHono<Env>({
  defaultHook: (result, c) => {
    if (!result.success) {
      console.log(result.error.issues);
      return c.json({
        code: "BAD_REQUEST",
        message: result.error.issues.map((issue) => {
          const field = issue.path.join(".");
          return `${field}: ${issue.message}`;
        }).join(", "),
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
    const config = await c.var.configRepository.get();
    return c.json(config, 200);
  } catch (err) {
    throw new HTTPException(500, { cause: err });
  }
});

/**
 * ProgramTitle
 */

api.openapi(getProgramTitleRoute, async (c) => {
  const result = await c.var.programsRepository.get();

  if (result == null) {
    throw new HTTPException(500, { message: "取得データマッピングエラー" });
  }

  return c.json(result, 200);
});

api.openapi(postProgramTitleRoute, async (c) => {
  const json = c.req.valid("json");

  await c.var.programsRepository.save(json);

  return c.body(null, 200);
});

/**
 * NHKAPI
 */

api.openapi(getNHKAPIRoute, async (c) => {
  const result = await c.var.nhkapiRepository.get();

  if (result == null) {
    throw new HTTPException(500, { message: "取得データマッピングエラー" });
  }

  return c.json(result, 200);
});

api.openapi(postNHKAPIRoute, async (c) => {
  const json = c.req.valid("json");

  await c.var.nhkapiRepository.save(json);

  return c.body(null, 200);
});

/**
 * Notification
 */

api.openapi(getNotificationRoute, async (c) => {
  const result = await c.var.notificationRepository.get();

  if (result == null) {
    throw new HTTPException(500, { message: "取得データマッピングエラー" });
  }

  return c.json(result, 200);
});

api.openapi(postNotificationRoute, async (c) => {
  const json = c.req.valid("json");

  await c.var.notificationRepository.save(json);

  return c.body(null, 200);
});

export default api;
