// https://zenn.dev/aishift/articles/a3dc8dcaac6bfa
import { z } from "@hono/zod-openapi";

const errorSchemaFactory = (code: z.ZodEnum<any>) => {
  return z.object({
    code: code.openapi({
      description: "error code.",
      example: code._def.values.at(0),
    }),
    message: z
      .string()
      .openapi({ description: "explanation" }),
  });
};
export type ErrorResponse = z.infer<ReturnType<typeof errorSchemaFactory>>;

export const errorResponses = {
  400: {
    description: "HTTPリクエストに対するバリデーションエラー",
    content: {
      "application/json": {
        schema: errorSchemaFactory(z.enum(["BAD_REQUEST"])).openapi(
          "ErrBadRequest",
        ),
      },
    },
  },
  401: {
    description: "認証エラー",
    content: {
      "application/json": {
        schema: errorSchemaFactory(z.enum(["UNAUTHORIZED"])).openapi(
          "ErrUnauthorized",
        ),
      },
    },
  },
  403: {
    description: "アクセス権限エラー",
    content: {
      "application/json": {
        schema: errorSchemaFactory(z.enum(["FORBIDDEN"])).openapi(
          "ErrForbidden",
        ),
      },
    },
  },
  500: {
    description: "サーバ処理エラー",
    content: {
      "application/json": {
        schema: errorSchemaFactory(z.enum(["INTERNAL_SERVER_ERROR"])).openapi(
          "ErrInternalServerError",
        ),
      },
    },
  },
};
