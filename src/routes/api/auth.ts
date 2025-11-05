import  Express  from "express";
import  AuthController  from "../../controllers/AuthController.js";
import {validate } from "../../middlewares/body-validation.js";
import { createUserSchema } from "../../validators/user-validator.js";
const app = Express.Router();

app.post('/', AuthController.login);
app.post('/register', validate(createUserSchema), AuthController.register);

export default app;
