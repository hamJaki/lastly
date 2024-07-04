import React, { useState } from 'react';
import axios from 'axios';

const QuestionInterface = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [difficulty, setDifficulty] = useState('medium');

    const generateQuestions = () => {
        setLoading(true);
        setError(null);

        axios.get('http://localhost:5001/generate-test')
            .then(res => {
                setQuestions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading questions:', err);
                setError('Failed to load questions');
                setLoading(false);
            });
    };

    const handleChange = (e, index) => {
        setAnswers({ ...answers, [index]: e.target.value });
    };

    const handleSubmit = () => {
        const formattedAnswers = Object.keys(answers).map(index => ({
            question: questions[index],
            answer: answers[index]
        }));

        axios.post('http://localhost:5001/submit-test', { answers: formattedAnswers })
            .then(res => {
                alert('Answers submitted successfully!');
            })
            .catch(err => {
                console.error('Error submitting answers:', err);
                setError('Failed to submit answers');
            });
    };

    return (
        <div className="question-interface">
            <h2>Generate Math Questions</h2>
            <div>
                <label htmlFor="difficulty">Select Difficulty: </label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button onClick={generateQuestions}>Generate Questions</button>
            </div>
            {loading && <p>Loading questions...</p>}
            {error && <p className="error">{error}</p>}
            {questions.length > 0 && (
                <div>
                    <h3>Answer the Questions</h3>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p>{question}</p>
                            <input
                                type="text"
                                onChange={e => handleChange(e, index)}
                            />
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Submit Answers</button>
                </div>
            )}
        </div>
    );
};

export default QuestionInterface;
