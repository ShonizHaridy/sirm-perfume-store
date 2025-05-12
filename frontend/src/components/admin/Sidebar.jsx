import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';

import { useTranslation } from 'react-i18next';


const AdminSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const menuItems = [
      { path: '/admin', label: t('admin_dashboard'), icon: <FaTachometerAlt /> },
      { path: '/admin/products', label: t('admin_products'), icon: <FaBox /> },
      { path: '/admin/orders', label: t('admin_orders'), icon: <FaShoppingCart /> },
      { path: '/admin/customers', label: t('admin_customers'), icon: <FaUsers /> },
      { path: '/admin/settings', label: t('admin_settings'), icon: <FaCog /> },
    ];
  
  
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>sirm</Logo>
        <AdminTag>Admin Panel</AdminTag>
      </SidebarHeader>
      
      <SidebarMenu>
        {menuItems.map((item) => (
          <MenuItem key={item.path} active={location.pathname === item.path}>
            <MenuLink to={item.path}>
              <MenuIcon>{item.icon}</MenuIcon>
              <MenuLabel>{item.label}</MenuLabel>
            </MenuLink>
          </MenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarFooter>
        <LogoutButton>
          <FaSignOutAlt />
          <span>Logout</span>
        </LogoutButton>
        <AdminInfo>
          <AdminName>Admin User</AdminName>
          <AdminRole>Super Admin</AdminRole>
        </AdminInfo>
      </SidebarFooter>
    </SidebarContainer>
  );
};

// Styled Components
const SidebarContainer = styled.aside`
  width: 250px;
  background-color: var(--primary-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  
  @media (max-width: 768px) {
    width: 70px;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px 10px;
    text-align: center;
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 5px;
`;

const AdminTag = styled.div`
  font-size: 12px;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const MenuItem = styled.li`
  margin: 5px 0;
  
  a {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    color: ${props => props.active ? 'var(--secondary-color)' : 'var(--text-color)'};
    background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
    border-left: ${props => props.active ? '4px solid var(--secondary-color)' : '4px solid transparent'};
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--secondary-color);
    }
  }
  
  @media (max-width: 768px) {
    a {
      padding: 15px 0;
      justify-content: center;
    }
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-right: 10px;
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const MenuLabel = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.8;
  padding: 8px 0;
  cursor: pointer;
  
  span {
    margin-left: 10px;
  }
  
  &:hover {
    opacity: 1;
    color: #e74c3c;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    
    span {
      display: none;
    }
  }
`;

const AdminInfo = styled.div`
  margin-top: 15px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const AdminName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const AdminRole = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

export default AdminSidebar;