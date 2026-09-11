export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }

  static notFound(message: string): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string, details?: unknown): AppError {
    return new AppError(message, 409, details);
  }

  static unprocessable(message: string, details?: unknown): AppError {
    return new AppError(message, 422, details);
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(message, 400, details);
  }
}
