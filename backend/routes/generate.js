const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const cors = require('cors');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.use(cors());

router.get('/', async (req, res) => {
    try {
        console.log('Request to generate questions received');

        const prompt = `
        Create a test with 25 questions to assess a student's knowledge of school mathematics, using topics from the Kazakhstan education system as listed on the Bilimland.kz website. The questions should cover the following topics: Numbers and Algebra, Functions and Graphs, Geometry, Trigonometry, Probability, and Statistics. Each question should have four answer options, with only one correct answer. Return the questions in JSON format, like so:

        [
          {
            "questionText": "Question text here",
            "answerOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": "Correct answer here"
          },
          ...
        ]
        `;

        console.log('Prompt:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        console.log('Response from Gemini API:', text);

        // Ensure the response is trimmed to extract only JSON
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']') + 1;
        if (jsonStart === -1 || jsonEnd === -1) {
            console.error('No JSON array found in the response');
            console.error('Full response:', text);  // Log the full response for debugging
            return res.status(500).send('Error parsing questions');
        }

        const jsonString = text.substring(jsonStart, jsonEnd);

        let questions;
        try {
            questions = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Full JSON string:', jsonString);  // Log the JSON string for debugging
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
        console.error('Error generating quiz questions:', error);
        res.status(500).send('Error generating quiz questions');
    }
});

module.exports = router;
