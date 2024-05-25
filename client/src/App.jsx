import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'

const App = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [questionButtons, setQuestionButtons] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!pdfFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("pdf", pdfFile);

        try {
            const response = await axios.post("/api/analyze", formData);
            setSummary(response.data.summary);
            setQuestionButtons(response.data.questionButtons);
        } catch (error) {
            console.error("Error:", error);
        }
        setLoading(false);
    };

    const handleQuestionClick = async (question) => {
        setLoading(true);
        try {
            const response = await axios.post("/api/question", { question });
            console.log(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>10-Q Financial Report Analysis</h1>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
            </button>

            {summary && (
                <div>
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}

            {questionButtons.length > 0 && (
                <div>
                    <h2>Questions</h2>
                    {questionButtons.map((question, index) => (
                        <button key={index} onClick={() => handleQuestionClick(question)} disabled={loading}>
                            {question}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
