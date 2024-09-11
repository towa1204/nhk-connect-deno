import { z } from "zod";
import { extendZodWithOpenApi } from "@hono/zod-openapi";
extendZodWithOpenApi(z);

export const ProgramTitleSchema = z.object({
  programs: z.array(
    z.object({
      title: z.string(),
    }),
  ),
});

export const NHKAPISchema = z.object({
  area: z.string(),
  services: z.array(z.string()),
  nhkAPIKey: z.string(),
});

export const NotificationSchema = z.object({
  selectNow: z.literal("LINE"),
  LINEAPI: z.object({ userID: z.string(), accessToken: z.string() }),
});

export const ErrorSchema = z.object({
  message: z.string().openapi({
    example: "validation error",
  }),
  details: z.any().openapi({
    example: [
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["programs", 2, "title"],
        message: "Required",
      },
    ],
  }),
});

export const ConfigSchema = ProgramTitleSchema
  .merge(NHKAPISchema)
  .merge(NotificationSchema);

export type Config = z.infer<typeof ConfigSchema>;
