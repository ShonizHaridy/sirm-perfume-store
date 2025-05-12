import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { productService } from '../services';


const Home = () => {
  const { t, i18n } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Use the service instead of direct axios calls
        const featuredData = await productService.getFeaturedProducts();
        const newArrivalsData = await productService.getAllProducts({ limit: 4 });
        
        console.log('Featured data:', featuredData);
        console.log('New arrivals data:', newArrivalsData);
        
        // Ensure we're setting arrays
        setFeaturedProducts(Array.isArray(featuredData) ? featuredData : []);
        setNewArrivals(Array.isArray(newArrivalsData) ? newArrivalsData : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Set empty arrays on error
        setFeaturedProducts([]);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    // // Mock data for development
    // setTimeout(() => {
    //   const mockProducts = [
    //     {
    //       _id: '1',
    //       name: 'Musk 100ml',
    //       nameAr: 'مسك 100مل',
    //       price: 230.00,
    //       currency: '﷼',
    //       image: '/images/musk_bottle.png',
    //       boxImage: '/images/musk_box.png',
    //       category: 'spray'
    //     },
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
      
    //   setFeaturedProducts(mockProducts);
    //   setNewArrivals(mockProducts);
    //   setLoading(false);
    // }, 1000);

    fetchProducts(); // Uncomment when backend is connected
  }, []);

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <>
      <HeroSection>
        <div className="container">
          <HeroContent>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HeroTitle>Discover The Perfect Fragrance</HeroTitle>
              <HeroSubtitle>Luxury scents that captivate your senses</HeroSubtitle>
              <HeroButton to="/products">
                Shop Now
                {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
              </HeroButton>
            </motion.div>
          </HeroContent>
        </div>
      </HeroSection>

      <Section>
        <div className="container">
          <SectionHeader>
            <SectionTitle>Featured Products</SectionTitle>
            <SectionLink to="/products">
              View All
              {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
            </SectionLink>
          </SectionHeader>
          
          <ProductGrid>
            {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductItem key={product._id}>
                  <ProductCard product={product} isRTL={isRTL} />
                </ProductItem>
              ))
            ) : (
              <NoProductsMessage>No featured products available</NoProductsMessage>
            )}
          </ProductGrid>
        </div>
      </Section>

      <StorySection>
        <div className="container">
          <StoryContainer>
            <StoryImage src="/images/story-image.jpg" alt="Our Story" />
            <StoryContent>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <SectionTitle>Our Passion</SectionTitle>
                <StoryText>
                  A passionate story sirm started in 2018, looking for excellence and exclusivity, 
                  taking everything in the field and taking it far to attract the largest category 
                  that loves perfumes in the Middle East.
                </StoryText>
                <StoryButton to="/about">Learn More</StoryButton>
              </motion.div>
            </StoryContent>
          </StoryContainer>
        </div>
      </StorySection>

      <Section>
        <div className="container">
          <SectionHeader>
            <SectionTitle>New Arrivals</SectionTitle>
            <SectionLink to="/products">
              View All
              {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
            </SectionLink>
          </SectionHeader>
          
          <ProductGrid>
            {Array.isArray(newArrivals) && newArrivals.length > 0 ? (
              newArrivals.map(product => (
                <ProductItem key={product._id}>
                  <ProductCard product={product} isRTL={isRTL} />
                </ProductItem>
              ))
            ) : (
              <NoProductsMessage>No new arrivals available</NoProductsMessage>
            )}
          </ProductGrid>
        </div>
      </Section>

      <SubscribeSection>
        <div className="container">
          <SubscribeContainer>
            <SubscribeTitle>Subscribe to Our Newsletter</SubscribeTitle>
            <SubscribeText>Stay updated with our latest products and exclusive offers</SubscribeText>
            <SubscribeForm>
              <SubscribeInput type="email" placeholder="Your email address" />
              <SubscribeButton type="submit">Subscribe</SubscribeButton>
            </SubscribeForm>
          </SubscribeContainer>
        </div>
      </SubscribeSection>
    </>
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

const NoProductsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--primary-color);
`;

const HeroSection = styled.section`
  background-image: url('/images/hero-background.jpg');
  background-size: cover;
  background-position: center;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  position: relative;
  color: var(--text-color);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  
  .rtl & {
    margin-left: auto;
    text-align: right;
  }
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 30px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 25px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  svg {
    margin-left: 10px;
    
    .rtl & {
      margin-left: 0;
      margin-right: 10px;
    }
  }
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

const Section = styled.section`
  padding: 80px 0;
  
  @media (max-width: 768px) {
    padding: 50px 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  color: var(--primary-color);
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background-color: var(--secondary-color);
    margin-top: 15px;
    
    .rtl & {
      margin-left: auto;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SectionLink = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  svg {
    margin-left: 8px;
    
    .rtl & {
      margin-left: 0;
      margin-right: 8px;
    }
  }
  
  &:hover {
    color: var(--accent-color);
  }
`;

const ProductGrid = styled.div`
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

const ProductItem = styled.div``;

const StorySection = styled.section`
  padding: 80px 0;
  background-color: #f9f9f9;
  
  @media (max-width: 768px) {
    padding: 50px 0;
  }
`;

const StoryContainer = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const StoryImage = styled.img`
  width: 50%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`;

const StoryContent = styled.div`
  width: 50%;
  padding-left: 50px;
  
  .rtl & {
    padding-left: 0;
    padding-right: 50px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    
    .rtl & {
      padding-right: 0;
    }
  }
`;

const StoryText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #555;
`;

const StoryButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background: none;
  border: 2px solid var(--secondary-color);
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
    color: white;
  }
`;

const SubscribeSection = styled.section`
  padding: 80px 0;
  background-color: var(--primary-color);
  color: var(--text-color);
  
  @media (max-width: 768px) {
    padding: 50px 0;
  }
`;

const SubscribeContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const SubscribeTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SubscribeText = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  opacity: 0.8;
`;

const SubscribeForm = styled.form`
  display: flex;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const SubscribeInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const SubscribeButton = styled.button`
  padding: 12px 25px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: none;
  border-radius: 0 4px 4px 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
  }
  
  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

export default Home;