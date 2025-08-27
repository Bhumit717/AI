```typescript
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components'; // Or import from Material-UI
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme'; // Assuming you have a theme file
import Home from './pages/Home';
import Products from './pages/Products';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserAccount from './pages/UserAccount';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { checkAuth } from './store/slices/userSlice'; // Import the checkAuth action

// Define a type for the App component's props (if any)
interface AppProps {}

// Main App component
const App: React.FC<AppProps> = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status on app mount
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-account" element={<UserAccount />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<div>404 Not Found</div>} /> {/* Catch-all route */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
```