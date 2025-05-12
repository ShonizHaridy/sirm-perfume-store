import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { addNotification } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetch product details
        const productResponse = await axios.get(`/api/products/${id}`);
        setProduct(productResponse.data);
        
        // Fetch related products
        const relatedResponse = await axios.get(`/api/products?category=${productResponse.data.category}&limit=4`);
        setRelatedProducts(relatedResponse.data.filter(item => item._id !== id));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };

    // Mock data for development
    // setTimeout(() => {
    //   const mockProduct = {
    //     _id: id,
    //     name: 'Musk 100ml',
    //     nameAr: 'مسك 100مل',
    //     price: 230.00,
    //     currency: '﷼',
    //     image: '/images/musk_bottle.png',
    //     boxImage: '/images/musk_box.png',
    //     category: 'spray',
    //     description: 'A refreshing fragrance that opens with citrus grapefruit, ginger and Italian bergamot. The heart of the perfume consists of the scent of cold water, rosemary and the luxurious geranium flower. The base of the perfume is characterized by the strength of ambroxan, a touch of amber and a little labdanum.',
    //     descriptionAr: 'عطر يتميز بأنه منعش ابتداءاً بالجريب فروت الحمضي و الزنجبيل و البرغموت الإيطالي و يتكون قلب العطر من رائحة الماء البارده و إكليل الجبل و زهرة إبره الراعي الفاخرة قاعدة العطر تتميز بقوة الأمبروكسان ولمسة العنبر وقليل من اللابدانوم',
    //     stock: 45,
    //     features: [
    //       { name: 'Volume', value: '100ml' },
    //       { name: 'Top Notes', value: 'Grapefruit, Ginger, Bergamot' },
    //       { name: 'Heart Notes', value: 'Cold Water, Rosemary, Geranium' },
    //       { name: 'Base Notes', value: 'Ambroxan, Amber, Labdanum' }
    //     ]
    //   };
      
    //   const mockRelated = [
    //     {
    //       _id: '2',
    //       name: 'The fifth 100ml',
    //       nameAr: 'ذا فيفث 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/fifth_bottle.png',
    //       boxImage: '/images/fifth_box.png',
    //       category: 'spray'
    //     },
    //     {
    //       _id: '3',
    //       name: 'Flow of three 100ml',
    //       nameAr: 'فلو أوف ثري 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/flow_bottle.png',
    //       boxImage: '/images/flow_box.png',
    //       category: 'spray'
    //     },
    //     {
    //       _id: '4',
    //       name: 'Bliss 100ml',
    //       nameAr: 'بليس 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/bliss_bottle.png',
    //       boxImage: '/images/bliss_box.png',
    //       category: 'spray'
    //     }
    //   ];
      
    //   setProduct(mockProduct);
    //   setRelatedProducts(mockRelated);
    //   setLoading(false);
    // }, 1000);

    fetchProductData(); // Uncomment when backend is connected
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addNotification(`${product.name} added to cart`, 'success');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add to favorites API call would go here
  };

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (!product) {
    return <ErrorContainer>Product not found</ErrorContainer>;
  }

  return (
    <div className="container">
      <NavigationBack onClick={() => navigate(-1)}>
        <FaArrowLeft />
        <span>{t('back')}</span>
      </NavigationBack>
      
      <ProductContainer>
        <ProductGallery>
          <MainImage>
            <img src={product.image} alt={product.name} />
            <BoxImage src={product.boxImage} alt={`${product.name} box`} />
          </MainImage>
        </ProductGallery>
        
        <ProductInfo>
          <ProductTitle>
            {isRTL ? product.nameAr : product.name}
          </ProductTitle>
          
          <ProductPrice>
            {product.currency} {product.price.toFixed(2)}
          </ProductPrice>
          
          <ProductDescription>
            {isRTL ? product.descriptionAr : product.description}
          </ProductDescription>
          
          {product.features && (
            <ProductFeatures>
              {product.features.map((feature, index) => (
                <FeatureItem key={index}>
                  <FeatureLabel>{feature.name}:</FeatureLabel>
                  <FeatureValue>{feature.value}</FeatureValue>
                </FeatureItem>
              ))}
            </ProductFeatures>
          )}
          
          <StockInfo>
            {product.stock > 0 ? (
              <InStock>{t('in_stock')}</InStock>
            ) : (
              <OutOfStock>{t('out_of_stock')}</OutOfStock>
            )}
          </StockInfo>
          
          {product.stock > 0 && (
            <>
              <QuantityContainer>
                <QuantityLabel>{t('quantity')}:</QuantityLabel>
                <QuantityControls>
                  <QuantityButton onClick={decrementQuantity}>-</QuantityButton>
                  <QuantityInput 
                    type="number" 
                    value={quantity} 
                    onChange={handleQuantityChange} 
                    min="1" 
                    max={product.stock}
                  />
                  <QuantityButton onClick={incrementQuantity}>+</QuantityButton>
                </QuantityControls>
              </QuantityContainer>
              
              <ActionButtons>
                <AddToCartButton onClick={handleAddToCart}>
                  <FaShoppingCart />
                  <span>{t('add_to_cart')}</span>
                </AddToCartButton>
                
                <FavoriteButton onClick={toggleFavorite}>
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </FavoriteButton>
              </ActionButtons>
            </>
          )}
          </ProductInfo>
        </ProductContainer>
        
        {relatedProducts.length > 0 && (
          <RelatedSection>
            <SectionTitle>{t('related_products')}</SectionTitle>
            <RelatedGrid>
              {relatedProducts.map(related => (
                <RelatedItem key={related._id} onClick={() => navigate(`/product/${related._id}`)}>
                  <RelatedImage>
                    <img src={related.image} alt={related.name} />
                  </RelatedImage>
                  <RelatedName>
                    {isRTL ? related.nameAr : related.name}
                  </RelatedName>
                  <RelatedPrice>
                    {related.currency} {related.price.toFixed(2)}
                  </RelatedPrice>
                </RelatedItem>
              ))}
            </RelatedGrid>
          </RelatedSection>
        )}
      </div>
    );
  };
  
  // Styled Components
  const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    font-size: 18px;
    color: var(--primary-color);
  `;
  
  const ErrorContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    font-size: 18px;
    color: var(--danger-color);
  `;
  
  const NavigationBack = styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 16px;
    cursor: pointer;
    margin: 20px 0;
    
    span {
      margin-left: 10px;
      
      .rtl & {
        margin-left: 0;
        margin-right: 10px;
      }
    }
    
    &:hover {
      color: var(--secondary-color);
    }
  `;
  
  const ProductContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    margin-bottom: 80px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  `;
  
  const ProductGallery = styled.div``;
  
  const MainImage = styled.div`
    position: relative;
    background-color: #f9f9f9;
    border-radius: 8px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
      max-height: 80%;
      max-width: 50%;
      object-fit: contain;
    }
    
    @media (max-width: 768px) {
      height: 400px;
    }
  `;
  
  const BoxImage = styled.img`
    position: absolute;
    top: 50%;
    right: 25%;
    transform: translateY(-50%);
    max-height: 80%;
    max-width: 40%;
    object-fit: contain;
  `;
  
  const ProductInfo = styled.div``;
  
  const ProductTitle = styled.h1`
    font-size: 32px;
    color: var(--primary-color);
    margin-bottom: 15px;
    
    @media (max-width: 768px) {
      font-size: 24px;
    }
  `;
  
  const ProductPrice = styled.div`
    font-size: 24px;
    font-weight: 600;
    color: var(--secondary-color);
    margin-bottom: 20px;
  `;
  
  const ProductDescription = styled.div`
    margin-bottom: 30px;
    line-height: 1.6;
    color: #555;
  `;
  
  const ProductFeatures = styled.div`
    margin-bottom: 30px;
  `;
  
  const FeatureItem = styled.div`
    display: flex;
    margin-bottom: 10px;
    
    .rtl & {
      flex-direction: row-reverse;
    }
  `;
  
  const FeatureLabel = styled.span`
    font-weight: 600;
    width: 120px;
    color: var(--primary-color);
  `;
  
  const FeatureValue = styled.span`
    color: #555;
  `;
  
  const StockInfo = styled.div`
    margin-bottom: 20px;
  `;
  
  const InStock = styled.span`
    color: var(--success-color);
    font-weight: 600;
  `;
  
  const OutOfStock = styled.span`
    color: var(--danger-color);
    font-weight: 600;
  `;
  
  const QuantityContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    
    .rtl & {
      flex-direction: row-reverse;
    }
  `;
  
  const QuantityLabel = styled.span`
    margin-right: 15px;
    
    .rtl & {
      margin-right: 0;
      margin-left: 15px;
    }
  `;
  
  const QuantityControls = styled.div`
    display: flex;
    align-items: center;
  `;
  
  const QuantityButton = styled.button`
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f1f1f1;
    border: none;
    font-size: 18px;
    cursor: pointer;
    
    &:first-child {
      border-radius: 4px 0 0 4px;
      
      .rtl & {
        border-radius: 0 4px 4px 0;
      }
    }
    
    &:last-child {
      border-radius: 0 4px 4px 0;
      
      .rtl & {
        border-radius: 4px 0 0 4px;
      }
    }
    
    &:hover {
      background-color: #e1e1e1;
    }
  `;
  
  const QuantityInput = styled.input`
    width: 50px;
    height: 36px;
    border: 1px solid #f1f1f1;
    text-align: center;
    font-size: 16px;
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &:focus {
      outline: none;
      border-color: var(--secondary-color);
    }
  `;
  
  const ActionButtons = styled.div`
    display: flex;
  `;
  
  const AddToCartButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--secondary-color);
    color: var(--primary-color);
    border: none;
    padding: 12px 25px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    
    svg {
      margin-right: 10px;
      
      .rtl & {
        margin-right: 0;
        margin-left: 10px;
      }
    }
    
    &:hover {
      background-color: var(--accent-color);
    }
  `;
  
  const FavoriteButton = styled.button`
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid #ddd;
    color: ${props => props.isFavorite ? 'var(--danger-color)' : 'var(--primary-color)'};
    border-radius: 4px;
    margin-left: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    .rtl & {
      margin-left: 0;
      margin-right: 15px;
    }
    
    &:hover {
      border-color: var(--secondary-color);
      color: var(--secondary-color);
    }
  `;
  
  const RelatedSection = styled.div`
    margin-bottom: 80px;
  `;
  
  const SectionTitle = styled.h2`
    font-size: 24px;
    color: var(--primary-color);
    margin-bottom: 30px;
    position: relative;
    
    &:after {
      content: '';
      display: block;
      width: 50px;
      height: 2px;
      background-color: var(--secondary-color);
      margin-top: 10px;
      
      .rtl & {
        margin-left: auto;
      }
    }
  `;
  
  const RelatedGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    
    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `;
  
  const RelatedItem = styled.div`
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  `;
  
  const RelatedImage = styled.div`
    height: 200px;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      max-height: 80%;
      max-width: 80%;
      object-fit: contain;
    }
  `;
  
  const RelatedName = styled.div`
    padding: 15px 15px 5px;
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-color);
  `;
  
  const RelatedPrice = styled.div`
    padding: 0 15px 15px;
    font-size: 18px;
    font-weight: 600;
    color: var(--secondary-color);
  `;
  
  export default ProductDetail;