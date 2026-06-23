// middlewares/adminMiddleware.js
export function clientMiddleware(req, res, next) {
    if (req.user.role !== 'client') {
        return res.status(403).json({ error: 'Accès réservé aux clients' });
    }
    next();
}