import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class ApiResponse {
  static success<T>(res: Response, message: string, data: T, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static paginated<T>(
    res: Response,
    message: string,
    data: T[],
    meta: PaginationMeta,
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static error(
    res: Response,
    message: string,
    error: unknown = null,
    statusCode = 400,
  ) {
    const formattedError =
      error instanceof Error
        ? { name: error.name, details: error.message }
        : error;

    return res.status(statusCode).json({
      success: false,
      message,
      error: formattedError,
    });
  }
}
