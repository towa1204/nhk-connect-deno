import { z } from 'zod'

/**
 * set_programsのリクエストスキーマ
 */
export const SetProgramSchema = z.object({
  programs: z.array(
    z.object({
      title: z.string(),
      keyword: z.string()
    })
  )
})
export type SetProgramRequest = z.infer<typeof SetProgramSchema>

/**
 * set_nhkapiのリクエストスキーマ
 * ※servicesの値はあとからなんとかする（型定義してチェックできるか？）
 */
export const SetNHKAPISchema = z.object({
  area: z.string(),
  services: z.array(z.string()),
  nhkAPIKey: z.string()
})
export type SetNHKAPIRequest = z.infer<typeof SetNHKAPISchema>

/**
 * set_notificationのリクエストスキーマ
 */
export const SetNotificationSchema = z.object({
  selectNow: z.string(),
  LINEAPI: z.object({ userID: z.string(), accessToken: z.string() })
})
export type SetNotificationRequest = z.infer<typeof SetNotificationSchema>

export type Config = SetProgramRequest &
  SetNHKAPIRequest &
  SetNotificationRequest
