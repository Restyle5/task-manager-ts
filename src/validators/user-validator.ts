import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is required"),
  password: z.string().min(6, "Password too short"),
});
