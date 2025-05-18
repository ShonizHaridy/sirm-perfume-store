import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import AdminSidebar from '../../components/admin/Sidebar';

import { useTranslation } from 'react-i18next';


const Dashboard = () => {

  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };

    // // Mock data for development
    // setTimeout(() => {
    //   setStats({
    //     totalProducts: 24,
    //     totalOrders: 156,
    //     totalCustomers: 89,
    //     totalRevenue: 36540,
    //     recentOrders: [
    //       { id: '1001', customer: 'Ahmed Ali', date: '2023-05-07', total: 460, status: 'completed' },
    //       { id: '1002', customer: 'Sara Mohammed', date: '2023-05-06', total: 230, status: 'processing' },
    //       { id: '1003', customer: 'Khalid Ibrahim', date: '2023-05-05', total: 690, status: 'completed' },
    //       { id: '1004', customer: 'Fatima Ahmed', date: '2023-05-04', total: 230, status: 'shipped' },
    //       { id: '1005', customer: 'Omar Saeed', date: '2023-05-03', total: 460, status: 'completed' }
    //     ]
    //   });
    //   setLoading(false);
    // }, 1000);

    fetchDashboardData(); // Uncomment when backend is connected
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <PageHeader>
          <div>
            <h1>{t('admin_dashboard')}</h1>
            <p>{t('welcome_message')}</p>
          </div>
        </PageHeader>
        
        <StatsGrid>
          <StatCard>
            <StatIcon style={{ backgroundColor: '#e74c3c33' }}>
              <FaBox style={{ color: '#e74c3c' }} />
            </StatIcon>
            <StatInfo>
              <StatValue>{stats.totalProducts}</StatValue>
              <StatLabel>Products</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon style={{ backgroundColor: '#3498db33' }}>
              <FaShoppingCart style={{ color: '#3498db' }} />
            </StatIcon>
            <StatInfo>
              <StatValue>{stats.totalOrders}</StatValue>
              <StatLabel>Orders</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon style={{ backgroundColor: '#2ecc7133' }}>
              <FaUsers style={{ color: '#2ecc71' }} />
            </StatIcon>
            <StatInfo>
              <StatValue>{stats.totalCustomers}</StatValue>
              <StatLabel>Customers</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon style={{ backgroundColor: '#f39c1233' }}>
              <FaDollarSign style={{ color: '#f39c12' }} />
            </StatIcon>
            <StatInfo>
<StatValue>﷼ {stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}</StatValue>              <StatLabel>Revenue</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsGrid>
        
        <SectionTitle>
          <FaChartLine style={{ marginRight: '10px' }} />
          Recent Orders
        </SectionTitle>
        
        <OrdersTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
{stats.recentOrders && stats.recentOrders.length > 0 ? (
  stats.recentOrders.map((order) => (
    <tr key={order.id}>
      <td>#{order.id}</td>
      <td>{order.customer}</td>
      <td>{new Date(order.date).toLocaleDateString()}</td>
      <td>﷼ {order.total.toLocaleString()}</td>
      <td>
        <OrderStatus status={order.status}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </OrderStatus>
      </td>
      <td>
        <Link to={`/admin/orders/${order.id}`}>View</Link>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
      No recent orders found
    </td>
  </tr>
)}
          </tbody>
        </OrdersTable>
      </MainContent>
    </AdminLayout>
  );
};

// Styled Components
const AdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    color: var(--primary-color);
    margin-bottom: 5px;
  }
  
  p {
    color: #777;
    font-size: 14px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 15px;
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #777;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: var(--primary-color);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f9f9f9;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  tbody tr:hover {
    background-color: #f9f9f9;
  }
  
  a {
    color: var(--secondary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const OrderStatus = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background-color: #e6f7e9;
          color: #2ecc71;
        `;
      case 'processing':
        return `
          background-color: #e6f0f9;
          color: #3498db;
        `;
      case 'shipped':
        return `
          background-color: #fef4e6;
          color: #f39c12;
        `;
      case 'cancelled':
        return `
          background-color: #fde9e9;
          color: #e74c3c;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #777;
        `;
    }
  }}
`;
const AdminBadge = styled.span`
  background-color: var(--secondary-color);
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
`;

export default Dashboard;