import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaUserCog, 
  FaListAlt, 
  FaHeart, 
  FaCog, 
  FaTachometerAlt 
} from 'react-icons/fa';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = ({ changeLanguage, currentLang }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <div className="container">
        <HeaderInner>
          {/* Logo Section */}
          {/* <Logo>
            <Link to="/">sirm</Link>
          </Logo> */}
          <Logo>
            <Link to="/">
              <LogoImage src="/images/sirm-logo.png" alt="sirm" />
            </Link>
          </Logo>

          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>

          {/* Navigation Links */}
          <Navigation className={isMenuOpen ? 'active' : ''}>
            <NavLinks>
              <NavItem>
                <Link to="/">{t('home')}</Link>
              </NavItem>
              <NavItem>
                <Link to="/products">{t('products')}</Link>
              </NavItem>
              <NavItem>
                <Link to="/about">{t('about')}</Link>
              </NavItem>
              <NavItem>
                <Link to="/contact">{t('contact')}</Link>
              </NavItem>
              
              {/* Admin specific navigation item */}
              {isAdmin && (
                <NavItem isAdmin={true}>
                  <Link to="/admin">
                    <FaTachometerAlt style={{ marginRight: '5px' }} />
                    {t('admin_panel') || 'Admin Panel'}
                  </Link>
                </NavItem>
              )}
            </NavLinks>
          </Navigation>

          {/* Right Side Actions */}
          <HeaderActions>
            {/* Language Toggle */}
            <LangToggle onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}>
              {currentLang === 'en' ? 'عربي' : 'EN'}
            </LangToggle>

            {/* Search */}
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">
                <FaSearch />
              </SearchButton>
            </SearchForm>

            {/* Cart */}
            <IconLink to="/cart">
              <CartIcon>
                <FaShoppingCart />
                {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
              </CartIcon>
            </IconLink>

            {/* User Menu - Different based on auth state */}
            {isAuthenticated ? (
              <UserMenuContainer>
                <UserMenuTrigger 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  isAdmin={isAdmin}
                >
                  {isAdmin ? <FaUserCog /> : <FaUser />}
                  <UserName>{currentUser?.name?.split(' ')[0]}</UserName>
                </UserMenuTrigger>
                
                {userMenuOpen && (
                  <UserMenuDropdown onClick={(e) => e.stopPropagation()}>
                    {/* User details section */}
                    <UserInfoSection>
                      <UserAvatar>{currentUser?.name?.charAt(0).toUpperCase()}</UserAvatar>
                      <UserDetails>
                        <UserFullName>{currentUser?.name}</UserFullName>
                        <UserEmail>{currentUser?.email}</UserEmail>
                      </UserDetails>
                    </UserInfoSection>
                    
                    <UserMenuDivider />
                    
                    {/* Common user options */}
                    <UserMenuItem onClick={() => {
                      navigate('/profile');
                      setUserMenuOpen(false);
                    }}>
                      <FaUser style={{marginRight: '10px'}} />
                      {t('profile') || 'Profile'}
                    </UserMenuItem>
                    
                    <UserMenuItem onClick={() => {
                      navigate('/orders');
                      setUserMenuOpen(false);
                    }}>
                      <FaListAlt style={{marginRight: '10px'}} />
                      {t('my_orders') || 'My Orders'}
                    </UserMenuItem>
                    
                    <UserMenuItem onClick={() => {
                      navigate('/wishlist');
                      setUserMenuOpen(false);
                    }}>
                      <FaHeart style={{marginRight: '10px'}} />
                      {t('wishlist') || 'Wishlist'}
                    </UserMenuItem>
                    
                    <UserMenuItem onClick={() => {
                      navigate('/settings');
                      setUserMenuOpen(false);
                    }}>
                      <FaCog style={{marginRight: '10px'}} />
                      {t('settings') || 'Settings'}
                    </UserMenuItem>
                    
                    {/* Admin-specific options */}
                    {isAdmin && (
                      <>
                        <UserMenuDivider />
                        <UserMenuSectionTitle>{t('admin_options') || 'Admin Options'}</UserMenuSectionTitle>
                        
                        <UserMenuItem onClick={() => {
                          navigate('/admin');
                          setUserMenuOpen(false);
                        }} isAdmin={true}>
                          <FaTachometerAlt style={{marginRight: '10px'}} />
                          {t('admin_dashboard') || 'Admin Dashboard'}
                        </UserMenuItem>
                        
                        <UserMenuItem onClick={() => {
                          navigate('/admin/products');
                          setUserMenuOpen(false);
                        }} isAdmin={true}>
                          <FaListAlt style={{marginRight: '10px'}} />
                          {t('manage_products') || 'Manage Products'}
                        </UserMenuItem>
                        
                        <UserMenuItem onClick={() => {
                          navigate('/admin/orders');
                          setUserMenuOpen(false);
                        }} isAdmin={true}>
                          <FaShoppingCart style={{marginRight: '10px'}} />
                          {t('manage_orders') || 'Manage Orders'}
                        </UserMenuItem>
                      </>
                    )}
                    
                    <UserMenuDivider />
                    
                    {/* Logout option */}
                    <UserMenuItem onClick={handleLogout}>
                      <FaSignOutAlt style={{marginRight: '10px'}} />
                      {t('logout') || 'Logout'}
                    </UserMenuItem>
                  </UserMenuDropdown>
                )}
              </UserMenuContainer>
            ) : (
              /* Login/Register buttons for non-authenticated users */
              <AuthButtons>
                <LoginButton to="/login">
                  {t('login')}
                </LoginButton>
                <RegisterButton to="/register">
                  {t('register') || 'Register'}
                </RegisterButton>
              </AuthButtons>
            )}
          </HeaderActions>
        </HeaderInner>
      </div>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  // background-color: var(--primary-color);
  background-color: #d3b58d; /* Changed from var(--primary-color) to beige */
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

// const Logo = styled.div`
//   font-size: 28px;
//   font-weight: 700;
//   letter-spacing: 1px;
  
//   a {
//     color: var(--secondary-color);
//     text-decoration: none;
//     transition: color var(--transition-speed) ease;
    
//     &:hover {
//       color: var(--accent-color);
//     }
//   }
// `;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px; // Add space between logo and navigation
  
  a {
    text-decoration: none;
    display: flex;
    align-items: center;
  }
`;

const LogoImage = styled.img`
  height: 38px; // Adjust based on your navbar height
  max-width: 100%;
  display: block;
`;

const Navigation = styled.nav`
  @media (max-width: 768px) {
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-speed) ease;
    order: 3;
    
    &.active {
      max-height: 300px;
    }
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 15px 0;
  }
`;

const NavItem = styled.li`
  margin: 0 25px; // Increase from 15px to 25px for better spacing
  
  a {
    // color: ${props => props.isAdmin ? 'var(--secondary-color)' : 'var(--text-color)'};
    color: ${props => props.isAdmin ? 'var(--primary-color)' : 'var(--text-color)'};
    text-decoration: none;
    font-weight: ${props => props.isAdmin ? '600' : '500'};
    transition: color var(--transition-speed) ease;
    display: flex;
    align-items: center;
    
    &:hover {
      // color: var(--secondary-color);
      color: var(--dark-accent);
    }
  }
  
  @media (max-width: 768px) {
    margin: 15px 0; // Increase vertical spacing in mobile view

  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; // Add gap property for consistent spacing
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    margin-top: 10px;
  }
`;

const LangToggle = styled.button`
  background: none;
  // border: 1px solid var(--secondary-color);
  // color: var(--secondary-color);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 5px 10px;
  border-radius: var(--border-radius);
  margin-right: 15px;
  font-size: 14px;
  
  &:hover {
  //   background-color: var(--secondary-color);
  //   color: var(--primary-color);
    background-color: var(--primary-color);
    color: #d3b58d;
  }
`;

const SearchForm = styled.form`
  display: flex;
  position: relative;
  margin-right: 15px;
`;

const SearchInput = styled.input`
  padding: 8px 35px 8px 15px;
  border: none;
  border-radius: 20px;
  // background-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(56, 40, 29, 0.1); /* Changed color */
  color: var(--text-color);
  font-size: 14px;
  width: 150px;
  transition: all var(--transition-speed) ease;
  
  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.2);
    width: 180px;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const IconLink = styled(Link)`
  color: var(--text-color);
  margin-left: 15px;
  font-size: 18px;
  display: flex;
  transition: color var(--transition-speed) ease;
  
  &:hover {
    color: var(--secondary-color);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 24px;
  
  @media (max-width: 768px) {
    display: block;
    order: 2;
  }
`;

const CartIcon = styled.div`
  position: relative;
  display: flex;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  font-size: 10px;
  font-weight: bold;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenuContainer = styled.div`
  position: relative;
  margin-left: 15px;
`;

const UserMenuTrigger = styled.div`
  display: flex;
  align-items: center;
  // color: ${props => props.isAdmin ? 'var(--secondary-color)' : 'var(--text-color)'};
  // color: ${props => props.isAdmin ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.isAdmin ? '600' : 'normal'};
  cursor: pointer;
  transition: color var(--transition-speed) ease;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: ${props => props.isAdmin ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  
  &:hover {
    color: var(--dark-accent);
    background-color: rgba(212, 175, 55, 0.1);
  }
`;

const UserName = styled.span`
  margin-left: 5px;
  display: none;
  
  @media (min-width: 992px) {
    display: inline;
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  z-index: 100;
  
  .rtl & {
    right: auto;
    left: 0;
  }
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  margin-right: 10px;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserFullName = styled.div`
  font-weight: 600;
  color: var(--primary-color);
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #777;
`;

const UserMenuItem = styled.div`
  padding: 10px 15px;
  // color: ${props => props.isAdmin ? 'var(--secondary-color)' : 'var(--primary-color)'};
  color: ${props => props.isAdmin ? 'var(--secondary-color)' : 'var(--primary-color)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: ${props => props.isAdmin ? '600' : 'normal'};
  
  &:hover {
    background-color: ${props => props.isAdmin ? 'rgba(212, 175, 55, 0.1)' : '#f5f5f5'};
    color: var(--secondary-color);
  }
`;

const UserMenuDivider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 5px 0;
`;

const UserMenuSectionTitle = styled.div`
  padding: 5px 15px;
  font-size: 12px;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
`;

const LoginButton = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  margin-right: 10px;
  transition: color var(--transition-speed) ease;
  
  &:hover {
    color: var(--secondary-color);
  }
`;

const RegisterButton = styled(Link)`
  background-color: var(--secondary-color);
  color: var(--primary-color);
  text-decoration: none;
  padding: 5px 12px;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color var(--transition-speed) ease;
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

export default Header;