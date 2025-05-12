import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterColumn>
            {/* <FooterLogo>sirm</FooterLogo> */}
            <FooterLogo>
              <img src="/images/sirm-logo.png" alt="sirm" height="32" />
            </FooterLogo>       
            <FooterDescription>
              A passionate story sirm started in 2018, looking for excellence and exclusivity, 
              taking everything in the field and taking it far to attract the largest category 
              that loves perfumes in the Middle East.
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <FaPinterestP />
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterNav>
              <FooterLink to="/">{t('home')}</FooterLink>
              <FooterLink to="/products">{t('products')}</FooterLink>
              <FooterLink to="/about">{t('about')}</FooterLink>
              <FooterLink to="/contact">{t('contact')}</FooterLink>
            </FooterNav>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Categories</FooterTitle>
            <FooterNav>
              <FooterLink to="/products?category=spray">All Over Spray</FooterLink>
              <FooterLink to="/products?category=perfume">Perfumes</FooterLink>
              <FooterLink to="/products?category=candle">Candles</FooterLink>
              <FooterLink to="/products?category=gift">Gift Sets</FooterLink>
            </FooterNav>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Contact</FooterTitle>
            <ContactInfo>
              <ContactItem>Email: info@sirmperfumes.com</ContactItem>
              <ContactItem>Phone: +966 123 456 789</ContactItem>
              <ContactItem>Address: Riyadh, Saudi Arabia</ContactItem>
            </ContactInfo>
          </FooterColumn>
        </FooterContent>
        
        <FooterBottom>
          <Copyright>&copy; {new Date().getFullYear()} sirm Perfumes. All Rights Reserved.</Copyright>
          <PaymentMethods>
            <img src="/images/payment-methods.png" alt="Payment Methods" />
          </PaymentMethods>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 50px 0 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled.div`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--secondary-color);
`;

const FooterDescription = styled.p`
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.6;
  opacity: 0.8;
`;

const SocialLinks = styled.div`
  display: flex;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border-radius: 50%;
  margin-right: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--secondary-color);
    color: var(--primary-color);
  }
`;

const FooterTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 30px;
    height: 2px;
    background-color: var(--secondary-color);
    margin-top: 8px;
  }
`;

const FooterNav = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  margin-bottom: 10px;
  opacity: 0.8;
  transition: all 0.2s ease;
  font-size: 14px;
  
  &:hover {
    opacity: 1;
    color: var(--secondary-color);
    transform: translateX(5px);
  }
  
  .rtl & {
    &:hover {
      transform: translateX(-5px);
    }
  }
`;

const ContactInfo = styled.div``;

const ContactItem = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.8;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Copyright = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const PaymentMethods = styled.div`
  img {
    height: 24px;
  }
`;

export default Footer;