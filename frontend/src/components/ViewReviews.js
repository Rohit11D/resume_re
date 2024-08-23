import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const ViewReviews = () => {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                };
                const { data } = await axiosInstance.get('/resume/myresumes', config);
                setResumes(data);
            } catch (error) {
                console.error(error);
                alert('Error fetching resumes');
            }
        };

        fetchResumes();
    }, []);

    return (
        <div>
            {resumes.map((resume) => (
                <div key={resume._id}>
                    <h3>Your Resume</h3>
                    <a href={`http://localhost:5000/uploads/${resume.resumeFile}`} target="_blank" rel="noopener noreferrer">
                        View Resume
                    </a>
                    <div>
                        <h4>Reviews:</h4>
                        {resume.reviews.length > 0 ? (
                            resume.reviews.map((review, index) => (
                                <div key={index}>
                                    <p><strong>{review.expert.name}:</strong> {review.review}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ViewReviews;
