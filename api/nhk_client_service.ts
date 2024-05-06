import { convertNHKDate } from "../date.ts";

/**
 * 指定したサービスの中から番組タイトルに一致する番組情報を取得する
 * @param services 検索対象に含めるサービス（チャンネル）
 * @param titles 検索したいタイトル
 * @returns
 */
export function findProgramsByTitle(
  services: string[],
  titles: string[],
  date: Date,
) {
  // key: title, value: 検索にヒットした番組のリストで返したい
  const formattedDate = convertNHKDate(date);
  return;
}
