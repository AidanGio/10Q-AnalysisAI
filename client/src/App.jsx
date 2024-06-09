import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [chatbotResponse, setChatbotResponse] = useState("");
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        console.log("Selected file:", e.target.files[0]);
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("report", selectedFile);
        try {
            const response = await axios.post("http://localhost:3000/claude/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAnalysis(response.data.analysis);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleQuestionClick = async (question) => {
        setSelectedQuestion(question);
        try {
            const response = await axios.post("/api/answer", { question });
            setChatbotResponse(response.data.answer);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h1>10-Q Analysis Chatbot</h1>
            <form onSubmit={handleReportSubmit}>
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                <button type="submit">Analyze</button>
            </form>

            {analysis && (
                <div>
                    <h2>Summary</h2>
                    <p>{analysis.summary}</p>

                    <h2>Questions</h2>
                    <ul>
                        {analysis.questions.map((questionObj, index) => {
                            const questionKey = `question${index + 1}`;
                            return <li key={questionKey}>{questionObj[questionKey]}</li>;
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
