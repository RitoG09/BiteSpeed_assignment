import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error",
  });
};