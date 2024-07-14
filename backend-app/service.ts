import { Program, ProgramsListReq, WatchProgram } from "./types.ts";
import { fetchProgramList } from "./client/nhk_client.ts";
import { createLINEMessage, sendLINEMessage } from "./client/line_client.ts";
import { ExecuteType } from "./config.ts";
import { Config } from "./schema.ts";

export async function notifyWatchPrograms(
  config: Config,
  type: "daily" | "weekly",
) {
  const executeType = new ExecuteType(type);
  const watchProgramKeywords = config.programs.map((program) =>
    program.keyword
  );

  /**
   * 1. 番組情報の取得
   * Serviceの数だけリクエストを実施
   */
  const programs = await fetchProgramsByDates({
    area: config.area,
    services: config.services,
    dates: executeType.requestNHKDates,
    nhkAPIKey: config.nhkAPIKey,
  });
  console.log(`取得した番組数：${programs.length}`);

  /**
   * 2. 視聴番組情報の取得
   */
  const watchPrograms = filterWatchProgramsInfo(
    programs,
    watchProgramKeywords,
    executeType.timeArea,
  );
  console.log(`取得した視聴番組数：${watchPrograms.length}`);

  /** 視聴番組がない場合は通知せず終了する */
  if (watchPrograms.length === 0) {
    console.log("視聴番組がないため通知せず終了");
    return;
  }

  /**
   * 3. 通知用メッセージの作成
   * 設定情報から通知タイプ取得
   * 通知タイプをもとに通知先を切り替える
   */
  console.log(`通知先：${config.selectNow}`);
  if (config.selectNow === "LINE") {
    const lineAPI = config.LINEAPI;
    const notifyMessage = createLINEMessage(
      executeType.messageHeader,
      watchPrograms,
    );
    sendLINEMessage({
      userID: lineAPI.userID,
      accessToken: lineAPI.accessToken,
      message: notifyMessage,
    });
  } else {
    throw new Error("その通知サービスは存在しません");
  }
}

/** 指定した日時(複数可)の番組情報を取得する */
export async function fetchProgramsByDates(
  programsListReq: ProgramsListReq,
): Promise<Program[]> {
  const { area, services, dates, nhkAPIKey } = programsListReq;

  const programs: Program[] = [];
  for (const date of dates) {
    for (const service of services) {
      const serviceProgramList = await fetchProgramList({
        area: area,
        service: service,
        date: date,
        apikey: nhkAPIKey,
      });
      programs.push(...serviceProgramList.list[service]);
    }
  }
  return programs;
}

/** 番組情報から視聴番組情報を引っこ抜く */
export function filterWatchProgramsInfo(
  programs: Program[],
  filterKeywords: string[],
  filterTimeArea: {
    beginTime: Date;
    endTime: Date;
  },
): WatchProgram[] {
  const watchPrograms: WatchProgram[] =
    // 番組情報から「視聴番組」かつ「放映開始日時が指定時間範囲内の番組」を抜き出す
    programs.filter((program) => {
      // 番組タイトルをもとに「視聴番組」かチェック
      const isWatchProgram = filterKeywords.some((keyword) =>
        program.title.includes(keyword)
      );

      // 「放映開始日時が指定時間範囲内」かチェック
      const programStartDate = new Date(program.start_time);
      const isStartWithinFilterArea =
        programStartDate >= filterTimeArea.beginTime &&
        programStartDate < filterTimeArea.endTime;

      return isWatchProgram && isStartWithinFilterArea;
    })
      // 欲しい形に番組情報を整形する
      .map((program) => {
        return {
          "title": program.title,
          "subtitle": program.subtitle,
          "content": program.content,
          "act": program.act,
          "genres": program.genres,
          "start_time": program.start_time,
          "end_time": program.end_time,
        };
      });
  return watchPrograms;
}
