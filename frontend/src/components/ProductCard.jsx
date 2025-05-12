import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, isRTL }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const addToCart = (e) => {
    e.stopPropagation();
    // Add cart functionality here
    console.log(`Added ${product.name} to cart`);
  };

  const goToProductDetail = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <CardContainer
      onClick={goToProductDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FavoriteButton onClick={toggleFavorite}>
        {isFavorite ? <FaHeart color="#e74c3c" /> : <FaRegHeart />}
      </FavoriteButton>
      
      <ImageContainer>
        <ProductImage src={product.image} alt={product.name} />
        <ProductBox src={product.boxImage} alt={`${product.name} Box`} />
      </ImageContainer>
      
      {isHovered && (
        <CardOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AddToCartButton onClick={addToCart} isRTL={isRTL}>
            <CartIcon />
            <span>{t('add_to_cart')}</span>
          </AddToCartButton>
        </CardOverlay>
      )}
      
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>
          {product.currency} {product.price.toFixed(2)}
        </ProductPrice>
      </ProductInfo>
    </CardContainer>
  );
};

// Styled Components
const CardContainer = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  position: relative;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  background: none;
  border: none;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  
  .rtl & {
    left: auto;
    right: 10px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 100%;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  height: 80%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: translate(-60%, -50%) scale(1.05);
  }
`;

const ProductBox = styled.img`
  position: absolute;
  top: 50%;
  right: 30%;
  transform: translate(50%, -50%);
  height: 80%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: translate(60%, -50%) scale(1.05);
  }
`;

const CardOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  justify-content: center;
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  background-color: var(--secondary-color);
  color: #111;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--accent-color);
  }
  
  span {
    margin: ${props => props.isRTL ? '0 0 0 8px' : '0 8px 0 0'};
  }
`;

const CartIcon = styled(FaShoppingCart)`
  font-size: 16px;
`;

const ProductInfo = styled.div`
  padding: 15px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--secondary-color);
`;

export default ProductCard;