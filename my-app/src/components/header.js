import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2d3748' }}>
            <a className="navbar-brand" href="/my-app/public" style={{ marginLeft: '16px', color: '#63b3ed' }}>TutorAI</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="/my-app/public" style={{ color: '#e2e8f0' }}>Home <span className="sr-only"></span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/Problems" style={{ color: '#e2e8f0' }}>Problems</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/Ask-the-tutor" style={{ color: '#e2e8f0' }}>Ask the tutor</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
