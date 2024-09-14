import { createRoute } from "@hono/zod-openapi";
import {
  ConfigSchema,
  NHKAPISchema,
  NotificationSchema,
  ProgramTitleSchema,
} from "./schema.ts";
import { errorResponses } from "./error.schema.ts";

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
    ...errorResponses,
  },
});

export const getProgramTitleRoute = createRoute({
  method: "get",
  path: "programs",
  summary: "通知対象の番組情報を取得する",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: ProgramTitleSchema,
        },
      },
    },
    ...errorResponses,
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
    ...errorResponses,
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
    ...errorResponses,
  },
});

export const getNHKAPIRoute = createRoute({
  method: "get",
  path: "nhkapi",
  summary: "APIキーと放送地域を取得",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: NHKAPISchema,
        },
      },
    },
    ...errorResponses,
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
    ...errorResponses,
  },
});

export const getNotificationRoute = createRoute({
  method: "get",
  path: "notification",
  summary: "番組の通知先を取得",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: NotificationSchema,
        },
      },
    },
    ...errorResponses,
  },
});
