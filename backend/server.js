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
import paiementRoutes from './routes/admin/paiementRoutes.js';
import livraisonRoutes from './routes/admin/livraisonRoutes.js';
import livreurRoutes from './routes/livreur/commandesRoutes.js';
import authRoutes from './routes/client/authRoutes.js';
import clientRoute from './routes/client/clientRoutes.js';
import livreurAuthRoutes from './routes/livreur/auth/authRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Configuration Socket.IO (améliorée)
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,        // ← Compatibilité avec clients plus anciens
  pingTimeout: 60000,     // ← Évite les déconnexions intempestives
  pingInterval: 25000,
});
app.set('io', io);

// ✅ Log de la connexion Engine.IO (pour debug)
io.engine.on('connection', (socket) => {
  console.log('🔌 Connexion Engine.IO établie (transport :', socket.transport.name, ')');
});

// ✅ Middleware d'authentification Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('🔐 Tentative de connexion Socket, token présent :', !!token);

  if (!token) {
    console.warn('❌ Token manquant');
    return next(new Error('Token manquant'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.public_id;
    socket.role = decoded.role;
    console.log(`✅ Socket authentifié : ${socket.userId} (${socket.role})`);
    next();
  } catch (err) {
    console.error('❌ Token invalide :', err.message);
    return next(new Error('Token invalide'));
  }
});

// ✅ Gestion des connexions
io.on('connection', (socket) => {
  console.log(`🟢 Client connecté : ${socket.userId} (${socket.role})`);

  if (socket.userId) {
    socket.join(`user_${socket.userId}`);
    console.log(`📦 Room rejointe : user_${socket.userId}`);
  }

  socket.on('disconnect', () => {
    console.log(`🔴 Client déconnecté : ${socket.userId}`);
  });

  socket.on('error', (err) => {
    console.error('❌ Erreur socket :', err);
  });
});

// ✅ Middlewares HTTP (inchangés)
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Routes publiques
app.get('/backend', (req, res) => {
  res.json({ message: "Bienvenue sur l'API du Pressing !" });
});
io.on('connection', (socket) => {
  console.log(`🟢 Client connecté : ${socket.userId} (${socket.role})`);

  // ✅ Rejoindre la room des admins si le rôle est 'admin'
  if (socket.role === 'admin') {
    socket.join('admins');
    console.log(`👑 Admin ${socket.userId} a rejoint la room admins`);
  }

  if (socket.userId) {
    socket.join(`user_${socket.userId}`);
    console.log(`📦 Room rejointe : user_${socket.userId}`);
  }

  // ...
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoute);
app.use('/api/livreur', livreurAuthRoutes);
app.use('/api/livreur', livreurRoutes);
app.use('/api/admin/commandes', adminCommandeRoutes);
app.use('/api/admin/clients', clientRoutes);
app.use('/api/admin/services', servicesRoutes);
app.use('/api/admin/paiements', paiementRoutes);
app.use('/api/admin/livraisons', livraisonRoutes);

// Middleware 404 (après toutes les routes)
app.use((req, res) => {
  res.status(404).json({ message: "Désolé, cette page n'existe pas." });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// ✅ Démarrer le serveur HTTP
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});