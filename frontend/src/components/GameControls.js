import React from 'react';

const GameControls = ({ keys, currentPlayer }) => {
  const controls = [
    { key: 'Z', label: 'Haut', active: keys['z'], gridArea: 'top' },
    { key: 'Q', label: 'Gauche', active: keys['q'], gridArea: 'left' },
    { key: 'S', label: 'Bas', active: keys['s'], gridArea: 'bottom' },
    { key: 'D', label: 'Droite', active: keys['d'], gridArea: 'right' },
    { key: 'Espace', label: 'Attaque', active: keys[' '], gridArea: 'center' }
  ];

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contrôles */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
        <h3 className="font-bold text-white mb-3 flex items-center">
          <span className="mr-2">🎮</span>
          Contrôles
        </h3>
        <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
          <div className="col-start-2">{/* Espace pour alignement */}
            {controls.find(c => c.gridArea === 'top') && (
              <div
                className={`text-center p-2 rounded-lg border transition-all duration-200 ${
                  controls.find(c => c.gridArea === 'top').active
                    ? 'bg-blue-500/30 border-blue-400 text-blue-200'
                    : 'bg-white/5 border-white/20 text-gray-400'
                }`}
              >
                <div className="text-xs font-bold">{controls.find(c => c.gridArea === 'top').key}</div>
                <div className="text-xs">{controls.find(c => c.gridArea === 'top').label}</div>
              </div>
            )}
          </div>
          <div>{/* Vide */}</div>
          {['left', 'center', 'right'].map(area => (
            <div key={area}>
              {controls.find(c => c.gridArea === area) && (
                <div
                  className={`text-center p-2 rounded-lg border transition-all duration-200 ${
                    controls.find(c => c.gridArea === area).active
                      ? 'bg-blue-500/30 border-blue-400 text-blue-200'
                      : 'bg-white/5 border-white/20 text-gray-400'
                  }`}
                >
                  <div className="text-xs font-bold">{controls.find(c => c.gridArea === area).key}</div>
                  <div className="text-xs">{controls.find(c => c.gridArea === area).label}</div>
                </div>
              )}
            </div>
          ))}
          <div className="col-start-2">
            {controls.find(c => c.gridArea === 'bottom') && (
              <div
                className={`text-center p-2 rounded-lg border transition-all duration-200 ${
                  controls.find(c => c.gridArea === 'bottom').active
                    ? 'bg-blue-500/30 border-blue-400 text-blue-200'
                    : 'bg-white/5 border-white/20 text-gray-400'
                }`}
              >
                <div className="text-xs font-bold">{controls.find(c => c.gridArea === 'bottom').key}</div>
                <div className="text-xs">{controls.find(c => c.gridArea === 'bottom').label}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations joueur */}
      {currentPlayer && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
          <h3 className="font-bold text-white mb-3 flex items-center">
            <span className="mr-2">📊</span>
            Statistiques
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Position:</span>
              <span className="text-blue-300">
                ({Math.round(currentPlayer.x)}, {Math.round(currentPlayer.y)})
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Direction:</span>
              <span className="text-green-300">{currentPlayer.direction}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>État:</span>
              <span className={currentPlayer.isMoving ? 'text-yellow-300' : 'text-gray-400'}>
                {currentPlayer.isMoving ? 'En mouvement' : 'Immobile'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;
