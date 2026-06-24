// middlewares/adminMiddleware.js
export function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    next();
}