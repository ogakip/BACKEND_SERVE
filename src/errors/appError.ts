export class AppError extends Error {
  statusCode: number;
  redirectUrl: string | null | undefined;

  constructor(message: string, redirectUrl?: string | null, statusCode: number = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.redirectUrl = redirectUrl;
  }
}
