export const verifylivreur = (req, res, next) => {
  if (!req.user || req.user.role !== 'livreur') {
    return res.status(403).json({ error: 'Accès réservé aux livreurs' });
  }
  next();
};