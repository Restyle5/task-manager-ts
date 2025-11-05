import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    if (typeof token === "string") {
      const payload = await AuthService.verifyToken(token);

      if (payload) {
        req.user = payload
        
        return next();
      } else {
        return res.status(401).json({ message: "Invalid user" });
      }
    }else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res.status(401).json({ message: err });
  }
};
