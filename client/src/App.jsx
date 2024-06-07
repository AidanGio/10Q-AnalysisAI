import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [chatbotResponse, setChatbotResponse] = useState("");

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
            setSummary(response.data.summary);
            setQuestions(response.data.questions);
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

            {summary && (
                <div>
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}

            {questions.length > 0 && (
                <div>
                    <h2>Questions</h2>
                    {questions.map((question, index) => (
                        <button key={index} onClick={() => handleQuestionClick(question)}>
                            {question}
                        </button>
                    ))}
                </div>
            )}

            {chatbotResponse && (
                <div>
                    <h2>Chatbot Response</h2>
                    <p>{chatbotResponse}</p>
                </div>
            )}
        </div>
    );
};

export default App;
