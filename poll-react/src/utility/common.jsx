import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
const TOKEN = 'token';

export const saveToken = (token) => {
    Cookies.set(TOKEN, token);
};

export const getToken = () => {
    return Cookies.get(TOKEN) || null;
};

export const removeToken = () => {
    Cookies.remove(TOKEN);
};

export const decodeToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Failed to decode token:', error);
        removeToken();  // Auto-remove invalid token to prevent repeated errors
        return null;
    }
};

export const isTokenValid = () => {
    const decodedToken = decodeToken();
    if (!decodedToken || !decodedToken.exp) return false;
    
    const expiry = decodedToken.exp * 1000; // Convert to milliseconds
    return Date.now() < expiry;
};