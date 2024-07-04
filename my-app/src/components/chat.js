import React, { useState, useEffect, useRef } from 'react';

const Chat = ({ topic, context }) => {
    const [question, setQuestion] = useState('');
    const [chat, setChat] = useState([]);
    const [error, setError] = useState(null);
    const [isWsConnected, setIsWsConnected] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
            setIsWsConnected(true);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
            setIsWsConnected(false);
        };

        ws.current.onmessage = (event) => {
            const { response, error } = JSON.parse(event.data);
            if (response) {
                setChat((prevChat) => [...prevChat, { question, response }]);
                setQuestion(''); // Clear the input field after getting a response
            } else if (error) {
                setError(error);
                console.error('Error from server:', error);
            }
        };

        ws.current.onerror = (err) => {
            console.error('WebSocket error:', err);
            setError('WebSocket error');
        };

        return () => {
            ws.current.close();
        };
    }, [context]);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleAskQuestion = (e) => {
        e.preventDefault();
        if (!question.trim() || !isWsConnected) return;

        setError(null);
        ws.current.send(JSON.stringify({ question: `${topic}: ${question}`, context }));
    };

    return (
        <div className="chat-container">
            <h3>Ask Questions to Tutor</h3>
            <form onSubmit={handleAskQuestion}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        value={question}
                        onChange={handleQuestionChange}
                        placeholder="Type your question here"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={!isWsConnected}>
                    Ask
                </button>
            </form>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <div className="chat-history mt-4">
                {chat.map((chatItem, index) => (
                    <div key={index} className="chat-item">
                        <p><strong>Tutor:</strong> {chatItem.response}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
