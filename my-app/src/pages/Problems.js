import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chat from '../components/chat';

const Problems = () => {
    const { topic } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState(null);

    const generateQuestions = () => {
        setLoading(true);
        setError(null);
        setFeedback(null);
        setAnswers({});  // Reset answers

        axios.get(`http://localhost:5001/generate-test/${topic}`)
            .then(res => {
                console.log('Questions received from backend:', res.data);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedAnswers = Object.keys(answers).map(index => ({
            question: questions[index].questionText,
            answer: answers[index]
        }));

        axios.post('http://localhost:5001/submit-test', { answers: formattedAnswers })
            .then(res => {
                console.log('Feedback received from backend:', res.data);
                setFeedback(res.data.feedback);
            })
            .catch(err => {
                console.error('Error submitting answers:', err);
                setError('Failed to submit answers');
            });
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4">Generate Math Questions on {topic}</h1>
            <button
                onClick={generateQuestions}
                className="btn btn-primary mb-4"
            >
                Generate Questions
            </button>
            {loading && <div className="alert alert-info">Loading questions...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {questions.length > 0 && (
                <div>
                    <h2 className="mb-4">Answer the Questions</h2>
                    <form onSubmit={handleSubmit}>
                        {questions.map((question, index) => (
                            <div key={index} className="mb-3">
                                <label className="form-label">{question.questionText}</label>
                                <input
                                    type="text"
                                    placeholder="Your answer"
                                    onChange={e => handleChange(e, index)}
                                    className="form-control"
                                />
                            </div>
                        ))}
                        <button type="submit" className="btn btn-success">Submit Answers</button>
                    </form>
                </div>
            )}
            {feedback && (
                <div className="mt-4">
                    <h3 className="mb-4">Feedback</h3>
                    <div className="card bg-dark text-white mb-3">
                        <div className="card-body">
                            <p className="card-text">{feedback.overallMessage}</p>
                            <h5 className="card-title">Detailed Feedback:</h5>
                            <ul className="list-group list-group-flush">
                                {feedback.detailedFeedback && feedback.detailedFeedback.map((fb, index) => (
                                    <li key={index} className="list-group-item">
                                        <p><strong>Question:</strong> {fb.question}</p>
                                        <p><strong>Your Answer:</strong> {fb.yourAnswer}</p>
                                        <p><strong>Correct Answer:</strong> {fb.correctAnswer}</p>
                                        <p><strong>{fb.isCorrect ? "Correct" : "Incorrect"}</strong></p>
                                    </li>
                                ))}
                            </ul>
                            <h5 className="card-title mt-4">Suggested Resources:</h5>
                            <ul className="list-group list-group-flush">
                                {feedback.resources && feedback.resources.map((resource, index) => (
                                    <li key={index} className="list-group-item">
                                        <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.topic}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {/* Embed Chat Component here */}
            {feedback && <Chat topic={topic} context={{ questions, answers }} />}
        </div>
    );
};

export default Problems;
