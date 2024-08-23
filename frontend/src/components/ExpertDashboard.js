import React, { useEffect, useState } from 'react';
import './ExpertDashboard.css';
import { Link } from 'react-router-dom';
const Api_URL = "http://localhost:5000";

const ExpertDashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [review, setReview] = useState("");
    const [selectedResumeId, setSelectedResumeId] = useState(null);

    const fetchResumes = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(Api_URL + '/resumes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();
            if (response.ok) {
                setResumes(responseData);
            } else {
                alert(responseData.message || 'Error fetching resumes');
            }
        } catch (error) {
            console.error(error);
            alert('Error fetching resumes');
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const submitReview = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(Api_URL + `/resumes/review/${selectedResumeId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ review }),
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Review submitted successfully');
                setReview("");
                setSelectedResumeId(null);
                // Fetch resumes again to update the list with the new review
                fetchResumes();
            } else {
                alert(responseData.message || 'Error submitting review');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting review');
        }
    };

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
       
        <div className="expertDashboard">
            
            <div className='titleH1'>
            <h1>Expert Dashboard</h1>
            <p>Give Your Best</p>
            </div>
            <div>
            {resumes.length > 0 ? (
                <div className="resumelist">
                    {resumes.map((resume) => (
                        <div className="resumeCard" key={resume._id}>
                              <h2>{resume.student?.name || 'Unknown Student'}</h2>
                            <a href={`http://localhost:5000/${resume.resumeFile}`} target="_blank" rel="noopener noreferrer">
                                View Resume
                            </a>
                            <textarea
                                value={selectedResumeId === resume._id ? review : ""}
                                onChange={(e) => {
                                    setReview(e.target.value);
                                    setSelectedResumeId(resume._id);
                                }}
                                placeholder="Write your review here..."
                            />
                            <button onClick={submitReview}>Submit Review</button>
                            <div className="reviews">
                                <h3>Reviews:</h3>
                                {resume.reviews.map((rev, index) => (
                                    <div key={index} className="review">
                                        <p>{rev.review}</p>
                                        <small>By Expert: {rev.expert?.name || 'Unknown Expert'}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No resumes available.</p>
            )}
            </div>
        </div>
        </div>
    );
};

export default ExpertDashboard;
