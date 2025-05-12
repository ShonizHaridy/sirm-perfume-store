import styled, { keyframes } from 'styled-components';
import { useApp } from '../context/AppContext';

const Loading = () => {
  const { isLoading } = useApp();

  if (!isLoading) {
    return null;
  }

  return (
    <LoadingOverlay>
      <LoadingSpinner />
    </LoadingOverlay>
  );
};

// Styled Components
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--secondary-color);
  animation: ${spin} 1s ease-in-out infinite;
`;

export default Loading;