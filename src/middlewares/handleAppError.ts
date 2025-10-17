import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export const handleAppErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    if (error.redirectUrl) {
      res
        .status(error.statusCode)
        .json({ error: error.message, redirectUrl: error.redirectUrl });
      return;
    }

    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
};
