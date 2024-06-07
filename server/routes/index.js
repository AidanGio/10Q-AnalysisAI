import express from "express";
import claudeRouter from "./claude.js";
import openaiRouter from "./openai.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("This is a server!");
});

const setupRoutes = (app) => {
    app.use("/", router);
    app.use("/claude", claudeRouter);
    app.use("/openai", openaiRouter);


    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

export default setupRoutes;
