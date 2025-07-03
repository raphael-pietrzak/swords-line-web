// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configuration CORS pour Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// État du jeu
const gameState = {
  players: {},
  rooms: {},
  maxPlayersPerRoom: 6
};

// Classe pour gérer une room de jeu
class GameRoom {
  constructor(id) {
    this.id = id;
    this.players = {};
    this.gameStarted = false;
    this.lastUpdate = Date.now();
  }

  addPlayer(socket, playerData) {
    this.players[socket.id] = {
      id: socket.id,
      name: playerData.name || `Player${Object.keys(this.players).length + 1}`,
      x: Math.random() * 700 + 50,
      y: Math.random() * 300 + 50,
      direction: 'right',
      isMoving: false,
      isAttacking: false,
      animationFrame: 0,
      health: 100,
      color: this.getPlayerColor(Object.keys(this.players).length),
      joinedAt: Date.now()
    };
    
    socket.join(this.id);
    socket.emit('playerJoined', {
      playerId: socket.id,
      playerData: this.players[socket.id]
    });
    
    this.broadcastGameState();
    console.log(`Joueur ${socket.id} rejoint la room ${this.id}`);
  }

  removePlayer(socketId) {
    if (this.players[socketId]) {
      delete this.players[socketId];
      this.broadcastGameState();
      console.log(`Joueur ${socketId} a quitté la room ${this.id}`);
      
      // Supprime la room si elle est vide
      if (Object.keys(this.players).length === 0) {
        delete gameState.rooms[this.id];
        console.log(`Room ${this.id} supprimée`);
      }
    }
  }

  updatePlayer(socketId, updateData) {
    if (this.players[socketId]) {
      // Validation des données
      const player = this.players[socketId];
      
      if (typeof updateData.x === 'number') {
        player.x = updateData.x;
      }
      if (typeof updateData.y === 'number') {
        player.y = updateData.y;
      }
      if (updateData.direction === 'left' || updateData.direction === 'right') {
        player.direction = updateData.direction;
      }
      if (typeof updateData.isMoving === 'boolean') {
        player.isMoving = updateData.isMoving;
      }
      if (typeof updateData.isAttacking === 'boolean') {
        player.isAttacking = updateData.isAttacking;
      }
      if (typeof updateData.animationFrame === 'number') {
        player.animationFrame = updateData.animationFrame % 6;
      }
      
      this.broadcastGameState();
    }
  }

  broadcastGameState() {
    const gameUpdate = {
      roomId: this.id,
      players: this.players,
      playerCount: Object.keys(this.players).length,
      timestamp: Date.now()
    };
    
    io.to(this.id).emit('gameUpdate', gameUpdate);
  }

  getPlayerColor(index) {
    const colors = [
      'bg-blue-500',
      'bg-red-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500'
    ];
    return colors[index % colors.length];
  }
}

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log(`Nouvelle connexion: ${socket.id}`);

  // Rejoindre une room
  socket.on('joinRoom', (data) => {
    const { roomId, playerName } = data;
    
    if (!roomId) {
      socket.emit('error', { message: 'ID de room requis' });
      return;
    }

    // Créer la room si elle n'existe pas
    if (!gameState.rooms[roomId]) {
      gameState.rooms[roomId] = new GameRoom(roomId);
    }

    const room = gameState.rooms[roomId];
    
    // Vérifier si la room n'est pas pleine
    if (Object.keys(room.players).length >= gameState.maxPlayersPerRoom) {
      socket.emit('error', { message: 'Room pleine' });
      return;
    }

    room.addPlayer(socket, { name: playerName });
  });

  // Mise à jour de la position du joueur
  socket.on('playerUpdate', (updateData) => {
    // Trouver la room du joueur
    for (const roomId in gameState.rooms) {
      const room = gameState.rooms[roomId];
      if (room.players[socket.id]) {
        room.updatePlayer(socket.id, updateData);
        break;
      }
    }
  });

  // Récupérer la liste des rooms
  socket.on('getRooms', () => {
    const roomsList = Object.keys(gameState.rooms).map(roomId => ({
      id: roomId,
      playerCount: Object.keys(gameState.rooms[roomId].players).length,
      maxPlayers: gameState.maxPlayersPerRoom
    }));
    
    socket.emit('roomsList', roomsList);
  });

  // Action d'attaque
  socket.on('playerAttack', (attackData) => {
    for (const roomId in gameState.rooms) {
      const room = gameState.rooms[roomId];
      if (room.players[socket.id]) {
        const attacker = room.players[socket.id];
        
        // Marquer le joueur comme attaquant
        attacker.isAttacking = true;
        attacker.animationFrame = 0; // Reset animation
        
        // Calculer la zone d'attaque (exemple simple)
        const attackRange = 60;
        const attackX = attacker.direction === 'right' 
          ? attacker.x + 50 
          : attacker.x - 10;
        
        // Vérifier les collisions avec autres joueurs
        const hitPlayers = [];
        for (const targetId in room.players) {
          if (targetId !== socket.id) {
            const target = room.players[targetId];
            const distance = Math.sqrt(
              Math.pow(target.x - attackX, 2) + 
              Math.pow(target.y - attacker.y, 2)
            );
            
            if (distance < attackRange) {
              target.health = Math.max(0, target.health - 20);
              hitPlayers.push({
                id: targetId,
                name: target.name,
                newHealth: target.health
              });
            }
          }
        }
        
        // Broadcast l'attaque et les dégâts
        io.to(roomId).emit('playerAttacked', {
          attackerId: socket.id,
          attackerName: attacker.name,
          attackX: attackX,
          attackY: attacker.y,
          direction: attacker.direction,
          hitPlayers: hitPlayers,
          timestamp: Date.now()
        });
        
        // Reset l'attaque après l'animation
        setTimeout(() => {
          if (room.players[socket.id]) {
            room.players[socket.id].isAttacking = false;
            room.broadcastGameState();
          }
        }, 900); // Durée de l'animation d'attaque
        
        room.broadcastGameState();
        break;
      }
    }
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log(`Déconnexion: ${socket.id}`);
    
    // Retirer le joueur de toutes les rooms
    for (const roomId in gameState.rooms) {
      const room = gameState.rooms[roomId];
      if (room.players[socket.id]) {
        room.removePlayer(socket.id);
        break;
      }
    }
  });

  // Gestion des erreurs
  socket.on('error', (error) => {
    console.error(`Erreur socket ${socket.id}:`, error);
  });
});

// Boucle de jeu côté serveur (pour les animations)
setInterval(() => {
  for (const roomId in gameState.rooms) {
    const room = gameState.rooms[roomId];
    let hasMovingPlayers = false;
    
    // Mettre à jour les animations des joueurs qui bougent
    for (const playerId in room.players) {
      const player = room.players[playerId];
      if (player.isMoving) {
        player.animationFrame = (player.animationFrame + 1) % 6;
        hasMovingPlayers = true;
      }
    }
    
    // Broadcast seulement s'il y a des changements
    if (hasMovingPlayers) {
      room.broadcastGameState();
    }
  }
}, 150); // Animation toutes les 150ms

// Route API pour les statistiques
app.get('/api/stats', (req, res) => {
  const stats = {
    totalRooms: Object.keys(gameState.rooms).length,
    totalPlayers: Object.values(gameState.rooms).reduce((total, room) => 
      total + Object.keys(room.players).length, 0),
    rooms: Object.keys(gameState.rooms).map(roomId => ({
      id: roomId,
      playerCount: Object.keys(gameState.rooms[roomId].players).length
    }))
  };
  res.json(stats);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 Serveur de jeu démarré sur le port ${PORT}`);
  console.log(`📊 API stats disponible sur http://localhost:${PORT}/api/stats`);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

module.exports = { app, server, io };