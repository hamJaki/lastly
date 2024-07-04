const WebSocket = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        const { question, context } = JSON.parse(message);
        console.log(`Received question: ${question}`);
        console.log(`Context: ${JSON.stringify(context)}`);

        try {
            const prompt = `
            Here are the test questions and answers:
            ${context.questions.map((q, index) => `Question ${index + 1}: ${q.questionText}\nAnswer: ${context.answers[index] || 'Not answered yet'}`).join('\n')}
            Student's question: ${question}
            Tutor:
            Please provide your response in the following JSON format:
            {
                "response": "Your detailed explanation here."
            }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            console.log('Response from Gemini API:', text);

            // Extract JSON string from the text response
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.substring(jsonStart, jsonEnd);

            let tutorResponse;
            try {
                const jsonResponse = JSON.parse(jsonString);
                tutorResponse = jsonResponse.response;
            } catch (parseError) {
                console.error('Failed to parse response:', text);
                ws.send(JSON.stringify({ error: 'Failed to parse response' }));
                return;
            }

            if (tutorResponse) {
                ws.send(JSON.stringify({ response: tutorResponse }));
                console.log('Sent response:', tutorResponse);
            } else {
                ws.send(JSON.stringify({ error: 'Failed to generate response' }));
                console.error('Failed to generate response:', text);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response from Gemini API:', error.response.data);
            } else if (error.request) {
                console.error('No response received from Gemini API:', error.request);
            } else {
                console.error('Error setting up request to Gemini API:', error.message);
            }
            ws.send(JSON.stringify({ error: 'Error processing request' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
