const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get('/:topic', async (req, res) => {
    const topic = req.params.topic;
    try {
        console.log(`Request to generate questions for topic: ${topic} received`);

        const prompt = `
        Generate 8 math questions for school students on the topic of ${topic}. Provide the questions and their correct answers in JSON format, without additional text. The format should be:
        [
          {
            "questionText": "Question text here",
            "correctAnswer": "Correct answer here",
          },
          ...
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        console.log('Response from Gemini API:', text);

        // Ensure the response is trimmed to extract only JSON
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']') + 1;
        const jsonString = text.substring(jsonStart, jsonEnd);

        let questions;
        try {
            questions = JSON.parse(jsonString).map(question => ({
                ...question,
                difficulty: 'medium'  // Ensure that the difficulty field is included
            }));
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return res.status(500).send('Error parsing questions');
        }

        console.log('Parsed Questions:', questions);

        const questionPromises = questions.map(async (q) => {
            const newQuestion = new Question(q);
            await newQuestion.save();
        });

        await Promise.all(questionPromises);

        res.json(questions);
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
        res.status(500).send('Error generating quiz questions');
    }
});

module.exports = router;
