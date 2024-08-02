import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        const role = localStorage.getItem('user-role');
        if (token && role) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    const login = (role) => {
        setIsAuthenticated(true);
        setUserRole(role);
        localStorage.setItem('user-role', role);
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
