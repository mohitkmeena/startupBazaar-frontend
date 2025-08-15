import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import OffersPage from './pages/OffersPage';
import MyProductsPage from './pages/MyProductsPage';
import ProfilePage from './pages/ProfilePage';
// Context for global state management
export const AppContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Setup axios defaults
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    axios.defaults.baseURL = backendUrl;
    
    // Add auth token to all requests if exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Set loading to false immediately - no need to wait for auth
    setLoading(false);
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites');
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    fetchFavorites();
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setFavorites([]);
  };

  const contextValue = {
    user,
    setUser,
    login,
    logout,
    favorites,
    setFavorites,
    fetchFavorites
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main className="min-h-screen flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={user ? <Navigate to="/products" /> : <LoginPage />} 
              />
              <Route 
                path="/register" 
                element={user ? <Navigate to="/products" /> : <RegisterPage />} 
              />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/create-product" element={user ? <CreateProductPage /> : <Navigate to="/login" />} />
              <Route path="/favorites" element={user ? <FavoritesPage /> : <Navigate to="/login" />} />
              <Route path="/offers" element={user ? <OffersPage /> : <Navigate to="/login" />} />
              <Route path="/my-products" element={user ? <MyProductsPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;