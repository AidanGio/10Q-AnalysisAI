import React, { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
// const apiUrl = "http://localhost:3000";
const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setPdfUrl("");
    };

    const handleUrlChange = (e) => {
        setPdfUrl(e.target.value);
        setSelectedFile(null);
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile && !pdfUrl) return;

        setIsAnalyzing(true);

        const formData = new FormData();
        if (selectedFile) {
            formData.append("report", selectedFile);
        } else {
            formData.append("pdfUrl", pdfUrl);
        }

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
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-green-400 mb-8">10-Q Analysis Tool</h1>
                <form onSubmit={handleReportSubmit} className="mb-8 space-y-4">
                    <div className="relative">
                        <input type="file" accept=".pdf" onChange={handleFileChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                        <div className="bg-gray-800 text-gray-300 border border-gray-700 rounded p-2 text-sm">{selectedFile ? selectedFile.name : "Choose File"}</div>
                    </div>
                    <div className="relative">
                        <input
                            type="url"
                            placeholder="Or enter PDF URL"
                            value={pdfUrl}
                            onChange={handleUrlChange}
                            className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded p-2 text-sm"
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" disabled={isAnalyzing}>
                        {isAnalyzing ? "Analyzing..." : "Analyze Report"}
                    </button>
                </form>

                {analysis && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 text-green-400">Summary</h2>
                        <p className="mb-6 text-gray-300">{analysis.summary}</p>

                        <h2 className="text-2xl font-bold mb-4 text-green-400">Questions and Answers</h2>
                        <ul className="space-y-4">
                            {analysis.questions.map((questionObj, index) => {
                                const questionKey = `question${index + 1}`;
                                const answerKey = `answer${index + 1}`;
                                return (
                                    <li key={questionKey} className="border-b border-gray-700 pb-4">
                                        <div onClick={() => handleQuestionClick(index)} className="cursor-pointer hover:text-green-400">
                                            <strong>{questionObj[questionKey]}</strong>
                                        </div>
                                        {expandedQuestion === index && <p className="mt-2 pl-4 text-gray-400">{questionObj[answerKey]}</p>}
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
