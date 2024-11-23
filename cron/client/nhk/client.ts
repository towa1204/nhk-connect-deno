import { NHK_API_BASE_PATH } from "../../config.ts";
import { ProgramListReq, ProgramListRes } from "../../types.ts";
import { APIClientStatusException } from "../exception.ts";

/**
 * NHK Program List API
 *
 * 正常なステータスであればJSONレスポンスを返す。
 * 異常なステータスであれば例外を送出する。
 * @param Program List APIの必須パラメータを含めたオブジェクト
 * @returns JSONレスポンス
 */
export async function fetchProgramList(
  { area, service, date, apikey }: ProgramListReq,
): Promise<ProgramListRes> {
  const url =
    `${NHK_API_BASE_PATH}/pg/list/${area}/${service}/${date}.json?key=${apikey}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new APIClientStatusException({
      status: res.status,
      summary: "ProgramList APIへの接続に失敗",
      detail: await res.text(),
    });
  }
  return await res.json() as ProgramListRes;
}
