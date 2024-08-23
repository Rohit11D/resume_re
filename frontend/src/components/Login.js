import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';

const Api_URL = "http://localhost:5000";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleLogin = async () => {
        let responseData;
        await fetch(Api_URL + `/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((data) => responseData = data);
        
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            login(responseData.user.role); // Pass the user role to the login function
            navigate('/');
        } else {
            alert(responseData.errors);
        }
    }

    return (
        <div className="form-container">
            <h2>Login</h2>
            <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
            <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
            <button type="submit" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;

