import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from './AuthContext';

const Home = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    return (
        <div className="homeContainer">
            <nav className="navbar">
                <div className="appName">
                    
                    <span className="animatedRR">R</span>
                    <span className="mirrorI animatedRR">R</span>
                    <span className='simpleName'>ResRe</span>
                    
                </div>
                
                <div className="navLinks">
                    {!isAuthenticated && <Link to="/login" className="navLink">Login</Link>}
                    {!isAuthenticated && <Link to="/register" className="navLink">Sign Up</Link>}
                    {isAuthenticated && <a href="#" onClick={logout} className="navLink">Logout</a>}
          
                </div>
            </nav>
            <div className="header">
                <h1>Welcome to the Resume Review Platform</h1>
                <p>
                    This platform allows students to upload their resumes and get feedback from experts. Experts can register and review the resumes, providing valuable insights and suggestions.
                </p>
            </div>
            <div className="mainContent">
                <div className="tipsSection">
                    <h2>Resume Tips</h2>
                    <ul>
                        <li>Keep your resume concise and to the point.</li>
                        <li>Highlight your most relevant experiences and skills.</li>
                        <li>Use action verbs to describe your achievements.</li>
                        <li>Tailor your resume for each job application.</li>
                        <li>Include measurable results where possible.</li>
                    </ul>
                </div>
                {isAuthenticated && userRole === 'student' && (
                    <div className="dashboardLink">
                        <Link to="/studentDashboard" className="navLink">Go to Student Dashboard</Link>
                    </div>
                )}
                {isAuthenticated && userRole === 'expert' && (
                    <div className="dashboardLink">
                        <Link to="/expertDashboard" className="navLink">Go to Expert Dashboard</Link>
                    </div>
                )}
            </div>
            <footer className="footer">
                &copy; 2024 Resume Review Platform. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;
