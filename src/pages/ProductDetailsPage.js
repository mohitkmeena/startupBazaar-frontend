import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  MessageSquare,
  FileText,
  Eye,
  Calendar,
  User,
  Shield,
  X,
  Type,
  Download
} from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, setFavorites } = useContext(AppContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({
    amount: '',
    message: ''
  });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  useEffect(() => {
    fetchProduct();
    if (user) {
      fetchOffers();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        navigate('/products');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    if (!user || !product) return;
    
    try {
      setLoadingOffers(true);
      const response = await axios.get(`/api/offers/product/${product.productId || product.id}`);
      setOffers(response.data.offers || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      await axios.put(`/api/offers/${offerId}/${action}`);
      fetchOffers(); // Refresh offers
      alert(`Offer ${action}ed successfully!`);
    } catch (error) {
      alert(`Failed to ${action} offer: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      const productId = product.productId || product.id;
      const isFavorite = favorites.some(fav => (fav.productId || fav.id) === productId);
      
      if (isFavorite) {
        await axios.delete(`/api/favorites/${productId}`);
        setFavorites(prev => prev.filter(fav => (fav.productId || fav.id) !== productId));
      } else {
        await axios.post(`/api/favorites/${productId}`);
        setFavorites(prev => [...prev, product]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to make an offer');
      return;
    }

    setOfferLoading(true);
    try {
      const submitData = {
        productId: product.productId || product.id,
        amount: parseFloat(offerData.amount),
        message: offerData.message
      };
      
      await axios.post('/api/offers', submitData);
      
      setShowOfferModal(false);
      setOfferData({ amount: '', message: '' });
      alert('Offer sent successfully!');
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to send offer');
    } finally {
      setOfferLoading(false);
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
      month: 'long',
      day: 'numeric'
    });
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

  if (!product) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.productId === product.productId);
  const isOwner = user && user.userId === product.sellerId;

  return (
    <div className="container py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost mb-6 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            {/* Product Image */}
            {(product.imageUrl || product.image) ? (
              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                className="product-image-large mb-6"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-6" 
              style={{ display: (product.imageUrl || product.image) ? 'none' : 'flex' }}
            >
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <span className="text-gray-500">{product.category} Startup</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <span className="badge badge-primary">{product.category}</span>
                </div>
                
                {user && !isOwner && (
                  <button
                    onClick={toggleFavorite}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
                {product.website && (
                  <div className="flex items-center gap-1">
                    <Type className="w-4 h-4" />
                    <a 
                      href={product.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Listed {formatDate(product.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{product.seller_name}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Startup</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Documents */}
            {product.documents && product.documents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.documents.map((doc, index) => (
                    <div key={doc.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">{doc.contentType}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={doc.url}
                          download={doc.fileName}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Asking Price</div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(product.askValue)}
                </div>
              </div>
              
              <div className="grid grid-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Annual Revenue</div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Annual Profit</div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(product.profit)}
                  </div>
                </div>
              </div>

              {product.revenue > 0 && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Revenue Multiple</div>
                  <div className="font-semibold text-gray-900">
                    {(product.askValue / product.revenue).toFixed(1)}x
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {user && !isOwner && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested?</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="btn btn-primary w-full"
                >
                  <MessageSquare className="w-4 h-4" />
                  Make an Offer
                </button>
                
                <button
                  onClick={toggleFavorite}
                  className={`btn w-full ${
                    isFavorite ? 'btn-secondary' : 'btn-outline'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
                </button>
              </div>
            </div>
          )}

          {isOwner && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Listing</h3>
              
              {loadingOffers ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : offers.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recent Offers</h4>
                  {offers.slice(0, 3).map(offer => (
                    <div key={offer.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-900">₹{offer.amount}</div>
                          <div className="text-sm text-gray-500">by {offer.buyerName}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          offer.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          offer.status?.toLowerCase() === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {offer.status}
                        </div>
                      </div>
                      {offer.message && (
                        <div className="text-sm text-gray-600 mb-2">"{offer.message}"</div>
                      )}
                      {offer.status?.toLowerCase() === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOfferAction(offer.id, 'accept')}
                            className="btn btn-success btn-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleOfferAction(offer.id, 'reject')}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleOfferAction(offer.id, 'counter')}
                            className="btn btn-warning btn-sm"
                          >
                            Counter
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {offers.length > 3 && (
                    <button
                      onClick={() => navigate('/offers')}
                      className="btn btn-outline w-full"
                    >
                      View All Offers
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm mb-4">
                    No offers yet. Share your listing to attract potential buyers.
                  </p>
                  <button
                    onClick={() => navigate('/offers')}
                    className="btn btn-primary w-full"
                  >
                    View Offers Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Make an Offer</h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit}>
              <div className="form-group">
                <label className="form-label">Offer Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={offerData.amount}
                    onChange={(e) => setOfferData(prev => ({ ...prev, amount: e.target.value }))}
                    className="form-input pl-8"
                    placeholder="Enter your offer"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message (Optional)</label>
                <textarea
                  value={offerData.message}
                  onChange={(e) => setOfferData(prev => ({ ...prev, message: e.target.value }))}
                  className="form-input form-textarea"
                  placeholder="Add a message to your offer..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={offerLoading}
                  className="btn btn-primary"
                >
                  {offerLoading ? <div className="spinner" /> : 'Send Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;