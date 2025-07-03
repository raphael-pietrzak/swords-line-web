import React from 'react';
import { useCharacterAnimation } from '../hooks/useCharacterAnimation';
import assets from '../data/assets';

const Character = ({ player, isCurrentPlayer }) => {
  const animationFrame = useCharacterAnimation(player.isMoving, player.isAttacking);
  
  // Utiliser les assets du personnage "torch"
  const characterAsset = assets.torch;

  const getAnimationState = () => {
    if (player.isAttacking) return 'attack';
    if (player.isMoving) return 'walk';
    return 'idle';
  };

  const currentAnim = getAnimationState();
  const animConfig = characterAsset.animations[currentAnim];
  
  const spriteX = -((animationFrame % animConfig.frames) * characterAsset.frameWidth);
  const spriteY = -(animConfig.row * characterAsset.frameHeight);

  const characterStyle = {
    left: `${player.x}px`,
    top: `${player.y}px`,
    transform: `scaleX(${player.direction === 'left' ? -1 : 1})`,
    transformOrigin: 'center center',
  };

  const spriteStyle = {
    width: `${characterAsset.frameWidth}px`,
    height: `${characterAsset.frameHeight}px`,
    backgroundImage: `url('${characterAsset.image}')`,
    backgroundPosition: `${spriteX}px ${spriteY}px`,
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated',
  };

  const colorOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    mixBlendMode: 'multiply',
    opacity: 0.7,
  };

  return (
    <div
      className={`absolute transition-none `}
      style={characterStyle}
    >
      {/* Sprite principal */}
      <div style={spriteStyle} className="relative">
        <div 
          className={`${player.color} ${
        isCurrentPlayer ? 'ring-4 ring-yellow-400 ring-opacity-75 rounded-lg' : ''
        }`}
          style={colorOverlayStyle}
        />
      </div>
      
      {/* Nom du joueur */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-sm whitespace-nowra
    p text-white font-bold">
        {player.name}
      </div>
    </div>
    );
}
export default Character;
