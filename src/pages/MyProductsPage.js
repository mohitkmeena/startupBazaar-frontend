import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp, 
  MapPin, 
  MessageSquare,
  Calendar,
  Store
} from 'lucide-react';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await axios.get('/api/my-products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching my products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user || (user.role !== 'SELLER' && user.role !== 'BOTH')) {
    return (
      <div className="container py-12">
        <div className="card max-w-md mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only sellers can view product listings.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Store className="w-10 h-10 text-blue-400" />
            My Products
          </h1>
          <p className="text-white/70 text-lg">Manage your startup listings</p>
        </div>
        
        <Link to="/create-product" className="btn btn-primary">
          <Plus className="w-4 h-4" />
          List New Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="space-y-6">
          {products.map(product => (
            <div key={product.productId} className="card p-6 fade-in">
              <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-32 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center" 
                    style={{ display: product.image ? 'none' : 'flex' }}
                  >
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                        <span className="badge badge-primary">{product.category}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{product.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Listed {formatDate(product.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {formatCurrency(product.askValue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Revenue: {formatCurrency(product.revenue)}/year
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900">0</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900">0</div>
                      <div className="text-xs text-gray-500">Offers</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900">0</div>
                      <div className="text-xs text-gray-500">Favorites</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/product/${product.productId}`}
                      className="btn btn-outline"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      to="/offers"
                      className="btn btn-secondary"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Offers
                    </Link>
                    <div className="ml-auto">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Store className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">No products listed</h3>
          <p className="text-white/70 mb-6">
            List your first startup to start attracting potential buyers
          </p>
          <Link to="/create-product" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            List Your Startup
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;