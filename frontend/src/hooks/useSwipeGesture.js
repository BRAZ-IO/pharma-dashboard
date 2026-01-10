import { useState, useRef, useEffect } from 'react';

// Hook personalizado para detectar gestos de swipe
export const useSwipeGesture = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // Distância mínima para considerar um swipe
  const minSwipeDistance = threshold;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
    
    setIsSwiping(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
    swipeProgress: touchStart && touchEnd ? 
      Math.abs(touchStart - touchEnd) / minSwipeDistance : 0
  };
};

// Hook para carrinho com swipe
export const useSwipeCart = () => {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartPosition, setCartPosition] = useState('hidden'); // 'hidden', 'visible', 'peeking'
  
  const showCart = () => {
    setCartPosition('visible');
    setIsCartVisible(true);
  };
  
  const hideCart = () => {
    setCartPosition('hidden');
    setIsCartVisible(false);
  };
  
  const peekCart = () => {
    setCartPosition('peeking');
    setIsCartVisible(true);
  };
  
  const toggleCart = () => {
    if (cartPosition === 'visible') {
      hideCart();
    } else {
      showCart();
    }
  };

  const handleSwipeLeft = () => {
    // Swipe para esquerda mostra o carrinho
    showCart();
  };
  
  const handleSwipeRight = () => {
    // Swipe para direita esconde o carrinho
    hideCart();
  };

  const swipeGesture = useSwipeGesture(handleSwipeLeft, handleSwipeRight);

  return {
    isCartVisible,
    cartPosition,
    showCart,
    hideCart,
    peekCart,
    toggleCart,
    swipeGesture
  };
};

export default useSwipeGesture;
