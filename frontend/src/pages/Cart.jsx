import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [shippingCost, setShippingCost] = useState(30);
  const isRTL = i18n.language === 'ar';

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <EmptyCartContainer>
          <EmptyCartIcon>🛒</EmptyCartIcon>
          <EmptyCartTitle>{t('empty_cart')}</EmptyCartTitle>
          <EmptyCartText>{t('empty_cart_message')}</EmptyCartText>
          <ContinueShoppingButton to="/products">
            {t('continue_shopping')}
            {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
          </ContinueShoppingButton>
        </EmptyCartContainer>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader>
        <h1>{t('shopping_cart')}</h1>
      </PageHeader>
      
      <CartContainer>
        <CartItemsSection>
          <CartItemsTable>
            <thead>
              <tr>
                <th>{t('product')}</th>
                <th>{t('price')}</th>
                <th>{t('quantity')}</th>
                <th>{t('total')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item._id}>
                  <td>
                    <ProductInfo>
                      <ProductImage src={item.image} alt={item.name} />
                      <ProductName>{isRTL ? item.nameAr : item.name}</ProductName>
                    </ProductInfo>
                  </td>
                  <td>
                    <ProductPrice>{item.currency} {item.price.toFixed(2)}</ProductPrice>
                  </td>
                  <td>
                    <QuantityControls>
                      <QuantityButton 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </QuantityButton>
                      <QuantityInput 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))} 
                        min="1" 
                      />
                      <QuantityButton 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </QuantityButton>
                    </QuantityControls>
                  </td>
                  <td>
                    <ProductTotal>{item.currency} {(item.price * item.quantity).toFixed(2)}</ProductTotal>
                  </td>
                  <td>
                    <RemoveButton onClick={() => removeFromCart(item._id)}>
                      <FaTrash />
                    </RemoveButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </CartItemsTable>
          
          <CartActions>
            <ContinueShopping to="/products">
              {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
              {t('continue_shopping')}
            </ContinueShopping>
            <ClearCartButton onClick={clearCart}>
              {t('clear_cart')}
            </ClearCartButton>
          </CartActions>
        </CartItemsSection>
        
        <CartSummary>
          <SummaryTitle>{t('order_summary')}</SummaryTitle>
          
          <SummaryRow>
            <SummaryLabel>{t('subtotal')}</SummaryLabel>
            <SummaryValue>﷼ {cartTotal.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>{t('shipping')}</SummaryLabel>
            <SummaryValue>﷼ {shippingCost.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <SummaryTotal>
            <SummaryLabel>{t('total')}</SummaryLabel>
            <TotalValue>﷼ {(cartTotal + shippingCost).toFixed(2)}</TotalValue>
          </SummaryTotal>
          
          <CheckoutButton onClick={handleCheckout}>
            {t('proceed_to_checkout')}
            {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
          </CheckoutButton>
          
          <AcceptedPayments>
            <PaymentTitle>{t('we_accept')}</PaymentTitle>
            <PaymentMethods>
              <img src="/images/payment-methods.png" alt="Accepted Payment Methods" />
            </PaymentMethods>
          </AcceptedPayments>
        </CartSummary>
      </CartContainer>
    </div>
  );
};

// Styled Components
const PageHeader = styled.div`
  margin: 30px 0;
  
  h1 {
    font-size: 28px;
    color: var(--primary-color);
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      display: block;
      width: 40px;
      height: 2px;
      background-color: var(--secondary-color);
      margin-top: 10px;
      
      .rtl & {
        margin-left: auto;
      }
    }
  }
`;

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div``;

const CartItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
    color: var(--primary-color);
    font-weight: 600;
    
    .rtl & {
      text-align: right;
    }
  }
  
  td {
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
    
    .rtl & {
      text-align: right;
    }
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
      padding-left: 40%;
      
      &:before {
        position: absolute;
        top: 15px;
        left: 10px;
        width: 35%;
        white-space: nowrap;
        font-weight: 600;
      }
      
      &:nth-of-type(1):before { content: "${props => props.productLabel || 'Product'}"; }
      &:nth-of-type(2):before { content: "${props => props.priceLabel || 'Price'}"; }
      &:nth-of-type(3):before { content: "${props => props.quantityLabel || 'Quantity'}"; }
      &:nth-of-type(4):before { content: "${props => props.totalLabel || 'Total'}"; }
      
      .rtl & {
        padding-left: 10px;
        padding-right: 40%;
        
        &:before {
          left: auto;
          right: 10px;
        }
      }
    }
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  
  .rtl & {
    flex-direction: row-reverse;
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-right: 15px;
  
  .rtl & {
    margin-right: 0;
    margin-left: 15px;
  }
`;

const ProductName = styled.div`
  font-weight: 500;
  color: var(--primary-color);
`;

const ProductPrice = styled.div`
  font-weight: 500;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: flex-end;
    
    .rtl & {
      justify-content: flex-start;
    }
  }
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: #f1f1f1;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 30px;
  border: 1px solid #f1f1f1;
  text-align: center;
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

const ProductTotal = styled.div`
  font-weight: 600;
  color: var(--secondary-color);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const CartActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  
  @media (max-width: 580px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ContinueShopping = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
  
  svg {
    margin-right: 8px;
    
    .rtl & {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  
  &:hover {
    color: var(--secondary-color);
  }
`;

const ClearCartButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 8px 15px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  
  &:hover {
    border-color: var(--danger-color);
    color: var(--danger-color);
  }
`;

const CartSummary = styled.div`
  background-color: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h2`
  font-size: 20px;
  color: var(--primary-color);
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  
  .rtl & {
    flex-direction: row-reverse;
  }
`;

const SummaryLabel = styled.div`
  color: #666;
`;

const SummaryValue = styled.div`
  font-weight: 500;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  margin-bottom: 25px;
  
  .rtl & {
    flex-direction: row-reverse;
  }
`;

const TotalValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: var(--secondary-color);
`;

const CheckoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
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

const AcceptedPayments = styled.div`
  margin-top: 25px;
`;

const PaymentTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const PaymentMethods = styled.div`
  img {
    max-width: 100%;
    height: 24px;
  }
`;

const EmptyCartContainer = styled.div`
  text-align: center;
  padding: 60px 0;
`;

const EmptyCartIcon = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
`;

const EmptyCartTitle = styled.h2`
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const EmptyCartText = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 25px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
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

export default Cart;