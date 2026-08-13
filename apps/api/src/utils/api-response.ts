import type { Response } from "express";

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string,
    errors: unknown = null,
    statusCode = 400,
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
