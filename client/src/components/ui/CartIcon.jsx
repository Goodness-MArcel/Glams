import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

function CartIcon({ onClick }) {
  const { cartItemsCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (cartItemsCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  return (
    <button
      className="btn btn-outline-primary position-relative"
      onClick={onClick}
      style={{ border: 'none', background: 'transparent' }}
    >
      <i 
        className={`bi bi-cart3 fs-4 ${isAnimating ? 'animate-bounce' : ''}`}
        style={{ 
          color: '#2cc0e0',
          transition: 'transform 0.3s ease'
        }}
      ></i>
      
      {cartItemsCount > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            fontSize: '0.7rem',
            minWidth: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isAnimating ? 'pulse 0.3s ease-in-out' : 'none'
          }}
        >
          {cartItemsCount > 99 ? '99+' : cartItemsCount}
        </span>
      )}

      <style jsx>{`
        .animate-bounce {
          animation: bounce 0.3s ease-in-out;
        }
        
        @keyframes bounce {
          0%, 20%, 60%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          80% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </button>
  );
}

export default CartIcon;