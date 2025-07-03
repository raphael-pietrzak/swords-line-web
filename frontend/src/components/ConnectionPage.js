import React from 'react';

const ConnectionPage = ({ onConnect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">SL</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Jeu Multijoueur 2D</h1>
          <p className="text-blue-200">Connectez-vous pour commencer à jouer</p>
        </div>
        
        <button
          onClick={onConnect}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
        >
          Se connecter au serveur
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-300 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
            🌐 Serveur: localhost:3001
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPage;
