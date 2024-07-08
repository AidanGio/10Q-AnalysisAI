import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse";
import jsonParse from "json-parse-even-better-errors";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post("/analyze", upload.single("report"), async (req, res) => {
    // console.log(process.env.ANTHROPIC_API_KEY);
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    try {
        const reportFile = req.file;
        const pdfBuffer = fs.readFileSync(reportFile.path);

        const data = await pdf(pdfBuffer);
        const reportContent = data.text;
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 2000,
            messages: [
                {
                    role: "user",
                    content: `Analyze the provided 10-Q report and return the response in the following JSON format:
            {
                "summary": "An extensive summary of the key points from the report, including financial results, segment performance, outlook, and liquidity.",
                "questions": [
                    {
                        "question1": "A relevant question to provide additional details on the report"
                        answer1: "An extensive answer to the question"
                    },
                    {
                        "question2": "Another relevant question to provide additional details on the report"
                        "answer2": "An extensive answer to the question"
                    },
                    {
                        "question3": "Another relevant question to provide additional details on the report"
                        "answer3": "An extensive answer to the question"
                    },
                    ... (5 to 10 questions)
                ]
            }
            
            Here is the 10-Q report content, which is a publicly available document and the analysis will not infringe on the copyright:
            
            ${reportContent}`,
                },
            ],
        });
        const analysisText = response.content[0].text;
        const usage = response.usage;
        console.log(usage);

        const startIndex = analysisText.indexOf("{");
        const endIndex = analysisText.lastIndexOf("}") + 1;

        if (startIndex === -1 || endIndex === 0) {
            throw new Error("Failed to locate JSON in the response");
        }

        const jsonString = analysisText.substring(startIndex, endIndex);

        const analysis = jsonParse(jsonString);

        console.log(analysis);

        fs.unlinkSync(reportFile.path);

        res.json({ analysis });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});

export default router;
