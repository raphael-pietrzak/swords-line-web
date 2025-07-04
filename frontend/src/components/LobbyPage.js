import React from 'react';

const LobbyPage = ({ 
  playerName, 
  setPlayerName, 
  roomId, 
  setRoomId, 
  error, 
  rooms, 
  onJoinRoom, 
  onGetRooms 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2"> Rejoindre une partie</h1>
          <p className="text-green-200">Configurez votre profil et choisissez une room</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-green-200 mb-2">
              Nom du joueur
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
              placeholder="Entrez votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-200 mb-2">
              ID de la room
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
              placeholder="room1, room2, etc."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onJoinRoom}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              🎯 Rejoindre
            </button>

            <button
              onClick={onGetRooms}
              className="bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm"
              title="Actualiser les rooms"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {rooms.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-green-200 mb-4 flex items-center">
              <span className="mr-2">🏢</span>
              Rooms disponibles
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {rooms.map(room => (
                <div key={room.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                  <div>
                    <span className="text-white font-medium">{room.id}</span>
                    <div className="text-xs text-green-300">
                      {room.playerCount}/{room.maxPlayers} joueurs
                    </div>
                  </div>
                  <button
                    onClick={() => setRoomId(room.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                  >
                    Sélectionner
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
