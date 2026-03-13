import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getCurrentUser } from '../services/api';
import { getItem, setItem, removeItem } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load auth state on startup
    useEffect(() => {
        (async () => {
            try {
                const uid = await getItem('uid');
                const storedRole = await getItem('role');
                const currentUser = await getCurrentUser();
                if (uid) {
                    setIsAuthenticated(true);
                    setUser(currentUser);
                    if (storedRole) {
                        setRole(storedRole);
                    } else {
                        // Fetch role from backend
                        const fetchedRole = await authAPI.getRole(uid);
                        if (fetchedRole) {
                            setRole(fetchedRole);
                            await setItem('role', fetchedRole);
                        }
                    }
                }
            } catch { }
            finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login(email, password);
        setIsAuthenticated(true);
        setUser(res.user);
        // Fetch role from backend
        const fetchedRole = await authAPI.getRole(res.user.uid);
        if (fetchedRole) {
            setRole(fetchedRole);
            await setItem('role', fetchedRole);
        }
        return res;
    };

    const signupAndVerify = async (userData) => {
        // After OTP verified, set auth state
        setIsAuthenticated(true);
        setUser(userData);
        const uid = await getItem('uid');
        if (uid) {
            const fetchedRole = await authAPI.getRole(uid);
            if (fetchedRole) {
                setRole(fetchedRole);
                await setItem('role', fetchedRole);
            }
        }
    };

    const logout = async () => {
        await authAPI.logout();
        setIsAuthenticated(false);
        setRole(null);
        setUser(null);
        await removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, user, loading, login, signupAndVerify, logout, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
