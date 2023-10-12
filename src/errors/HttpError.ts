import * as constants from '../constants';

export default class HttpError extends Error {
  public code: number;

  constructor(code: number, message: string, ...args: any) {
    super(...args);
    this.code = code;
    this.message = message;
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, ...args: any) {
    super(400, message, ...args);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}
export class ForbiddenError extends HttpError {
  constructor(message: string, ...args: any) {
    super(403, message, args);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, ...args: any) {
    super(404, message, args);
  }
}

export class MissingFieldError extends BadRequestError {
  constructor(fieldName: string, ...args: any) {
    super(`${fieldName} is required`, args);
  }
}

export class InternalError extends HttpError {
  constructor(message: string, ...args: any) {
    super(500, message, args);
  }
}

export class InvalidCredentialError extends BadRequestError {
  constructor(...args: any) {
    super(constants.INVALID_CREDENTIAL_ERROR, args);
  }
}

export class InvalidTokenError extends BadRequestError {
  constructor(type: string, ...args: any) {
    if (type === 'ACCESS') {
      super(constants.INVALID_ACCESS_TOKEN, args);
    } else {
      super(constants.INVALID_REFRESH_TOKEN, args);
    }
  }
}
