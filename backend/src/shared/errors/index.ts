/** Base class for errors that should reach the client with a specific HTTP status. */
export class HttpException extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = new.target.name;
    this.status = status;
  }
}

/** 400 - the request was understood but is invalid (wrong OTP, bad input, ...). */
export class BadException extends HttpException {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}
