import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';

const Wishlist: React.FC = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  const handleMoveToCart = (productId: string) => {
    const product = state.wishlist.find(item => item.id === productId);
    if (product) {
      actions.moveToCart(productId);
      toast({
        title: "Moved to cart",
        description: `${product.name} moved to your cart`,
      });
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    const product = state.wishlist.find(item => item.id === productId);
    actions.removeFromWishlist(productId);
    if (product) {
      toast({
        title: "Removed from wishlist",
        description: `${product.name} removed from wishlist`,
      });
    }
  };

  if (state.wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💝</div>
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">
            Save your favorite items here so you don't lose sight of them.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-hero"
          >
            <Heart className="mr-2" size={20} />
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <div className="text-muted-foreground">
            {state.wishlist.length} {state.wishlist.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.wishlist.map((product) => (
            <div key={product.id} className="glass-card p-6 group">
              {/* Product Image */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>

                {/* Specs */}
                <div className="space-y-1">
                  {product.specs.ram && (
                    <div className="text-xs text-muted-foreground">
                      {product.specs.ram} • {product.specs.storage}
                    </div>
                  )}
                  {product.specs.display && (
                    <div className="text-xs text-muted-foreground">
                      {product.specs.display}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </div>

                {/* Price Comparison */}
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amazon:</span>
                    <span>₹{product.priceComparison.amazon.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flipkart:</span>
                    <span>₹{product.priceComparison.flipkart.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Myntra:</span>
                    <span>₹{product.priceComparison.myntra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meesho:</span>
                    <span>₹{product.priceComparison.meesho.toLocaleString()}</span>
                  </div>
                </div>

                {/* Move to Cart Button */}
                <button
                  onClick={() => handleMoveToCart(product.id)}
                  className="w-full flex items-center justify-center space-x-2 btn-primary"
                >
                  <ShoppingCart size={16} />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;