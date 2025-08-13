import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import { 
  Heart, 
  Trash2, 
  Eye, 
  MapPin, 
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites');
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await axios.delete(`/api/favorites/${productId}`);
      setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites');
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Heart className="w-10 h-10 text-red-400" />
          My Favorites
        </h1>
        <p className="text-white/70 text-lg">Startups you've saved for later</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-2 gap-6">
          {favorites.map(product => (
            <div key={product.product_id} className="card fade-in group">
              <div className="relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center" 
                  style={{ display: product.image ? 'none' : 'flex' }}
                >
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500 text-sm">{product.category}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFavorite(product.product_id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="absolute top-3 left-3">
                  <span className="badge badge-primary">{product.category}</span>
                </div>
              </div>

              <div className="card-body">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Revenue</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(product.revenue)}/year
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Asking Price</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {formatCurrency(product.ask_value)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/product/${product.product_id}`}
                    className="btn btn-primary flex-1 text-center"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  <button
                    onClick={() => removeFavorite(product.product_id)}
                    className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-white/70 mb-6">
            Start exploring startups and save the ones you're interested in
          </p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag className="w-4 h-4" />
            Browse Startups
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;