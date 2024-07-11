import React, { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
// const apiUrl = "http://localhost:3000";
const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setPdfUrl("");
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append("report", selectedFile);

        try {
            const response = await axios.post(`${apiUrl}/claude/analyze`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAnalysis(response.data.analysis);
            setIsAnalyzing(false);
        } catch (error) {
            console.error("Error:", error);
            setIsAnalyzing(false);
        }
    };

    const handleQuestionClick = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">10-Q Analysis Tool</h1>
                <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                    <form onSubmit={handleReportSubmit} className="space-y-4">
                        <div className="relative">
                            <input type="file" accept=".pdf" onChange={handleFileChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                            <div className="bg-gray-100 border-2 border-gray-300 rounded p-2 text-sm">{selectedFile ? selectedFile.name : "Choose File"}</div>
                        </div>
                        <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 transition duration-300" disabled={isAnalyzing}>
                            {isAnalyzing ? "Analyzing..." : "Analyze Report"}
                        </button>
                    </form>
                </div>

                {analysis && (
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Summary</h2>
                        <p className="mb-6">{analysis.summary}</p>

                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Questions and Answers</h2>
                        <ul className="space-y-4">
                            {analysis.questions.map((questionObj, index) => {
                                const questionKey = `question${index + 1}`;
                                const answerKey = `answer${index + 1}`;
                                return (
                                    <li key={questionKey} className="border-b border-gray-200 pb-4">
                                        <div onClick={() => handleQuestionClick(index)} className="cursor-pointer hover:text-gray-600 transition duration-300">
                                            <strong>{questionObj[questionKey]}</strong>
                                        </div>
                                        {expandedQuestion === index && <p className="mt-2 pl-4 text-gray-600">{questionObj[answerKey]}</p>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
