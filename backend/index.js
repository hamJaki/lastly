const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const generateTest = require('./routes/generateTest');
const submitTest = require('./routes/submitTest');
const generate = require('./routes/generate');
const submit = require('./routes/submit');
const { createServer } = require('http');
const WebSocket = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from frontend

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://myUser:myPassword123@cluster0.mongodb.net/math-test-app?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if MongoDB connection fails
    });

app.use('/generate-test', generateTest);
app.use('/submit-test', submitTest);
app.use('/generate', generate);  // This should match the path used in frontend
app.use('/submit', submit);      // This should match the path used in frontend

const server = createServer(app);
const wss = new WebSocket.Server({ server });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        const { question } = JSON.parse(message);
        try {
            const prompt = `
            Student: ${question}
            Tutor:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            const tutorResponse = text.split('Tutor:')[1]?.trim();

            if (tutorResponse) {
                ws.send(JSON.stringify({ response: tutorResponse }));
            } else {
                ws.send(JSON.stringify({ error: 'Failed to generate response' }));
            }
        } catch (error) {
            console.error('Error processing request:', error);
            ws.send(JSON.stringify({ error: 'Error processing request' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
