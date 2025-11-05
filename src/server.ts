import "reflect-metadata";
import app from './app.js';
import { AppDataSource } from "./data-source.js";


AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
  app.listen(3000);
}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
});

    