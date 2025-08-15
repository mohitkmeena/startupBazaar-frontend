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
  Star,
  Type,
  FileText
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
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);

      const response = await axios.get(`/api/products?${params.toString()}`);
      
      if (!response.data.products) {
        setProducts([]);
        setError('No products data received from server');
        return;
      }
      
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Failed to load products: ${error.response?.data?.message || error.message}`);
      setProducts([]);
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
      const isFavorite = favorites.some(fav => (fav.productId || fav.id) === productId);
      
      if (isFavorite) {
        await axios.delete(`/api/favorites/${productId}`);
        setFavorites(prev => prev.filter(fav => (fav.productId || fav.id) !== productId));
      } else {
        await axios.post(`/api/favorites/${productId}`);
        const product = products.find(p => (p.productId || p.id) === productId);
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
            const isFavorite = favorites.some(fav => (fav.productId || fav.id) === (product.productId || product.id));
            
            return (
              <div key={product.productId} className="card fade-in group">
                <div className="relative">
                  {product.imageUrl || product.image ? (
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center" style={{ display: (product.imageUrl || product.image) ? 'none' : 'flex' }}>
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm">{product.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  
                  {user && (
                    <button
                      onClick={() => toggleFavorite(product.productId || product.id)}
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

                  {product.website && (
                    <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                      <Type className="w-4 h-4" />
                      <a 
                        href={product.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {product.documents && product.documents.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>{product.documents.length} document{product.documents.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end mt-auto">
                    <Link 
                      to={`/products/${product.productId || product.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {error ? error : "No products match your current filters. Try adjusting your search criteria or check back later."}
            </p>
            {error && (
              <button 
                onClick={() => {
                  setError('');
                  setFilters({ search: '', category: 'all', location: '' });
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;