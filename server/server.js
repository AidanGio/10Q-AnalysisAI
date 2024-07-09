import express from "express";
import configRoutes from "./routes/index.js";

import dotenv from "dotenv";
import cors from "cors";

import { handleCrash, handleRejection } from "./services/crashHandler.js";

dotenv.config();

const app = express();

const allowedOrigins = ["https://10q-analysis-client.vercel.app", "http://localhost:5173"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on("uncaughtException", handleCrash);
process.on("unhandledRejection", handleRejection);

configRoutes(app);

app.listen(3000, async () => {
    console.log("We now have a server!");
});

export default app;
