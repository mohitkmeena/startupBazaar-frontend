import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-dark mt-auto border-t border-white/10">
      <div className="container py-12">
        <div className="grid grid-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-white mb-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">StartupBazaar</span>
            </Link>
            <p className="text-white/70 mb-6">
              India's premier marketplace for buying and selling startups, SaaS products, and digital businesses. Connect with entrepreneurs and investors to grow your portfolio.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/60">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Made in India 🇮🇳</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/products" className="block text-white/70 hover:text-white transition-colors">
                Browse Products
              </Link>
              <Link to="/create-product" className="block text-white/70 hover:text-white transition-colors">
                List Your Startup
              </Link>
              <Link to="/favorites" className="block text-white/70 hover:text-white transition-colors">
                Favorites
              </Link>
              <Link to="/offers" className="block text-white/70 hover:text-white transition-colors">
                My Offers
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <div className="space-y-3">
              <div className="text-white/70">SaaS Products</div>
              <div className="text-white/70">Fintech</div>
              <div className="text-white/70">E-commerce</div>
              <div className="text-white/70">EdTech</div>
              <div className="text-white/70">HealthTech</div>
              <div className="text-white/70">FoodTech</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/60 text-sm">
            © {currentYear} StartupBazaar. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-white/60 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>for Indian entrepreneurs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;