import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UploadResume from './components/UploadResume';
import ReviewResumes from './components/ReviewResumes';
import ViewReviews from './components/ViewReviews'; // Import the new component
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import MyResumes from './components/myResumes';
import ExpertDashboard from './components/ExpertDashboard.js';
import StudentDashboard from './components/StudentDashboard.js';
import { AuthProvider } from './components/AuthContext.js';
const App = () => {
    return (
        <AuthProvider>
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/upload" element={<UploadResume />} />
                <Route path="/reviews" element={<ReviewResumes />} />
                <Route path="/my-reviews" element={<ViewReviews />} /> {/* Add the new route */}
                {/* Add more routes as needed */}
                <Route path="/myresumes" element={<MyResumes />}/>
                <Route path="/ExpertDashboard" element={<ExpertDashboard />}/>
                <Route path='/StudentDashboard' element={<StudentDashboard />}></Route>
            </Routes>
        </Router>
        </AuthProvider>
    );
};

export default App;
