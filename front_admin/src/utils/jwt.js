// utils/jwt.js
export function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        console.error('Erreur de décodage du token:', error);
        return null;
    }
}