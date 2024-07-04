const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/', async (req, res) => {
    try {
        const { answers } = req.body;
        const detailedFeedback = [];

        for (const answer of answers) {
            const question = await Question.findOne({ questionText: answer.question });
            if (question) {
                detailedFeedback.push({
                    question: question.questionText,
                    yourAnswer: answer.answer,
                    correctAnswer: question.correctAnswer
                });
            }
        }

        // Generate intelligent feedback using Gemini API
        const feedbackPrompt = `
        The student has completed a math quiz. Here are their answers and the correct answers:
        ${JSON.stringify(detailedFeedback)}
        Provide detailed feedback on their performance, including which answers are correct or incorrect, which topics they need to improve on, and suggest resources for further study. 
        The response should be in JSON format, structured as:
        {
          "overallMessage": "Overall feedback message",
          "detailedFeedback": [
            {
              "question": "Question text",
              "yourAnswer": "The student's answer",
              "correctAnswer": "The correct answer",
              "isCorrect": true/false
            },
            ...
          ],
          "resources": [
            {
              "topic": "Topic name",
              "link": "URL to the resource"
            },
            ...
          ]
        }
        `;

        const feedbackResult = await model.generateContent(feedbackPrompt);
        const feedbackResponse = await feedbackResult.response;
        const feedbackText = await feedbackResponse.text();

        console.log('Feedback from Gemini API:', feedbackText);

        // Attempt to extract JSON string from feedbackText
        const jsonStart = feedbackText.indexOf('{');
        const jsonEnd = feedbackText.lastIndexOf('}') + 1;
        const jsonString = feedbackText.substring(jsonStart, jsonEnd);

        if (jsonStart !== -1 && jsonEnd !== -1) {
            const feedback = JSON.parse(jsonString);
            res.json({ feedback });
        } else {
            console.error('No JSON object found in the response');
            res.status(500).send('Error generating feedback');
        }
    } catch (error) {
        if (error.response) {
            console.error('Error response from Gemini API:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received from Gemini API:', error.request);
        } else {
            console.error('Error setting up request to Gemini API:', error.message);
        }
        res.status(500).send('Error submitting answers');
    }
});

module.exports = router;
