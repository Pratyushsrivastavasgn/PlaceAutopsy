import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { googleLogout } from '@react-oauth/google';
import { createOrUpdateUser } from '@/services/firestoreService';

export interface GoogleUser {
    id: string;
    name: string;
    email: string;
    picture: string;
}

interface AuthContextType {
    googleUser: GoogleUser | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    login: (credentialResponse: { credential?: string }) => void;
    logout: () => void;
}

const initialState: AuthContextType = {
    googleUser: null,
    isAuthenticated: false,
    isAuthLoading: true,
    login: () => { },
    logout: () => { },
};

export const AuthContext = createContext<AuthContextType>(initialState);

interface AuthProviderProps {
    children: ReactNode;
}

// Decode JWT token from Google
const decodeJWT = (token: string): GoogleUser | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        return {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
        };
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('analytix_google_user');
        if (savedUser) {
            try {
                setGoogleUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('analytix_google_user');
            }
        }
        setIsAuthLoading(false);
    }, []);

    const login = useCallback(async (credentialResponse: { credential?: string }) => {
        if (credentialResponse.credential) {
            const user = decodeJWT(credentialResponse.credential);
            if (user) {
                setGoogleUser(user);
                localStorage.setItem('analytix_google_user', JSON.stringify(user));
                console.log('Google login successful:', user.email);
                
                // Sync user to Firebase
                try {
                    await createOrUpdateUser({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        picture: user.picture,
                    });
                    console.log('User synced to Firebase');
                } catch (error) {
                    console.error('Failed to sync user to Firebase:', error);
                }
            }
        }
    }, []);

    const logout = useCallback(() => {
        googleLogout();
        setGoogleUser(null);
        localStorage.removeItem('analytix_google_user');
        localStorage.removeItem('analytix_user');
        localStorage.removeItem('analytix_analytics');
        console.log('Logged out');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                googleUser,
                isAuthenticated: !!googleUser,
                isAuthLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
