import { API_BASE_PATH } from "../config.ts";
import { ProgramListReq, ProgramListRes } from "../types.ts";

/**
 * Program List API
 */
export async function fetchProgramList(
  { area, service, date, apikey }: ProgramListReq,
): Promise<ProgramListRes> {
  const res = await fetch(
    `${API_BASE_PATH}/pg/list/${area}/${service}/${date}.json?key=${apikey}`,
  );
  if (!res.ok) {
    const errorMessage = [
      `ProgramList APIへの接続に失敗しました。`,
      `ステータスコード: ${res.status}`,
      `メッセージ: ${await res.text()}`,
    ].join("\n");
    throw new Error(errorMessage);
  }
  return await res.json() as ProgramListRes;
}
