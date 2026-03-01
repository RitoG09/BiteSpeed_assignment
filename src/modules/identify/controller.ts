import type { Request, Response, NextFunction } from "express";
import { identifySchema } from "./schema.js";
import { identifyService } from "./service.js";

export const identifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = identifySchema.parse(req.body);

    const result = await identifyService(parsed);

    return res.status(200).json({
      contact: result,
    });
  } catch (err) {
    next(err);
  }
};