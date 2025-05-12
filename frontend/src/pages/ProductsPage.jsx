import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import { useApp } from '../context/AppContext';

const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const { showLoading, hideLoading, addNotification } = useApp();
  
  const searchQuery = searchParams.get('search') || '';
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        showLoading();
        setLoading(true);
        
        let params = {};
        if (currentCategory !== 'all') {
          params.category = currentCategory;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        const data = await productService.getAllProducts(params);
        console.log('Fetched products:', data);
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
        hideLoading();
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
        hideLoading();
        addNotification(t('error_fetching_products') || 'Error fetching products', 'error');
      }
    };

    fetchProducts();
  }, [currentCategory, searchQuery, showLoading, hideLoading, addNotification, t]);


  // // Mock data until backend is connected
  // useEffect(() => {
  //   const mockProducts = [
  //     {
  //       _id: '1',
  //       name: 'Musk 100ml',
  //       price: 230.00,
  //       currency: '﷼',
  //       image: '/images/musk_bottle.png',
  //       boxImage: '/images/musk_box.png',
  //       category: 'spray'
  //     },
  //     {
  //       _id: '2',
  //       name: 'The fifth 100ml',
  //       price: 230.00,
  //       currency: '﷼',
  //       image: '/images/fifth_bottle.png',
  //       boxImage: '/images/fifth_box.png',
  //       category: 'spray'
  //     },
  //     {
  //       _id: '3',
  //       name: 'Flow of three 100ml',
  //       price: 230.00,
  //       currency: '﷼',
  //       image: '/images/flow_bottle.png',
  //       boxImage: '/images/flow_box.png',
  //       category: 'spray'
  //     },
  //     {
  //       _id: '4',
  //       name: 'Bliss 100ml',
  //       price: 230.00,
  //       currency: '﷼',
  //       image: '/images/bliss_bottle.png',
  //       boxImage: '/images/bliss_box.png',
  //       category: 'spray'
  //     }
  //   ];
    
  //   setProducts(mockProducts);
  //   setLoading(false);
  // }, []);

  const categories = [
    { id: 'all', name: { en: 'All Products', ar: 'جميع المنتجات' } },
    { id: 'spray', name: { en: 'All Over Spray', ar: 'عطر الجسم' } },
    { id: 'perfume', name: { en: 'Perfumes', ar: 'العطور' } },
    { id: 'candle', name: { en: 'Candles', ar: 'الشموع' } }
  ];

  
  if (loading) return <LoadingMessage>{t('loading') || 'Loading...'}</LoadingMessage>;
  if (error) return <ErrorMessage>{t('error')}: {error}</ErrorMessage>;

  return (
    <div className="container">
      <PageHeader>{t('all_over_spray')}</PageHeader>
      
      <CategoryNav>
        {categories.map(category => (
          <CategoryButton 
            key={category.id}
            active={currentCategory === category.id}
            onClick={() => setCurrentCategory(category.id)}
          >
            {category.name[i18n.language]}
          </CategoryButton>
        ))}
      </CategoryNav>
      
      <ProductsGrid>
        {products.length > 0 ? (
          products.map(product => (
            <ProductItem key={product._id}>
              <ProductCard product={product} isRTL={isRTL} />
            </ProductItem>
          ))
        ) : (
          <NoProductsMessage>{t('no_products_found') || 'No products found'}</NoProductsMessage>
        )}
      </ProductsGrid>
    </div>
  );
};



// Styled Components

const NoProductsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--primary-color);
`;
const PageHeader = styled.h1`
  text-align: center;
  margin: 30px 0;
  color: var(--primary-color);
  font-size: 28px;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background-color: var(--secondary-color);
    margin: 15px auto 0;
  }
`;

const CategoryNav = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const CategoryButton = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  margin: 0 10px 10px;
  color: ${props => props.active ? 'var(--secondary-color)' : 'var(--primary-color)'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 16px;
  position: relative;
  transition: all 0.2s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.active ? '30px' : '0'};
    height: 2px;
    background-color: var(--secondary-color);
    transition: all 0.2s ease;
  }
  
  &:hover {
    color: var(--secondary-color);
    
    &:after {
      width: 30px;
    }
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductItem = styled.div`
  height: 100%;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--primary-color);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--danger-color);
`;

export default ProductsPage;