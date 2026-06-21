
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ========================================
// 1️⃣ Vérifier la présence et la validité du token
// ========================================
export const verifierToken = (req, res, next) => {
  // Récupérer le token depuis l'en-tête Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Token manquant ou mal formaté.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, ... }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expirée. Veuillez vous reconnecter.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide.'
    });
  }
};


export const verifierRole = (roleRequis) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié.'
        });
      }
  
      if (req.user.role !== roleRequis) {
        return res.status(403).json({
          success: false,
          message: `Accès refusé. Ce contenu est réservé aux ${roleRequis}s.`
        });
      }
  
      next();
    };
  };