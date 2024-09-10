import { createRoute } from "@hono/zod-openapi";
import {
  ConfigSchema,
  ErrorSchema,
  NHKAPISchema,
  NotificationSchema,
  ProgramTitleSchema,
} from "./schema.ts";

export const getConfigAllRoute = createRoute({
  method: "get",
  path: "all",
  summary: "設定情報をすべて取得する",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: ConfigSchema,
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const postProgramTitleRoute = createRoute({
  method: "post",
  path: "programs",
  summary: "通知対象の番組を設定する",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: ProgramTitleSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
    },
    400: {
      description: "Validation Error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const postNHKAPIRoute = createRoute({
  method: "post",
  path: "nhkapi",
  summary: "APIキーと放送地域を設定",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: NHKAPISchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
    },
    400: {
      description: "Validation Error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const postNotificationRoute = createRoute({
  method: "post",
  path: "notification",
  summary: "番組の通知先を設定する",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: NotificationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
    },
    400: {
      description: "Validation Error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});
