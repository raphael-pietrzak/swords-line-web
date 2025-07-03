import React from 'react';

const PlayerList = ({ players, currentPlayerId }) => {
  const playerList = Object.values(players);

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
      <h3 className="font-bold text-white mb-4 flex items-center">
        <span className="mr-2">👥</span>
        Joueurs connectés ({playerList.length})
      </h3>
      
      <div className="space-y-3">
        {playerList.map(player => (
          <div
            key={player.id}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              player.id === currentPlayerId
                ? 'bg-purple-500/20 border-purple-400/50 ring-1 ring-purple-400/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${player.color} border border-white/30`}></div>
                <div>
                  <div className="text-white font-medium flex items-center">
                    {player.id === currentPlayerId && <span className="mr-1">👑</span>}
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    ({Math.round(player.x)}, {Math.round(player.y)})
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <div 
                  className={`w-2 h-2 rounded-full ${player.isMoving ? 'bg-green-400' : 'bg-gray-500'}`}
                  title={player.isMoving ? 'En mouvement' : 'Immobile'}
                ></div>
                <div 
                  className={`w-2 h-2 rounded-full ${player.isAttacking ? 'bg-red-400' : 'bg-gray-500'}`}
                  title={player.isAttacking ? 'Attaque' : 'Normal'}
                ></div>
              </div>
            </div>
          </div>
        ))}
        
        {playerList.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <span className="text-2xl mb-2 block">👻</span>
            Aucun joueur connecté
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
