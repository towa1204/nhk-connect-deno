/** Program List APIのリクエストパラメータ */
export interface ProgramListReq {
  area: string;
  service: string;
  date: string;
  apikey: string;
}

/** Program List APIのレスポンス */
export interface ProgramListRes {
  list: ServiceProgramList;
}

/** サービスごとの番組リスト */
export interface ServiceProgramList {
  /** サービスID: 番組リスト */
  [key: string]: Program[];
}

/** 番組オブジェクト */
export interface Program {
  /** 番組ID */
  id: string;

  /** 番組イベントID */
  event_id: string;

  /** 放送開始日時（YYYY-MM-DDTHH:mm:ssZ形式） */
  start_time: string;

  /** 放送終了日時（YYYY-MM-DDTHH:mm:ssZ形式） */
  end_time: string;

  /** 放送エリア */
  area: Area;

  /** 番組を放送しているサービス */
  service: Service;

  /** 番組名 */
  title: string;

  /** 番組内容 */
  subtitle: string;

  /** 番組詳細 */
  content: string;

  /** 出演者 */
  act: string;

  /** 番組ジャンル */
  genres: string[];
}

/** 放送地域 */
export interface Area {
  /** 地域ID */
  id: string;

  /** 地域名 */
  name: string;
}

/** 番組ロゴ */
export interface Logo {
  /**ロゴ画像のURL */
  url: string;

  /** ロゴ画像の幅 */
  width: string;

  /** ロゴ画像の高さ */
  height: string;
}

/** 放送サービス */
export interface Service {
  /** サービスID */
  id: string;

  /** サービス名 */
  name: string;

  /** サービスロゴ画像:小 */
  logo_s: Logo;

  /** サービスロゴ画像:中 */
  logo_m: Logo;

  /** サービスロゴ画像:大 */
  logo_l: Logo;
}

/** 視聴番組 */
// Pick使ってもいいかも
export interface WatchProgram {
  title: string;
  subtitle: string;
  content: string;
  act: string;
  genres: string[];
  start_time: string;
  end_time: string;
}

/** 日次・週次APIリクエスト */
export interface ProgramsListReq {
  /** 放送地域 */
  area: string;

  /** 放送サービス */
  services: string[];

  /** 放映日(YYYY-MM-dd形式) */
  dates: string[];

  /** NHK番組表APIキー */
  nhkAPIKey: string;
}

/** LINE Messaging Push APIのラッパーの引数 */
export interface LinePushRequest {
  /** ユーザID */
  userID: string;

  /** アクセストークン */
  accessToken: string;

  /** 送信するメッセージ(※1件のみ想定) */
  message: string;
}

export interface Notifier {
  createMessage: (programs: Program[], header: string) => string;
  notifyMessage: (request: LinePushRequest) => void;
}
