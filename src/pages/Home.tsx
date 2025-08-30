import React, { useState } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { sampleProducts, categories } from '../data/products';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to <span className="text-gradient">Electro Fusion</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up">
            One stop solution for all electronics items
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 animate-slide-up">
            <div className="text-lg flex items-center space-x-2">
              <Star className="text-yellow-400 fill-current" size={20} />
              <span>Best Prices Guaranteed</span>
            </div>
            <div className="text-lg flex items-center space-x-2">
              <span>⚡</span>
              <span>Fast Delivery in 2 Days</span>
            </div>
            <div className="text-lg flex items-center space-x-2">
              <span>🔒</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search for electronics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input min-w-[150px]"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {selectedCategory === 'all' ? 'All Products' : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-muted-foreground">
              {filteredProducts.length} products found
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Electro Fusion?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 glass-card">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">
                Compare prices across multiple platforms and get the best deals.
              </p>
            </div>
            <div className="text-center p-6 glass-card">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get your electronics delivered within 2 days.
              </p>
            </div>
            <div className="text-center p-6 glass-card">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-muted-foreground">
                Shop with confidence with our secure payment system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;