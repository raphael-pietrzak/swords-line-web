import React from 'react';
import { useCharacterAnimation } from '../hooks/useCharacterAnimation';

const Character = ({ player, isCurrentPlayer }) => {
  const animationFrame = useCharacterAnimation(player.isMoving, player.isAttacking);

  const getAnimationState = () => {
    if (player.isAttacking) return 'attack';
    if (player.isMoving) return 'walk';
    return 'idle';
  };

  const animations = {
    idle: { row: 0, frames: 7, frameWidth: 192, frameHeight: 192 },
    walk: { row: 1, frames: 6, frameWidth: 192, frameHeight: 192 },
    attack: { row: 2, frames: 6, frameWidth: 192, frameHeight: 192 }
  };

  const currentAnim = getAnimationState();
  const animConfig = animations[currentAnim];
  
  const spriteX = -((animationFrame % animConfig.frames) * animConfig.frameWidth);
  const spriteY = -(animConfig.row * animConfig.frameHeight);

  const characterStyle = {
    left: `${player.x}px`,
    top: `${player.y}px`,
    transform: `scaleX(${player.direction === 'left' ? -1 : 1})`,
    transformOrigin: 'center center',
  };

  const spriteStyle = {
    width: `${animConfig.frameWidth}px`,
    height: `${animConfig.frameHeight}px`,
    backgroundImage: `url('/sprites/Torch.png')`,
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
