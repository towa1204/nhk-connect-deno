import { Program, ProgramsListReq, WatchProgram } from "./types.ts";
import { fetchProgramList } from "./client/nhk_client.ts";
import { createLINEMessage, sendLINEMessage } from "./client/line_client.ts";
import secrets from "./secrets.json" with { type: "json" };
import { ExecuteType } from "./config.ts";

export async function notifyWatchPrograms(type: "daily" | "weekly") {
  const executeType = new ExecuteType(type);
  const watchProgramKeywords = secrets.subscribePrograms.map((program) =>
    program.keyword
  );

  /**
   * 1. 番組情報の取得
   * Serviceの数だけリクエストを実施
   */
  const programs = await fetchProgramsByDates({
    area: secrets.area,
    services: secrets.services,
    dates: executeType.requestNHKDates,
    nhkAPIKey: secrets.nhkAPIKey,
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

  /**
   * 3. 通知用メッセージの作成
   * secrets.jsonから通知タイプ取得
   * 通知タイプをもとに通知先を切り替える
   */
  console.log(`通知先：${secrets.notifyService.selectNow}`);
  if (secrets.notifyService.selectNow === "line") {
    const lineAPI = secrets.notifyService.lineAPI;
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
