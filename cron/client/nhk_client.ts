import { NHK_API_BASE_PATH } from "../config.ts";
import { ProgramListReq, ProgramListRes } from "../types.ts";

/**
 * NHK Program List API
 */
export async function fetchProgramList(
  { area, service, date, apikey }: ProgramListReq,
): Promise<ProgramListRes> {
  const url =
    `${NHK_API_BASE_PATH}/pg/list/${area}/${service}/${date}.json?key=${apikey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorMessage = [
      `ProgramList APIへの接続に失敗しました。`,
      `URL: ${url}`,
      `ステータスコード: ${res.status}`,
      `メッセージ: ${await res.text()}`,
    ].join("\n");
    throw new Error(errorMessage);
  }
  return await res.json() as ProgramListRes;
}
