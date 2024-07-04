import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import HomePage from './pages/HomePage';
import Problems from './pages/Problems';
import Question from './components/QuestionInterface';
import Visualization from './pages/VisualizationPage';
import TopicsList from './components/topicList';
import TestPage from './pages/test';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<TestPage />} />
          <Route path="/Ask-the-tutor" element={<Visualization />} />
          <Route path="/problems" element={<TopicsList />} />
          <Route path="/generate-test/:topic" element={<Problems />} />
        </Routes>
      </div>
  );
}

export default App;
