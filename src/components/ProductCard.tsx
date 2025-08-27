```typescript
import React from 'react';
import styled from 'styled-components';
import { Product } from '../types/Product';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const CardContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  width: 250px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 8px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 8px;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const AddToCartButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #367c39;
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    try {
      addToCart(product);
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Optionally, display an error message to the user.
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <CardContainer>
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
      <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton>
    </CardContainer>
  );
};

export default ProductCard;
```