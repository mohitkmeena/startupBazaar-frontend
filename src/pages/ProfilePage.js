import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Shield,
  Store,
  ShoppingBag
} from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    // Here you would typically make an API call to update the user profile
    // For now, we'll just update the local state
    setUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SELLER':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Store className="w-4 h-4" />
            Seller
          </div>
        );
      case 'BUYER':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <ShoppingBag className="w-4 h-4" />
            Buyer
          </div>
        );
      case 'BOTH':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            Buyer & Seller
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="container py-12">
        <div className="card max-w-md mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <User className="w-10 h-10 text-blue-400" />
            My Profile
          </h1>
          <p className="text-white/70 text-lg">Manage your account information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-ghost"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder="Your full name"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.email}</span>
                    <div className="ml-auto">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.phone}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder="City, State"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getRoleBadge(user.role)}
                    <span className="text-gray-600 text-sm ml-auto">
                      {user.role === 'BOTH' 
                        ? 'You can buy and sell products'
                        : user.role === 'SELLER'
                        ? 'You can list products for sale'
                        : 'You can purchase products'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Products listed</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Offers made</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Offers received</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/create-product" className="btn btn-primary w-full">
                  <Store className="w-4 h-4" />
                  List New Product
                </a>
                <a href="/offers" className="btn btn-outline w-full">
                  View Offers
                </a>
                <a href="/favorites" className="btn btn-outline w-full">
                  My Favorites
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;