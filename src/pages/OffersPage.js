import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Eye,
  Mail,
  Phone,
  User,
  ArrowRightLeft
} from 'lucide-react';

const OffersPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [counterOffer, setCounterOffer] = useState({ offer_id: '', amount: '', message: '' });
  const [showCounterModal, setShowCounterModal] = useState(false);
  
  const { user } = useContext(AppContext);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const [receivedResponse, sentResponse] = await Promise.all([
        axios.get('/api/offers/received'),
        axios.get('/api/offers/sent')
      ]);
      
      setReceivedOffers(receivedResponse.data.offers);
      setSentOffers(sentResponse.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferAction = async (offerId, action) => {
    setActionLoading(offerId + action);
    try {
      const response = await axios.post(`/api/offers/${offerId}/${action}`);
      
      if (action === 'accept' && response.data.buyer_contact && response.data.seller_contact) {
        const buyerContact = response.data.buyer_contact;
        const sellerContact = response.data.seller_contact;
        
        alert(`Offer accepted! Contact details exchanged:\n\n` +
              `Buyer Contact:\n` +
              `Name: ${buyerContact.name}\n` +
              `Email: ${buyerContact.email}\n` +
              `Phone: ${buyerContact.phone || 'Not provided'}\n\n` +
              `Seller Contact:\n` +
              `Name: ${sellerContact.name}\n` +
              `Email: ${sellerContact.email}\n` +
              `Phone: ${sellerContact.phone || 'Not provided'}`);
      } else if (action === 'reject') {
        alert('Offer rejected successfully');
      }
      
      await fetchOffers();
    } catch (error) {
      alert(error.response?.data?.detail || `Failed to ${action} offer`);
    } finally {
      setActionLoading('');
    }
  };

  const handleCounterOffer = async (e) => {
    e.preventDefault();
    setActionLoading('counter');
    try {
      await axios.post(`/api/offers/${counterOffer.offer_id}/counter`, {
        amount: parseFloat(counterOffer.amount),
        message: counterOffer.message
      });
      
      setShowCounterModal(false);
      setCounterOffer({ offer_id: '', amount: '', message: '' });
      alert('Counter offer sent successfully!');
      await fetchOffers();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to send counter offer');
    } finally {
      setActionLoading('');
    }
  };

  const handleCounterOfferResponse = async (offerId, responseType, message = '') => {
    setActionLoading(offerId + responseType);
    try {
      const response = await axios.post(`/api/offers/${offerId}/counter/respond`, {
        responseType: responseType,
        message: message
      });
      
      if (responseType === 'accept' && response.data.buyer_contact && response.data.seller_contact) {
        const buyerContact = response.data.buyer_contact;
        const sellerContact = response.data.seller_contact;
        
        alert(`Counter offer accepted! Contact details exchanged:\n\n` +
              `Buyer Contact:\n` +
              `Name: ${buyerContact.name}\n` +
              `Email: ${buyerContact.email}\n` +
              `Phone: ${buyerContact.phone || 'Not provided'}\n\n` +
              `Seller Contact:\n` +
              `Name: ${sellerContact.name}\n` +
              `Email: ${sellerContact.email}\n` +
              `Phone: ${sellerContact.phone || 'Not provided'}`);
      } else if (responseType === 'reject') {
        alert('Counter offer rejected successfully');
      }
      
      await fetchOffers();
    } catch (error) {
      alert(error.response?.data?.detail || `Failed to ${responseType} counter offer`);
    } finally {
      setActionLoading('');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'countered': return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      case 'counter_accepted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'counter_rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'countered': return 'status-countered';
      case 'counter_accepted': return 'status-accepted';
      case 'counter_rejected': return 'status-rejected';
      default: return 'status-pending';
    }
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
          <MessageSquare className="w-10 h-10 text-blue-400" />
          My Offers
        </h1>
        <p className="text-white/70 text-lg">Manage your offer communications</p>
      </div>

      {/* Tabs */}
      <div className="card mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'received'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Inbox className="w-5 h-5" />
              <span>Received ({receivedOffers.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'sent'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              <span>Sent ({sentOffers.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Received Offers */}
      {activeTab === 'received' && (
        <div>
          {receivedOffers.length > 0 ? (
            <div className="space-y-4">
              {receivedOffers.map(offer => (
                <div key={offer.offer_id} className="card p-6 fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {offer.product_name}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{offer.buyer_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(offer.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(offer.status)}
                      <span className={`badge ${getStatusClass(offer.status)}`}>
                        {offer.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatCurrency(offer.amount)}
                    </div>
                    {offer.message && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm italic">"{offer.message}"</p>
                      </div>
                    )}
                  </div>

                  {/* Show buyer contact only when offer is accepted */}
                  {offer.status?.toLowerCase() === 'accepted' && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Offer Accepted - Contact Details</span>
                      </div>
                      
                      {/* Show final accepted amount */}
                      <div className="mb-3 p-3 bg-green-100 rounded-lg">
                        <span className="text-sm text-green-700">Final Accepted Amount: </span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(offer.amount)}
                        </span>
                      </div>
                      
                      {/* Buyer Contact Information */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <User className="w-4 h-4" />
                          <span>{offer.buyer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${offer.buyer_email}`} className="hover:underline">
                            {offer.buyer_email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {offer.status?.toLowerCase() === 'countered' && offer.counter_amount && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Your Counter Offer</span>
                      </div>
                      <div className="font-bold text-blue-600 mb-2">
                        {formatCurrency(offer.counter_amount)}
                      </div>
                      {offer.counter_message && (
                        <p className="text-blue-700 text-sm italic">"{offer.counter_message}"</p>
                      )}
                    </div>
                  )}

                  {offer.status?.toLowerCase() === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOfferAction(offer.offer_id, 'accept')}
                        disabled={actionLoading === offer.offer_id + 'accept'}
                        className="btn btn-primary"
                      >
                        {actionLoading === offer.offer_id + 'accept' ? (
                          <div className="spinner" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setCounterOffer({ offer_id: offer.offer_id, amount: '', message: '' });
                          setShowCounterModal(true);
                        }}
                        className="btn btn-secondary"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        Counter
                      </button>
                      <button
                        onClick={() => handleOfferAction(offer.offer_id, 'reject')}
                        disabled={actionLoading === offer.offer_id + 'reject'}
                        className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
                      >
                        {actionLoading === offer.offer_id + 'reject' ? (
                          <div className="spinner" />
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Inbox className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No offers received</h3>
              <p className="text-white/70 mb-6">
                When buyers make offers on your listings, they'll appear here
              </p>
              <Link to="/create-product" className="btn btn-primary">
                List Your Startup
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Sent Offers */}
      {activeTab === 'sent' && (
        <div>
          {sentOffers.length > 0 ? (
            <div className="space-y-4">
              {sentOffers.map(offer => (
                <div key={offer.offer_id} className="card p-6 fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {offer.product_name}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(offer.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(offer.status)}
                      <span className={`badge ${getStatusClass(offer.status)}`}>
                        {offer.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {formatCurrency(offer.amount)}
                    </div>
                    {offer.message && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm italic">"{offer.message}"</p>
                      </div>
                    )}
                  </div>

                  {offer.status?.toLowerCase() === 'countered' && offer.counter_amount && (
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRightLeft className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-900">Seller's Counter Offer</span>
                      </div>
                      <div className="font-bold text-orange-600 mb-2">
                        {formatCurrency(offer.counter_amount)}
                      </div>
                      {offer.counter_message && (
                        <p className="text-orange-700 text-sm italic">"{offer.counter_message}"</p>
                      )}
                      
                      {/* Counter Offer Response Buttons */}
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleCounterOfferResponse(offer.offer_id, 'accept')}
                          disabled={actionLoading === offer.offer_id + 'accept'}
                          className="btn btn-primary btn-sm"
                        >
                          {actionLoading === offer.offer_id + 'accept' ? (
                            <div className="spinner" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Accept Counter
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCounterOfferResponse(offer.offer_id, 'reject')}
                          disabled={actionLoading === offer.offer_id + 'reject'}
                          className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {actionLoading === offer.offer_id + 'reject' ? (
                            <div className="spinner" />
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Reject Counter
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show counter offer response if available */}
                  {(offer.status?.toLowerCase() === 'counter_accepted' || offer.status?.toLowerCase() === 'counter_rejected') && offer.counter_response_message && (
                    <div className={`p-4 rounded-lg mb-4 ${
                      offer.status?.toLowerCase() === 'counter_accepted' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {offer.status?.toLowerCase() === 'counter_accepted' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          offer.status?.toLowerCase() === 'counter_accepted' ? 'text-green-900' : 'text-red-900'
                        }`}>
                          Counter Offer {offer.status?.toLowerCase() === 'counter_accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      </div>
                      {offer.status?.toLowerCase() === 'counter_accepted' && offer.counter_amount && (
                        <div className="mb-2">
                          <span className="text-sm text-green-700">Final Amount: </span>
                          <span className="font-bold text-green-600">{formatCurrency(offer.counter_amount)}</span>
                        </div>
                      )}
                      <p className={`text-sm italic ${
                        offer.status?.toLowerCase() === 'counter_accepted' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        "{offer.counter_response_message}"
                      </p>
                    </div>
                  )}

                  {/* Show contact details for accepted offers (including counter-accepted) */}
                  {(offer.status?.toLowerCase() === 'accepted' || offer.status?.toLowerCase() === 'counter_accepted') && offer.seller_contact && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Offer Accepted - Contact Details</span>
                      </div>
                      
                      {/* Show final accepted amount */}
                      <div className="mb-3 p-3 bg-green-100 rounded-lg">
                        <span className="text-sm text-green-700">Final Accepted Amount: </span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(offer.counter_amount || offer.amount)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <User className="w-4 h-4" />
                          <span>{offer.seller_contact.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-900">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${offer.seller_contact.email}`} className="hover:underline">
                            {offer.seller_contact.email}
                          </a>
                        </div>
                        {offer.seller_contact.phone && (
                          <div className="flex items-center gap-2 text-green-700">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${offer.seller_contact.phone}`} className="hover:underline">
                              {offer.seller_contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Send className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No offers sent</h3>
              <p className="text-white/70 mb-6">
                When you make offers on startups, they'll appear here
              </p>
              <Link to="/products" className="btn btn-primary">
                Browse Startups
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Counter Offer Modal */}
      {showCounterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Counter Offer</h3>
              <button
                onClick={() => setShowCounterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCounterOffer}>
              <div className="form-group">
                <label className="form-label">Counter Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={counterOffer.amount}
                    onChange={(e) => setCounterOffer(prev => ({ ...prev, amount: e.target.value }))}
                    className="form-input pl-8"
                    placeholder="Enter counter amount"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message (Optional)</label>
                <textarea
                  value={counterOffer.message}
                  onChange={(e) => setCounterOffer(prev => ({ ...prev, message: e.target.value }))}
                  className="form-input form-textarea"
                  placeholder="Add a message to your counter offer..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'counter'}
                  className="btn btn-primary"
                >
                  {actionLoading === 'counter' ? <div className="spinner" /> : 'Send Counter Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;