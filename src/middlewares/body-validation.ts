import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// Use ZodType instead of ZodSchema
export const validate =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err) {
      const errors = (err as any).issues.map((issue: any) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({ errors });
    }
  };