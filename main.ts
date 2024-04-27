import "https://deno.land/std@0.223.0/dotenv/load.ts";
import { ProgramListReq, ServiceProgramList } from "./types.ts";

const baseUrl = "https://api.nhk.or.jp/v2";
const apiKey = Deno.env.get("APIKEY");
if (apiKey == null) {
  throw new Error(".envにAPIKEYが見つかりません。");
}

// APIラッパー的なものを作ろう
async function fetchProgramList(
  { area, service, date, apikey }: ProgramListReq,
): Promise<ServiceProgramList> {
  const res = await fetch(
    `${baseUrl}/pg/list/${area}/${service}/${date}.json?key=${apikey}`,
  );
  if (!res.ok) {
    throw new Error("ProgramList APIへの接続に失敗しました。");
  }
  return await res.json() as ServiceProgramList;
}

const req: ProgramListReq = {
  area: "130",
  service: "tv",
  date: "2024-04-27",
  apikey: apiKey,
};

const res = await fetchProgramList(req);
console.log(res);
