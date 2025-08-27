```typescript
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { RootState } from '../store';
import { Product as ProductType } from '../types/Product';
import { apiClient } from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';

// Styled Components
const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ProductImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 5px;
`;

const ProductTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const ProductDescription = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const AddToCartButton = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #3e8e41;
  }
`;

const BackButton = styled.button`
  background-color: #008CBA;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0077B3;
  }
`;


// Product Component
const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          throw new Error("Product ID is missing.");
        }
        const response = await apiClient.get<ProductType>(`/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleBackButtonClick = () => {
    navigate('/products');
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <ProductContainer>
      <ProductTitle>{product.name}</ProductTitle>
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductDescription>{product.description}</ProductDescription>
      <ProductPrice>Price: ${product.price}</ProductPrice>
      <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton>
      <BackButton onClick={handleBackButtonClick}>Back to Products</BackButton>
    </ProductContainer>
  );
};

export default Product;
```