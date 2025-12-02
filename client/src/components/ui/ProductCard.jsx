import Tilt from 'react-parallax-tilt';
import { useState } from 'react';
import './ProductCard.css';

export default function ProductCard({ img, title, desc, price }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Tilt
      className="product-tilt"
      perspective={1000}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glarePosition="all"
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      scale={1.05}
      transitionSpeed={800}
    >
      <div className="product-card  d-flex flex-column" style={{height: '350px'}}>

        <div className="product-img-wrapper">
          <img src={img} alt={title} className="product-img" />
          <div className="price-badge">{price}</div>
        </div>

        <div className="card-body flex-grow-1 d-flex flex-column justify-content-between p-4">
          <div>
            <h5 className="product-title">{title}</h5>
            <p className="product-desc text-muted small">{desc}</p>
          </div>

          <button
            onClick={handleAdd}
            className={`btn btn-add-cart mt-3 ${isAdded ? 'added' : ''}`}
          >
            <span className="btn-text">
              {isAdded ? 'Added!' : 'Add to Cart'}
            </span>
            <i className={`bi ${isAdded ? 'bi-check2' : 'bi-cart-plus'} ms-2`}></i>
          </button>
        </div>
      </div>
    </Tilt>
  );
}