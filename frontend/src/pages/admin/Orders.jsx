import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaEye, FaFileDownload } from 'react-icons/fa';
import axios from 'axios';
import AdminSidebar from '../../components/admin/Sidebar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = `/api/admin/orders?page=${currentPage}`;
        
        if (filterStatus !== 'all') {
          url += `&status=${filterStatus}`;
        }
        
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }
        
        const response = await axios.get(url);
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setLoading(false);
      }
    };

    // Mock data for development
    // setTimeout(() => {
    //   const mockOrders = [
    //     {
    //       _id: '1001',
    //       orderNumber: 'ORD-1001',
    //       customer: {
    //         name: 'Ahmed Ali',
    //         email: 'ahmed@example.com',
    //         phone: '+966 123 456 789'
    //       },
    //       items: [
    //         {
    //           product: {
    //             _id: '1',
    //             name: 'Musk 100ml',
    //             price: 230.00,
    //             image: '/images/musk_bottle.png'
    //           },
    //           quantity: 2,
    //           price: 230.00
    //         },
    //         {
    //           product: {
    //             _id: '2',
    //             name: 'The fifth 100ml',
    //             price: 230.00,
    //             image: '/images/fifth_bottle.png'
    //           },
    //           quantity: 1,
    //           price: 230.00
    //         }
    //       ],
    //       totalAmount: 690.00,
    //       status: 'completed',
    //       shippingAddress: {
    //         address: '123 Main St, Riyadh',
    //         city: 'Riyadh',
    //         postalCode: '12345',
    //         country: 'Saudi Arabia'
    //       },
    //       paymentMethod: 'credit_card',
    //       createdAt: '2023-05-10T10:30:00.000Z',
    //       updatedAt: '2023-05-12T14:20:00.000Z'
    //     },
    //     {
    //       _id: '1002',
    //       orderNumber: 'ORD-1002',
    //       customer: {
    //         name: 'Sara Mohammed',
    //         email: 'sara@example.com',
    //         phone: '+966 987 654 321'
    //       },
    //       items: [
    //         {
    //           product: {
    //             _id: '4',
    //             name: 'Bliss 100ml',
    //             price: 230.00,
    //             image: '/images/bliss_bottle.png'
    //           },
    //           quantity: 1,
    //           price: 230.00
    //         }
    //       ],
    //       totalAmount: 230.00,
    //       status: 'processing',
    //       shippingAddress: {
    //         address: '456 Oak St, Jeddah',
    //         city: 'Jeddah',
    //         postalCode: '54321',
    //         country: 'Saudi Arabia'
    //       },
    //       paymentMethod: 'cash_on_delivery',
    //       createdAt: '2023-05-15T09:15:00.000Z',
    //       updatedAt: '2023-05-15T09:15:00.000Z'
    //     },
    //     {
    //       _id: '1003',
    //       orderNumber: 'ORD-1003',
    //       customer: {
    //         name: 'Khalid Ibrahim',
    //         email: 'khalid@example.com',
    //         phone: '+966 456 789 123'
    //       },
    //       items: [
    //         {
    //           product: {
    //             _id: '3',
    //             name: 'Flow of three 100ml',
    //             price: 230.00,
    //             image: '/images/flow_bottle.png'
    //           },
    //           quantity: 1,
    //           price: 230.00
    //         },
    //         {
    //           product: {
    //             _id: '1',
    //             name: 'Musk 100ml',
    //             price: 230.00,
    //             image: '/images/musk_bottle.png'
    //           },
    //           quantity: 2,
    //           price: 230.00
    //         }
    //       ],
    //       totalAmount: 690.00,
    //       status: 'shipped',
    //       shippingAddress: {
    //         address: '789 Pine St, Dammam',
    //         city: 'Dammam',
    //         postalCode: '67890',
    //         country: 'Saudi Arabia'
    //       },
    //       paymentMethod: 'credit_card',
    //       createdAt: '2023-05-18T15:45:00.000Z',
    //       updatedAt: '2023-05-19T11:30:00.000Z'
    //     },
    //     {
    //       _id: '1004',
    //       orderNumber: 'ORD-1004',
    //       customer: {
    //         name: 'Fatima Ahmed',
    //         email: 'fatima@example.com',
    //         phone: '+966 789 123 456'
    //       },
    //       items: [
    //         {
    //           product: {
    //             _id: '2',
    //             name: 'The fifth 100ml',
    //             price: 230.00,
    //             image: '/images/fifth_bottle.png'
    //           },
    //           quantity: 1,
    //           price: 230.00
    //         }
    //       ],
    //       totalAmount: 230.00,
    //       status: 'cancelled',
    //       shippingAddress: {
    //         address: '321 Elm St, Mecca',
    //         city: 'Mecca',
    //         postalCode: '13579',
    //         country: 'Saudi Arabia'
    //       },
    //       paymentMethod: 'cash_on_delivery',
    //       createdAt: '2023-05-20T08:00:00.000Z',
    //       updatedAt: '2023-05-21T10:15:00.000Z'
    //     }
    //   ];
      
      // Filter orders based on search and status filter
      // let filteredOrders = mockOrders;
      
      // if (filterStatus !== 'all') {
      //   filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
      // }
      
      // if (searchQuery) {
      //   const query = searchQuery.toLowerCase();
      //   filteredOrders = filteredOrders.filter(order => 
      //     order.orderNumber.toLowerCase().includes(query) ||
      //     order.customer.name.toLowerCase().includes(query) ||
      //     order.customer.email.toLowerCase().includes(query)
      //   );
      // }
      
    //   setOrders(filteredOrders);
    //   setTotalPages(Math.ceil(filteredOrders.length / 10));
    //   setLoading(false);
    // }, 1000);

    fetchOrders(); // Uncomment when backend is connected
  }, [currentPage, filterStatus, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // For mock data, just update locally
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      // With backend:
      // await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      // Refresh orders list
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <PageHeader>
          <h1>Orders Management</h1>
          <p>Manage customer orders</p>
        </PageHeader>
        
        <FilterBar>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </SearchForm>
          
          <FilterDropdown
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FilterDropdown>
        </FilterBar>
        
        <OrdersTable>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {orders && orders.length > 0 ? (
    orders.map((order) => (
      <tr key={order._id}>
        <td>{order?.orderNumber || 'N/A'}</td>
        <td>{order?.customer?.name || 'Unknown'}</td>
        <td>{order?.createdAt ? formatDate(order.createdAt) : 'N/A'}</td>
        <td>﷼ {order?.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td>
        <td>
          <OrderStatus status={order?.status || 'pending'}>
            {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
          </OrderStatus>
        </td>
        <td>
          <ActionButtons>
            <ViewButton onClick={() => handleViewOrder(order)}>
              <FaEye />
            </ViewButton>
            <InvoiceButton>
              <FaFileDownload />
            </InvoiceButton>
          </ActionButtons>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
        {loading ? 'Loading orders...' : 'No orders found'}
      </td>
    </tr>
  )}
          </tbody>
        </OrdersTable>
        
        {orders && orders.length === 0 && !loading && (
          <NoOrdersMessage>No orders found matching your criteria.</NoOrdersMessage>
        )}
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationButton 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            
            <PageInfo>
              Page {currentPage} of {totalPages}
            </PageInfo>
            
            <PaginationButton 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </Pagination>
        )}
        
        {showOrderDetails && selectedOrder && (
          <OrderDetailsOverlay>
            <OrderDetailsModal>
              <ModalHeader>
                <h2>Order Details - {selectedOrder.orderNumber}</h2>
                <CloseButton onClick={() => setShowOrderDetails(false)}>×</CloseButton>
              </ModalHeader>
              
              <ModalContent>
                <OrderDetailsSection>
                  <h3>Order Information</h3>
                  <OrderDetail>
                    <span>Status:</span>
                    <OrderStatus status={selectedOrder.status}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </OrderStatus>
                  </OrderDetail>
                  <OrderDetail>
                    <span>Date:</span>
                    <div>{formatDate(selectedOrder.createdAt)}</div>
                  </OrderDetail>
                  <OrderDetail>
                    <span>Payment Method:</span>
                    <div>
                      {selectedOrder.paymentMethod === 'credit_card' ? 'Credit Card' : 'Cash on Delivery'}
                    </div>
                  </OrderDetail>
                </OrderDetailsSection>
                
                <OrderDetailsGrid>
                  <OrderDetailsSection>
                    <h3>Customer</h3>
                    <div>
                      <p><strong>{selectedOrder.customer.name}</strong></p>
                      <p>{selectedOrder.customer.email}</p>
                      <p>{selectedOrder.customer.phone}</p>
                    </div>
                  </OrderDetailsSection>
                  
                  <OrderDetailsSection>
                    <h3>Shipping Address</h3>
                    <div>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </OrderDetailsSection>
                </OrderDetailsGrid>
                
                <OrderDetailsSection>
                  <h3>Order Items</h3>
                  <OrderItemsTable>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <OrderItemInfo>
                              <OrderItemImage src={item.product.image} alt={item.product.name} />
                              <div>{item.product.name}</div>
                            </OrderItemInfo>
                          </td>
                          <td>﷼ {item.price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>﷼ {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </OrderItemsTable>
                </OrderDetailsSection>
                
                <OrderSummary>
                  <OrderSummaryRow>
                    <span>Subtotal:</span>
                    <span>﷼ {selectedOrder.totalAmount.toFixed(2)}</span>
                  </OrderSummaryRow>
                  <OrderSummaryRow>
                    <span>Shipping:</span>
                    <span>﷼ 30.00</span>
                  </OrderSummaryRow>
                  <OrderSummaryRow total>
                    <span>Total:</span>
                    <span>﷼ {(selectedOrder.totalAmount + 30).toFixed(2)}</span>
                  </OrderSummaryRow>
                </OrderSummary>
              </ModalContent>
              
              <ModalFooter>
                <UpdateStatus>
                  <span>Update Status:</span>
                  <StatusSelect
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </StatusSelect>
                </UpdateStatus>
                
                <div>
                  <CloseModalButton onClick={() => setShowOrderDetails(false)}>
                    Close
                  </CloseModalButton>
                  <PrintInvoiceButton>
                    Print Invoice
                  </PrintInvoiceButton>
                </div>
              </ModalFooter>
            </OrderDetailsModal>
          </OrderDetailsOverlay>
        )}
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

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  @media (max-width: 580px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  max-width: 400px;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const SearchButton = styled.button`
  padding: 0 15px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

const FilterDropdown = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
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
  
  @media (max-width: 768px) {
    display: block;
    
    thead, tbody, tr, th, td {
      display: block;
    }
    
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    
    tr {
      border: 1px solid #eee;
      margin-bottom: 20px;
      position: relative;
      padding: 10px;
    }
    
    td {
      border: none;
      position: relative;
      padding-left: 50%;
      
      &:before {
        position: absolute;
        top: 15px;
        left: 10px;
        width: 45%;
        white-space: nowrap;
        font-weight: 600;
      }
      
      &:nth-of-type(1):before { content: "Order #"; }
      &:nth-of-type(2):before { content: "Customer"; }
      &:nth-of-type(3):before { content: "Date"; }
      &:nth-of-type(4):before { content: "Total"; }
      &:nth-of-type(5):before { content: "Status"; }
      &:nth-of-type(6):before { content: "Actions"; }
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
      case 'pending':
        return `
          background-color: #f5f5f5;
          color: #777;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ViewButton = styled.button`
  background-color: #e6f0f9;
  color: #3498db;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const InvoiceButton = styled.button`
  background-color: #f5f5f5;
  color: #777;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #777;
    color: white;
  }
`;

const NoOrdersMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #777;
  font-size: 16px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #ddd;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.div`
  padding: 8px 16px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  color: #777;
  font-size: 14px;
`;

const OrderDetailsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const OrderDetailsModal = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  
  h2 {
    font-size: 20px;
    color: var(--primary-color);
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  
  &:hover {
    color: #e74c3c;
  }
`;

const ModalContent = styled.div`
  padding: 20px;
`;

const OrderDetailsSection = styled.div`
  margin-bottom: 30px;
  
  h3 {
    font-size: 16px;
    color: var(--primary-color);
    margin-bottom: 15px;
    position: relative;
    
    &:after {
      content: '';
      display: block;
      width: 30px;
      height: 2px;
      background-color: var(--secondary-color);
      margin-top: 5px;
    }
  }
`;

const OrderDetail = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  span {
    width: 150px;
    font-weight: 600;
    color: #555;
  }
`;

const OrderDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const OrderItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    color: var(--primary-color);
  }
`;

const OrderItemInfo = styled.div`
  display: flex;
  align-items: center;
`;

const OrderItemImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 10px;
`;

const OrderSummary = styled.div`
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
`;

const OrderSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  
  ${props => props.total && `
    font-weight: 600;
    font-size: 18px;
    color: var(--secondary-color);
    border-top: 1px solid #eee;
    margin-top: 10px;
    padding-top: 15px;
  `}
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const UpdateStatus = styled.div`
  display: flex;
  align-items: center;
  
  span {
    margin-right: 10px;
    font-weight: 500;
  }
`;

const StatusSelect = styled.select`
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const CloseModalButton = styled.button`
  padding: 8px 15px;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const PrintInvoiceButton = styled.button`
  padding: 8px 15px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

export default AdminOrders;