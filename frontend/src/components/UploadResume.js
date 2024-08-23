import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './UploadResume.css';

const Api_URL = "http://localhost:5000";

const UploadResume = () => {
    const [file, setFile] = useState(false);
    const navigate = useNavigate();
    const uploadHandler = async (e) => {
        e.preventDefault();
        setFile(e.target.file);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const token = localStorage.getItem('auth-token');
            console.log('Token:', token); // Check token value
    
            const response = await fetch(Api_URL + `/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Ensure token is in correct format
                },
                body: formData
            });
    
            console.log('Response:', response);
            const responseData = await response.json();
            if (response.ok) {
                alert('Resume uploaded successfully');
                navigate('/studentDashboard'); // Redirect to student dashboard
            } else {
                alert(responseData.message || 'Error uploading resume');
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading resume');
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
        <form onSubmit={uploadHandler} className='form'>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit">Upload Resume</button>
        </form>
        </div>
    );
};

export default UploadResume;
