import { z } from "@hono/zod-openapi";

export const ProgramTitleSchema = z.object({
  programs: z.array(
    z.object({
      title: z.string(),
    }),
  ),
});
export type ProgramTitle = z.infer<typeof ProgramTitleSchema>;

export const NHKAPISchema = z.object({
  area: z.string(),
  services: z.array(z.string()),
  nhkAPIKey: z.string(),
});
export type NHKAPI = z.infer<typeof NHKAPISchema>;

export const NotificationSchema = z.object({
  selectNow: z.literal("LINE"),
  LINEAPI: z.object({ userID: z.string(), accessToken: z.string() }),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const ConfigSchema = ProgramTitleSchema
  .merge(NHKAPISchema)
  .merge(NotificationSchema);

export type Config = z.infer<typeof ConfigSchema>;
