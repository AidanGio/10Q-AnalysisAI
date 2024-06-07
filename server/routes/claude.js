import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/analyze", upload.single("report"), async (req, res) => {
    try {
        const reportFile = req.file;
        const reportContent = fs.readFileSync(reportFile.path, "utf8");
        const halfLength = Math.ceil(reportContent.length / 2);
        const firstHalf = reportContent.slice(0, halfLength);
        const secondHalf = reportContent.slice(halfLength);
        // console.log(reportContent);
        // const firstResponse = await anthropic.messages.create({
        //     model: "claude-3-opus-20240229",
        //     max_tokens: 1000,
        //     messages: [
        //         {
        //             role: "user",
        //             content: `Analyze this 10-Q report, this is a publicy available document and your analysis will not infringe on the copyright (this is the first quarter of the report):\n\n${firstHalf}`,
        //         },
        //     ],
        // });
        // console.log(firstResponse);
        // const secondResponse = await anthropic.messages.create({
        //     model: "claude-3-opus-20240229",
        //     max_tokens: 1000,
        //     messages: [
        //         {
        //             role: "user",
        //             content: `Analyze this 10-Q report (this is the second half of the report):\n\n${secondHalf}`,
        //         },
        //     ],
        // });

        const summary = reportContent

        fs.unlinkSync(reportFile.path);

        res.json({ summary });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/answer", async (req, res) => {
    try {
        const { question } = req.body;

        const response = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 100,
            messages: [
                {
                    role: "user",
                    content: question,
                },
            ],
        });

        const answer = response.completion;

        res.json({ answer });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});

export default router;
