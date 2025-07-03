import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import ConnectionPage from './components/ConnectionPage';
import LobbyPage from './components/LobbyPage';
import GamePage from './components/GamePage';

const MultiplayerGame = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState({ players: {} });
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [keys, setKeys] = useState({});
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);
  
  const lastUpdateRef = useRef(Date.now());
  const playerPositionRef = useRef({ x: 0, y: 0 });

  // Connexion Socket.IO
  const connectToServer = useCallback(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connecté au serveur');
      setConnected(true);
      setError('');
    });

    newSocket.on('disconnect', () => {
      console.log('Déconnecté du serveur');
      setConnected(false);
      setJoinedRoom(false);
    });

    newSocket.on('playerJoined', (data) => {
      setCurrentPlayer(data.playerData);
      setJoinedRoom(true);
    });

    newSocket.on('gameUpdate', (update) => {
      setGameState(update);
    });

    newSocket.on('roomsList', (roomsList) => {
      setRooms(roomsList);
    });

    newSocket.on('error', (errorData) => {
      setError(errorData.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Rejoindre une room
  const joinRoom = () => {
    if (!roomId.trim() || !playerName.trim()) {
      setError('Nom du joueur et ID de room requis');
      return;
    }

    if (socket) {
      socket.emit('joinRoom', {
        roomId: roomId.trim(),
        playerName: playerName.trim()
      });
    }
  };

  // Obtenir la liste des rooms
  const getRooms = () => {
    if (socket) {
      socket.emit('getRooms');
    }
  };

  // Quitter la room
  const leaveRoom = () => {
    setJoinedRoom(false);
    setRoomId('');
    setPlayerName('');
    setCurrentPlayer(null);
    setGameState({ players: {} });
  };

  // Gestion des touches
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    setKeys(prev => ({ ...prev, [key]: true }));
    
    if (key === ' ' && !isAttacking) {
      setIsAttacking(true);
      if (socket && currentPlayer) {
        socket.emit('playerAttack', {
          x: currentPlayer.x,
          y: currentPlayer.y,
          direction: currentPlayer.direction
        });
      }
      setTimeout(() => setIsAttacking(false), 900);
    }
  }, [socket, currentPlayer, isAttacking]);

  const handleKeyUp = useCallback((e) => {
    setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Boucle de jeu
  useEffect(() => {
    if (!socket || !currentPlayer || !joinedRoom) return;

    const gameLoop = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 16) return;

      let newX = playerPositionRef.current.x;
      let newY = playerPositionRef.current.y;
      let direction = currentPlayer.direction || 'right';
      let isMoving = false;
      const speed = 5;

      if (keys['q']) {
        newX -= speed;
        direction = 'left';
        isMoving = true;
      }
      if (keys['d']) {
        newX += speed;
        direction = 'right';
        isMoving = true;
      }
      if (keys['z']) {
        newY -= speed;
        isMoving = true;
      }
      if (keys['s']) {
        newY += speed;
        isMoving = true;
      }

      if (newX !== playerPositionRef.current.x || 
          newY !== playerPositionRef.current.y || 
          isMoving !== currentPlayer.isMoving ||
          direction !== currentPlayer.direction) {
        
        playerPositionRef.current = { x: newX, y: newY };
        
        socket.emit('playerUpdate', {
          x: newX,
          y: newY,
          direction,
          isMoving,
          isAttacking
        });

        setCurrentPlayer(prev => ({
          ...prev,
          x: newX,
          y: newY,
          direction,
          isMoving,
          isAttacking
        }));
      }

      lastUpdateRef.current = now;
    }, 16);

    return () => clearInterval(gameLoop);
  }, [keys, socket, currentPlayer, joinedRoom, isAttacking]);

  // Rendu conditionnel des pages
  if (!connected) {
    return <ConnectionPage onConnect={connectToServer} />;
  }

  if (!joinedRoom) {
    return (
      <LobbyPage
        playerName={playerName}
        setPlayerName={setPlayerName}
        roomId={roomId}
        setRoomId={setRoomId}
        error={error}
        rooms={rooms}
        onJoinRoom={joinRoom}
        onGetRooms={getRooms}
      />
    );
  }

  return (
    <GamePage
      roomId={roomId}
      gameState={gameState}
      currentPlayer={currentPlayer}
      keys={keys}
      onLeaveRoom={leaveRoom}
    />
  );
};

export default MultiplayerGame;