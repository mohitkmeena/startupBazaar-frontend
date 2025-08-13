import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Users, 
  Star,
  ChevronRight,
  Store,
  DollarSign,
  Target,
  Award
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Store,
      title: 'List Your Startup',
      description: 'Showcase your SaaS, digital product, or startup to potential buyers with detailed metrics.'
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Our platform connects you with the right buyers based on your business category and value.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Verified documents, authentic listings, and secure communication channels.'
    },
    {
      icon: Users,
      title: 'Active Community',
      description: 'Join thousands of entrepreneurs, investors, and business buyers in one place.'
    }
  ];

  const categories = [
    { name: 'SaaS', count: '150+ products', color: 'bg-blue-500' },
    { name: 'Fintech', count: '85+ products', color: 'bg-green-500' },
    { name: 'E-commerce', count: '200+ products', color: 'bg-purple-500' },
    { name: 'EdTech', count: '90+ products', color: 'bg-orange-500' },
    { name: 'HealthTech', count: '60+ products', color: 'bg-red-500' },
    { name: 'FoodTech', count: '75+ products', color: 'bg-yellow-500' }
  ];

  const stats = [
    { value: '500+', label: 'Active Listings' },
    { value: '₹50Cr+', label: 'Total Value' },
    { value: '1000+', label: 'Happy Users' },
    { value: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Buy & Sell
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Indian Startups
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              India's premier marketplace for startup acquisitions. Connect with entrepreneurs, investors, 
              and business buyers to grow your portfolio with verified Indian startups.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/products"
                className="btn btn-primary btn-lg inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100"
              >
                Browse Startups
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900"
              >
                List Your Startup
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose StartupBazaar?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              The most trusted platform for startup transactions in India, with features designed for entrepreneurs.
            </p>
          </div>

          <div className="grid grid-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="card glass p-8 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Popular Categories</h2>
            <p className="text-xl text-white/70">Discover startups across various industries</p>
          </div>

          <div className="grid grid-3 gap-6 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name}`}
                className="card glass p-6 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`w-3 h-3 rounded-full ${category.color} mb-3`}></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.count}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="card glass p-12 text-center max-w-4xl mx-auto">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who trust StartupBazaar for their business transactions. 
              List your startup today or find your next investment opportunity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary btn-lg inline-flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/products"
                className="btn btn-outline btn-lg"
              >
                Explore Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;