import { OpenAPIHono } from "@hono/zod-openapi";
import { Env } from "../common/env.ts";
import {
  getConfigAllRoute,
  postNHKAPIRoute,
  postNotificationRoute,
  postProgramTitleRoute,
} from "./route.ts";
import { loadConfig } from "../common/dao.ts";

const api = new OpenAPIHono<Env>({
  defaultHook: (result, c) => {
    if (!result.success) {
      console.log(result.error.errors);
      return c.json({
        message: "validation error",
        details: result.error.errors,
      });
    }
  },
});

api
  .openapi(getConfigAllRoute, async (c) => {
    try {
      const config = await loadConfig(c.var.kv);
      return c.json(config, 200);
    } catch (err) {
      console.error(err);
      return c.json({
        message: "Internal Server Error",
        details: null,
      }, 500);
    }
  })
  .openapi(postProgramTitleRoute, async (c) => {
    const json = c.req.valid("json");

    const result = await c.var.kv.set(
      ["config", "programs"],
      json,
    );
    if (!result.ok) {
      console.log(`${json}の登録に失敗`);
      return c.json({
        message: "Internal Server Error",
        details: null,
      }, 500);
    }

    return c.body(null, 200);
  })
  .openapi(postNHKAPIRoute, async (c) => {
    const json = c.req.valid("json");

    const result = await c.var.kv.set(
      ["config", "nhkapi"],
      json,
    );
    if (!result.ok) {
      console.log(`${json}の登録に失敗`);
      return c.json({
        message: "Internal Server Error",
        details: null,
      }, 500);
    }

    return c.body(null, 200);
  })
  .openapi(postNotificationRoute, async (c) => {
    const json = c.req.valid("json");

    const result = await c.var.kv.set(
      ["config", "notification"],
      json,
    );
    if (!result.ok) {
      console.log(`${json}の登録に失敗`);
      return c.json({
        message: "Internal Server Error",
        details: null,
      }, 500);
    }

    return c.body(null, 200);
  });

export default api;
