// middlewares/clientMiddleware.js
export function clientMiddleware(req, res, next) {
    console.log('🔍 clientMiddleware appelé');
    console.log('🔍 req.user :', req.user);
  
    if (!req.user) {
      console.log('❌ req.user est undefined');
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
  
    console.log('🔍 rôle reçu :', req.user.role);
  
    if (req.user.role !== 'client') {
      console.log('❌ Rôle incorrect, attendu "client"');
      return res.status(403).json({ error: 'Accès réservé aux clients' });
    }
  
    console.log('✅ Client autorisé');
    next();
  }