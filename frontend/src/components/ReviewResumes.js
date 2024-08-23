import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const ReviewResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [review, setReview] = useState('');

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                };
                const { data } = await axiosInstance.get('/resume', config);
                setResumes(data);
            } catch (error) {
                console.error(error);
                alert('Error fetching resumes');
            }
        };

        fetchResumes();
    }, []);

    const submitReview = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            await axiosInstance.post(`/resume/review/${id}`, { review }, config);
            alert('Review submitted successfully');
        } catch (error) {
            console.error(error);
            alert('Error submitting review');
        }
    };

    return (
        <div>
            {resumes.map((resume) => (
                <div key={resume._id}>
                    <h3>{resume.student.name}'s Resume</h3>
                    <a href={`http://localhost:5000/${resume.resumeFile}`} target="_blank" rel="noopener noreferrer">
                        View Resume
                    </a>
                    <div>
                        <input
                            type="text"
                            placeholder="Write a review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                        <button onClick={() => submitReview(resume._id)}>Submit Review</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewResumes;
