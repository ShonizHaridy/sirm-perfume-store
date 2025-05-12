import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const Notifications = () => {
  const { notifications, removeNotification } = useApp();

  useEffect(() => {
    // Clean up all notifications on component unmount
    return () => {
      notifications.forEach(notification => {
        removeNotification(notification.id);
      });
    };
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <NotificationsContainer>
      {notifications.map(notification => (
        <Notification 
          key={notification.id}
          type={notification.type}
        >
          <NotificationIcon type={notification.type}>
            {notification.type === 'success' && <FaCheckCircle />}
            {notification.type === 'info' && <FaInfoCircle />}
            {notification.type === 'warning' && <FaExclamationTriangle />}
            {notification.type === 'error' && <FaTimesCircle />}
          </NotificationIcon>
          <NotificationMessage>{notification.message}</NotificationMessage>
          <CloseButton onClick={() => removeNotification(notification.id)}>
            &times;
          </CloseButton>
        </Notification>
      ))}
    </NotificationsContainer>
  );
};

// Styled Components
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const NotificationsContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  
  .rtl & {
    right: auto;
    left: 20px;
  }
`;

const Notification = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.3s ease;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `border-left: 4px solid #2ecc71;`;
      case 'info':
        return `border-left: 4px solid #3498db;`;
      case 'warning':
        return `border-left: 4px solid #f39c12;`;
      case 'error':
        return `border-left: 4px solid #e74c3c;`;
      default:
        return `border-left: 4px solid #3498db;`;
    }
  }}
  
  .rtl & {
    border-left: none;
    
    ${props => {
      switch (props.type) {
        case 'success':
          return `border-right: 4px solid #2ecc71;`;
        case 'info':
          return `border-right: 4px solid #3498db;`;
        case 'warning':
          return `border-right: 4px solid #f39c12;`;
        case 'error':
          return `border-right: 4px solid #e74c3c;`;
        default:
          return `border-right: 4px solid #3498db;`;
      }
    }}
  }
`;

const NotificationIcon = styled.div`
  margin-right: 10px;
  font-size: 20px;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `color: #2ecc71;`;
      case 'info':
        return `color: #3498db;`;
      case 'warning':
        return `color: #f39c12;`;
      case 'error':
        return `color: #e74c3c;`;
      default:
        return `color: #3498db;`;
    }
  }}
  
  .rtl & {
    margin-right: 0;
    margin-left: 10px;
  }
`;

const NotificationMessage = styled.div`
  flex: 1;
  font-size: 14px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 0 5px;
  margin-left: 10px;
  
  &:hover {
    color: #555;
  }
  
  .rtl & {
    margin-left: 0;
    margin-right: 10px;
  }
`;

export default Notifications;