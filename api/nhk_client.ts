import { API_BASE_PATH } from "../config.ts";
import { ProgramListReq, ServiceProgramList } from "../types.ts";

export async function fetchProgramList(
  { area, service, date, apikey }: ProgramListReq,
): Promise<ServiceProgramList> {
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
  return await res.json() as ServiceProgramList;
}
