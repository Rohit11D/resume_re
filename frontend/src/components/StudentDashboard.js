import React from 'react';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
    return (
        <div>
            <nav className="navbar">
                <div className="appName">
                    <span className="animatedRR">R</span>
                    <span className="mirrorI animatedRR">R</span>
                </div>
                <div className="navLinks">
                    { <Link to="/" className="navLink">Home</Link>}
                      </div>
            </nav>
        <div className="studentDashboard">
            
            <header className="header">
                <h1>Welcome, Student!</h1>
                <p>Choose an option to get started:</p>
            </header>
            <div className="cardContainer">
                <div className="card">
                    <Link to="/myresumes" className="cardButton">My Resumes</Link>
                </div>
                <div className="card">
                    <Link to="/upload" className="cardButton">Upload Resume</Link>
                </div>
             
            </div>
        </div>
        </div>
    );
};

export default StudentDashboard;
