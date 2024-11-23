export type BaseErrorOptions = {
  message?: string;
  cause?: unknown;
};

/**
 * カスタム例外クラスの継承元となるクラス
 */
export class BaseError extends Error {
  constructor(options: BaseErrorOptions) {
    super(options?.message, { cause: options?.cause });
    this.name = this.constructor.name;
  }
}

export type APIClientStatusExceptionOptions = {
  status: number;
  summary?: string;
  detail?: string;
  cause?: unknown;
};

/**
 * APIクライアント(LINE Messaging Push API, NHK API)のステータスエラーを扱う例外クラス \
 * 注意: タイムアウト系は扱わない
 */
export class APIClientStatusException extends BaseError {
  readonly status: number;
  readonly summary?: string;
  readonly detail?: string;

  constructor(options: APIClientStatusExceptionOptions) {
    super({
      message: APIClientStatusException.buildMessage(options),
      cause: options.cause,
    });
    this.status = options.status;
    this.summary = options?.summary;
    this.detail = options?.detail;
  }

  // メッセージ生成メソッド
  private static buildMessage(
    options: APIClientStatusExceptionOptions,
  ): string {
    return [
      options?.summary ? `${options.summary}` : null,
      `Status: ${options.status}`,
      options?.detail ? `Detail: ${options.detail}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }
}
