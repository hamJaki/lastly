const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    correctAnswer: { type: String, default: '' }, // Allow empty string as a default value
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;