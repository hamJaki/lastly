import React from 'react';
import Card from "../components/card";
import solveproblemlogo from '../logo/solveproblemlogo.webp';
import journey from '../logo/journeylogo.webp';
import competitionlogo from '../logo/competitionlogo.webp';

const containerStyle = {
    backgroundColor: '#0a192f',
    color: '#cbd5e0',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
};

const cardsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '20px'
};

const titleStyle = {
    color: '#63b3ed',
    marginBottom: '20px'
};

function HomePage() {
    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Welcome to TutorAI</h1>
            <div style={cardsContainerStyle}>
                <Card
                    title="Solve Problems"
                    text="Get step-by-step solutions to math problems"
                    icon={solveproblemlogo}
                    link="/problems"
                    bgColor="#2b6cb0"
                />
                <Card
                    title="Start Test"
                    text="Take a practice test to assess your skills"
                    icon={journey}
                    link="/journey"
                    bgColor="#4a5568"
                />
                <Card
                    title="Competition"
                    text="Join our monthly math competition"
                    icon={competitionlogo}
                    link="/competitions"
                    bgColor="#2b6cb0"
                />
            </div>
        </div>
    );
}

export default HomePage;
