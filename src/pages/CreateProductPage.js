import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  DollarSign,
  TrendingUp,
  MapPin,
  Type
} from 'lucide-react';

const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    revenue: '',
    askValue: '',
    profit: '',
    location: '',
    image: '',
    documents: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      
      if (type === 'image') {
        setFormData(prev => ({ ...prev, image: base64 }));
      } else if (type === 'document') {
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, {
            id: Date.now(),
            name: file.name,
            data: base64
          }]
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (documentId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.description || !formData.category) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.revenue) <= 0 || parseFloat(formData.askValue) <= 0) {
      setError('Revenue and asking price must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        revenue: parseFloat(formData.revenue),
        askValue: parseFloat(formData.askValue),
        profit: parseFloat(formData.profit) || 0,
        documents: formData.documents.map(doc => doc.data)
      };

      await axios.post('/api/products', submitData);
      navigate('/my-products');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'SELLER' && user.role !== 'BOTH')) {
    return (
      <div className="container py-12">
        <div className="card max-w-md mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only sellers can create product listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">List Your Startup</h1>
          <p className="text-white/70 text-lg">Create a detailed listing to attract potential buyers</p>
        </div>

        {error && (
          <div className="card bg-red-50 border border-red-200 text-red-600 p-4 mb-6">
            {error}
          </div>
        )}

        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Basic Information
              </h3>
              
              <div className="grid grid-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Startup Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Your startup name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input form-select"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Describe your startup, its features, and what makes it unique..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Information (INR)
              </h3>
              
              <div className="grid grid-3 gap-6">
                <div className="form-group">
                  <label className="form-label">Annual Revenue *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">₹</span>
                    <input
                      type="number"
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleChange}
                      className="form-input pl-8"
                      placeholder="1000000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Asking Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">₹</span>
                    <input
                      type="number"
                      name="askValue"
                      value={formData.askValue}
                      onChange={handleChange}
                      className="form-input pl-8"
                      placeholder="5000000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Annual Profit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">₹</span>
                    <input
                      type="number"
                      name="profit"
                      value={formData.profit}
                      onChange={handleChange}
                      className="form-input pl-8"
                      placeholder="500000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5" />
                Product Image
              </h3>
              
              {formData.image ? (
                <div className="relative inline-block">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-48 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload product image</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Authentication Documents
              </h3>
              <p className="text-gray-600 text-sm mb-4">Upload documents like ITR, GST certificates to build trust</p>
              
              {formData.documents.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="file-upload">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, 'document')}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">Click to upload documents</p>
                  <p className="text-gray-400 text-sm">PDF, DOC, or images up to 5MB each</p>
                </label>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? <div className="spinner" /> : 'List Startup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;