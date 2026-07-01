import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';

// Routes
import adminCommandeRoutes from './routes/admin/commandeRoutes.js';
import clientRoutes from './routes/admin/usersRoutes.js';
import servicesRoutes from './routes/admin/servicesRoutes.js';

import notificationRoutes from './routes/admin/notificationRoutes.js';
import paiementRoutes from './routes/admin/paiementRoutes.js';
import livraisonRoutes from './routes/admin/livraisonRoutes.js';
import livreurRoutes from './routes/livreur/commandesRoutes.js';
import authRoutes from './routes/client/authRoutes.js';
import clientRoute from './routes/client/clientRoutes.js';
import livreurAuthRoutes from './routes/livreur/auth/authRoutes.js';
import AdminAuth from './routes/admin/authRoutes.js';
import profilRoutes from './routes/admin/profilRoutes.js';
import livreurRoute from './routes/livreur/livreurRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. Configuration Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});
app.set('io', io);

// 2. Log du transport (pour debug)
io.engine.on('connection', (socket) => {
  console.log(' Connexion Engine.IO établie (transport :', socket.transport.name, ')');
});

// 3. Middleware d'authentification Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('🔑 Token brut reçu :', token ? token.substring(0, 30) + '...' : 'null');

  if (!token) {
    console.warn(' Token manquant');
    return next(new Error('Token manquant'));
  }

  try {
    // ✅ Vérification complète avec log de l'erreur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token décodé :', decoded);
    socket.userId = decoded.public_id;
    socket.role = decoded.role;
    console.log(` Socket authentifié : ${socket.userId} (${socket.role})`);
    next();
  } catch (err) {
    console.error('❌ Erreur de vérification du token :', err.name, err.message);
    // Afficher plus de détails
    if (err.name === 'TokenExpiredError') {
      console.error('⏰ Le token a expiré. Reconnectez-vous.');
    } else if (err.name === 'JsonWebTokenError') {
      console.error('🔐 Signature invalide. Vérifiez JWT_SECRET.');
    } else {
      console.error('⚠️ Autre erreur :', err);
    }
    return next(new Error('Token invalide'));
  }
});
// 4. Gestion des connexions (unique)
io.on('connection', (socket) => {
  console.log(` Client connecté : ${socket.userId} (${socket.role})`);

  // --- Rooms personnelles (pour tous) ---
  if (socket.userId) {
    socket.join(`user_${socket.userId}`);
    console.log(` Room rejointe : user_${socket.userId}`);
  }

  // --- Rooms par rôle (pour les notifications collectives) ---
  if (socket.role === 'admin') {
    socket.join('admins');
    console.log(` Admin ${socket.userId} a rejoint la room admins`);
  } else if (socket.role === 'livreur') {
    socket.join('livreurs');
    console.log(` Livreur ${socket.userId} a rejoint la room livreurs`);
  } else if (socket.role === 'client') {
    socket.join('clients');
    console.log(` Client ${socket.userId} a rejoint la room clients`);
  }

  // --- Événements ---
  socket.on('disconnect', () => {
    console.log(` Client déconnecté : ${socket.userId} (${socket.role})`);
  });

  socket.on('error', (err) => {
    console.error(' Erreur socket :', err);
  });
});

// 5. Middlewares HTTP
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// 6. Routes
app.get('/backend', (req, res) => {
  res.json({ message: "Bienvenue sur l'API du Pressing !" });
});

app.use('/api/admin/authentification', AdminAuth);
app.use('/api/admin', notificationRoutes);
app.use('/api/admin', profilRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoute);
app.use('/api/livreur', livreurAuthRoutes);
app.use('/api/livreur', livreurRoutes);
app.use('/api/admin/commandes', adminCommandeRoutes);
app.use('/api/admin/clients', clientRoutes);
app.use('/api/admin/services', servicesRoutes);
app.use('/api/admin/paiements', paiementRoutes);
app.use('/api/admin/livraisons', livraisonRoutes);
app.use('/api/livreur', livreurRoute);

// 7. 404 et gestion d'erreurs
app.use((req, res) => {
  res.status(404).json({ message: "Désolé, cette page n'existe pas." });
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Serveur en ligne sur http://localhost:${PORT}`);
});