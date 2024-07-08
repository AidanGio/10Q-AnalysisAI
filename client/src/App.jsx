import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append("report", selectedFile);
        try {
            const response = await axios.post("http://localhost:3000/claude/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAnalysis(response.data.analysis);
            setIsAnalyzing(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleQuestionClick = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-green-400 mb-8">10-Q Analysis Tool</h1>
                <form onSubmit={handleReportSubmit} className="mb-8">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="mb-4 block w-full text-sm text-gray-400 
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gray-800 file:text-green-400
                            hover:file:bg-gray-700"
                    />
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
