import { z } from "zod";

/**
 * set_programsのリクエストスキーマ
 */
export const ProgramTitleSchema = z.object({
  programs: z.array(
    z.object({
      title: z.string(),
    }),
  ),
});
export type SetProgramRequest = z.infer<typeof ProgramTitleSchema>;

/**
 * set_nhkapiのリクエストスキーマ
 * ※servicesの値はあとからなんとかする（型定義してチェックできるか？）
 */
export const NHKAPISchema = z.object({
  area: z.string(),
  services: z.array(z.string()),
  nhkAPIKey: z.string(),
});
export type SetNHKAPIRequest = z.infer<typeof NHKAPISchema>;

/**
 * set_notificationのリクエストスキーマ
 */
export const NotificationSchema = z.object({
  selectNow: z.literal("LINE"),
  LINEAPI: z.object({ userID: z.string(), accessToken: z.string() }),
});

export type SetNotificationRequest = z.infer<typeof NotificationSchema>;

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

// channelをもとに動的にAPIに使われる型や値を決定したい
// export const ConfigApiProp = [
//   {
//     channel: "set_programs",
//     schema: SetProgramSchema,
//     kvKey: ["config", "programs"],
//   },
//   {
//     channel: "set_nhkapi",
//     schema: SetNHKAPISchema,
//     kvKey: ["config", "nhkapi"],
//   },
//   {
//     channel: "set_notification",
//     schema: SetNotificationSchema,
//     kvKey: ["config", "notification"],
//   },
// ];
