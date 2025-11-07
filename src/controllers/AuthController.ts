import type { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import User from "../entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = req.body || {};

    if (email && password) {
      const user = await userRepository.findOne({ where: { email } });
      const syn = await bcrypt.compare(password, user?.password || "");
      if (user && syn) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
          expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });
        return res.status(200).json({ message: "Login successful", token });
      }
    }
    return res.status(401).json({ message: "Invalid email or password" });
  }

  public static async register(req: Request, res: Response): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);
    const { name, email, password } = req.body || {};

    if (name && email && password) {
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });
      const savedUser = await userRepository.save(newUser);

      return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
    }
    return res.status(400).json({ message: "Missing required fields" });
  }
}
