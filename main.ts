import "https://deno.land/std@0.223.0/dotenv/load.ts";
import { ProgramListReq } from "./types.ts";
import { fetchProgramList } from "./api/nhk_client.ts";

const apiKey = Deno.env.get("API_KEY");
if (apiKey == null) {
  throw new Error(".envにAPI_KEYが見つかりません。");
}

const req: ProgramListReq = {
  area: "130",
  service: "tv",
  date: "2024-05-06",
  apikey: apiKey,
};

const res = await fetchProgramList(req);
console.log(res);
