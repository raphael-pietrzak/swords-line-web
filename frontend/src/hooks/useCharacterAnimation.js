import { useState, useEffect, useRef } from 'react';

export const useCharacterAnimation = (isMoving, isAttacking) => {
  const [frame, setFrame] = useState(0);
  const animationTimerRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (isAttacking) {
        setFrame(prev => (prev + 1) % 6); // 6 frames pour l'attaque
        return;
      }
      if (isMoving) {
        setFrame(prev => (prev + 1) % 6); // 6 frames pour la marche
        return;
      }
      setFrame(prev => (prev + 1) % 7); // 7 frames pour idle
    };

    animationTimerRef.current = setInterval(animate, 100);
    return () => clearInterval(animationTimerRef.current);
  }, [isMoving, isAttacking]);

  return frame;
};
