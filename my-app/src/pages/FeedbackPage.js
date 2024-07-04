import React from 'react';
import { useLocation } from 'react-router-dom';

const FeedbackPage = () => {
    const location = useLocation();
    const { feedback } = location.state.data;

    return (
        <div>
            <h1>Test Feedback</h1>
            <p>{feedback}</p>
        </div>
    );
};

export default FeedbackPage;
