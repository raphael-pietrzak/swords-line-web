import React from 'react';
import Character from './Character';
import GameControls from './GameControls';
import PlayerList from './PlayerList';

const GamePage = ({ roomId, gameState, keys, onLeaveRoom }) => {
  // Calculer la position de la caméra centrée sur le joueur

  const currentPlayer = gameState.players[gameState.currentPlayerId];

  const getCameraTransform = () => {
    if (!currentPlayer) return 'translate(0, 0)';
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const offsetX = centerX - (currentPlayer.x + 96);
    const offsetY = centerY - (currentPlayer.y + 96);
    
    return `translate(${offsetX}px, ${offsetY}px)`;
  };



  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      {/* Map en fullscreen */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 relative overflow-hidden"
          style={{ 
            transform: getCameraTransform(),
            transformOrigin: '0 0'
          }}
        >
          {/* Grille de fond */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: Math.ceil(window.innerHeight / 20) }, (_, i) => (
              <div key={`h-${i}`} 
                   className="absolute w-full h-px bg-white"
                   style={{ top: `${i * 20}px` }} />
            ))}
            {Array.from({ length: Math.ceil(window.innerWidth / 20) }, (_, i) => (
              <div key={`v-${i}`} 
                   className="absolute h-full w-px bg-white"
                   style={{ left: `${i * 20}px` }} />
            ))}
          </div>

          {/* Conteneur des personnages - z-index élevé */}
          <div className="absolute inset-0 z-20">

            {Object.values(gameState.players)
              .filter(player => player.id !== currentPlayer?.id)
              .map(player => (
                <Character 
                  key={player.id}
                  player={player} 
                  isCurrentPlayer={false}
                />
              ))}

              {currentPlayer && (
              <Character 
                player={currentPlayer} 
                isCurrentPlayer={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Header en overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl backdrop-blur-sm">
              <span className="text-white text-xl font-bold">🎮</span>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3">
              <h1 className="text-xl font-bold text-white">
                Room: <span className="text-purple-400">{roomId}</span>
              </h1>
              <p className="text-gray-300 text-sm">
                {Object.keys(gameState.players).length} joueur(s) connecté(s)
              </p>
            </div>
          </div>
          
          <button
            onClick={onLeaveRoom}
            className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/30 transition-all duration-300 backdrop-blur-sm font-semibold"
          >
            Quitter
          </button>
        </div>
      </div>

      {/* Sidebar en overlay */}
      <div className="absolute top-20 right-4 z-30 w-80">
        <PlayerList 
          players={gameState.players} 
          currentPlayerId={currentPlayer?.id} 
        />
      </div>

      {/* Contrôles en overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <GameControls keys={keys} currentPlayer={gameState.players[currentPlayer?.id]} />
      </div>
    </div>
  );
};

export default GamePage;
