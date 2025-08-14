import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import { 
  Search, 
  Filter, 
  Heart, 
  MapPin, 
  TrendingUp, 
  DollarSign,
  Eye,
  Star
} from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    location: ''
  });
  const { user, favorites, setFavorites } = useContext(AppContext);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);

      const response = await axios.get(`/api/products?${params.toString()}`);
      
      // Filter out any products with missing required data
      const validProducts = response.data.products.filter(product => 
        product && 
        product.name && 
        product.name.trim() !== '' && 
        product.description && 
        product.location
      );
      
      setProducts(validProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setLoading(true);
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      const isFavorite = favorites.some(fav => fav.productId === productId);
      
      if (isFavorite) {
        await axios.delete(`/api/favorites/${productId}`);
        setFavorites(prev => prev.filter(fav => fav.productId !== productId));
      } else {
        await axios.post(`/api/favorites/${productId}`);
        const product = products.find(p => p.productId === productId);
        setFavorites(prev => [...prev, product]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.response?.data?.detail || 'Failed to update favorites');
    }
  };

  const formatCurrency = (amount) => {
    // Handle null, undefined, or invalid amounts
    if (amount == null || isNaN(amount) || amount < 0) {
      return '₹0';
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading && products.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Browse Startups</h1>
        <p className="text-white/70 text-lg">Discover amazing startups and digital products for sale</p>
      </div>

      {/* Filters */}
      <div className="filters mb-8">
        <div className="search-bar mb-4 md:mb-0">
          <div className="relative">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              className="search-input form-input"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            className="form-input form-select min-w-48"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by location..."
            className="form-input min-w-48"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError('')}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-3 gap-6">
          {products.map(product => {
            // Additional safety check - skip products with missing critical data
            if (!product || !product.productId || !product.name || !product.description) {
              return null;
            }
            
            const isFavorite = favorites.some(fav => fav.productId === product.productId);
            
            return (
              <div key={product.productId} className="card fade-in group">
                <div className="relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name || 'Product'}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center" style={{ display: product.image ? 'none' : 'flex' }}>
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm">{product.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  
                  {user && (
                    <button
                      onClick={() => toggleFavorite(product.productId)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                        isFavorite 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="badge badge-primary">{product.category || 'Uncategorized'}</span>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name || 'Unnamed Product'}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || 'No description available'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Revenue</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(product.revenue || 0)}/year
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Asking Price</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {formatCurrency(product.askValue || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Profit</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(product.profit || 0)}/year
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location || 'Location not specified'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/product/${product.productId}`}
                      className="btn btn-primary flex-1 text-center"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">No products found</h3>
          <p className="text-white/70 mb-6">
            {filters.search || filters.category !== 'all' || filters.location 
              ? 'Try adjusting your filters to find more products'
              : 'Be the first to list your startup!'
            }
          </p>
          {user && (user.role === 'SELLER' || user.role === 'BOTH') && (
            <Link to="/create-product" className="btn btn-primary">
              List Your Startup
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;