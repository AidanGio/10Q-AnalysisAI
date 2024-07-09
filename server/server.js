import express from "express";
import configRoutes from "./routes/index.js";

import dotenv from "dotenv";
import cors from "cors";

import { handleCrash, handleRejection } from "./services/crashHandler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

process.on("uncaughtException", handleCrash);
process.on("unhandledRejection", handleRejection);

configRoutes(app);

app.listen(3000, async () => {
    console.log("We now have a server!");
});

export default app;
