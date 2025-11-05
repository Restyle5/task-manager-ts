import jwt from "jsonwebtoken";
import User from "../entities/User.js";
import { AppDataSource } from "../data-source.js";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  public static async verifyToken(token: string) {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET || "");

      if (user && user instanceof Object && "id" in user) {
        const foundUser = await userRepository.findOne({
          where: { id: user.id },
        });
        user.details = foundUser!;
      }
      return user;
    }
    return null;
  }
}
6