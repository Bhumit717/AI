```typescript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  calculateCartTotal,
} from '../store/slices/cartSlice';
import { RootState } from '../store';
import { Product } from '../types/Product';
import { useCart } from '../hooks/useCart';

// Styled Components
const CartContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const CartTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const CartItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 10px;
`;

const ProductInfo = styled.div`
  flex-grow: 1;
`;

const ProductName = styled.h4`
  margin: 0;
`;

const ProductPrice = styled.p`
  margin: 5px 0;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const CartSummary = styled.div`
  margin-top: 20px;
  text-align: right;
`;

const TotalPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

const CheckoutButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #218838;
  }
`;

const EmptyCartMessage = styled.p`
  text-align: center;
  font-style: italic;
  color: #777;
`;

// Cart Component
const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    dispatch(calculateCartTotal());
  }, [cartItems, dispatch]);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeItem(productId);
    } catch (err: any) {
      console.error('Failed to remove item from cart:', err.message);
      // Optionally display an error message to the user
      alert(`Failed to remove item: ${err.message}`);
    }
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return; // Prevent setting quantity to less than 1
    }
    try {
      await updateQuantity(productId, quantity);
    } catch (err: any) {
      console.error('Failed to update quantity:', err.message);
      // Optionally display an error message to the user
      alert(`Failed to update quantity: ${err.message}`);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error}</div>;
  }

  return (
    <CartContainer>
      <CartTitle>Shopping Cart</CartTitle>
      {cartItems.length === 0 ? (
        <EmptyCartMessage>Your cart is empty.</EmptyCartMessage>
      ) : (
        <>
          <CartItemsContainer>
            {cartItems.map((item) => (
              <CartItem key={item.product._id}>
                <ProductImage src={item.product.imageUrl} alt={item.product.name} />
                <ProductInfo>
                  <ProductName>{item.product.name}</ProductName>
                  <ProductPrice>${item.product.price}</ProductPrice>
                </ProductInfo>
                <QuantityControls>
                  <QuantityButton onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>
                    -
                  </QuantityButton>
                  <span>{item.quantity}</span>
                  <QuantityButton onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>
                    +
                  </QuantityButton>
                </QuantityControls>
                <RemoveButton onClick={() => handleRemoveFromCart(item.product._id)}>Remove</RemoveButton>
              </CartItem>
            ))}
          </CartItemsContainer>
          <CartSummary>
            <TotalPrice>Total: ${total.toFixed(2)}</TotalPrice>
            <CheckoutButton onClick={handleCheckout}>Proceed to Checkout</CheckoutButton>
            <button onClick={handleClearCart}>Clear Cart</button>
          </CartSummary>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;
```