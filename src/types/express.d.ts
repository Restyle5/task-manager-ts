import User from "../entities/User.js";

import "express";

declare module "express" {
  interface Request {
    user?: any;
  }
}