type BaseErrorOptions = {
  message?: string;
  cause?: unknown;
};

class BaseError extends Error {
  constructor(options: BaseErrorOptions) {
    super(options?.message, { cause: options?.cause });
    this.name = this.constructor.name;
  }
}

export class NotFoundConfigError extends BaseError {
  constructor(options: BaseErrorOptions) {
    super(options);
    this.name = this.constructor.name;
  }
}

export class SetConfigError extends BaseError {
  constructor(options: BaseErrorOptions) {
    super(options);
    this.name = this.constructor.name;
  }
}
