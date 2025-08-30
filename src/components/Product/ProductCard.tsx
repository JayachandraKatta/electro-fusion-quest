import React from 'react';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../../contexts/AppContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { actions, state } = useApp();
  const navigate = useNavigate();
  
  const isWishlisted = state.wishlist.some(item => item.id === product.id);
  const isInCart = state.cart.some(item => item.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isWishlisted) {
      actions.removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} removed from your wishlist`,
      });
    } else {
      actions.addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} added to your wishlist`,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    actions.addToCart(product);
    navigate('/cart');
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const lowestCompetitorPrice = Math.min(
    product.priceComparison.amazon,
    product.priceComparison.flipkart,
    product.priceComparison.myntra,
    product.priceComparison.meesho
  );

  const savings = lowestCompetitorPrice - product.price;

  return (
    <div className="product-card group">
      {/* Product Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isWishlisted
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Savings Badge */}
        {savings > 0 && (
          <div className="absolute top-3 left-3 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
            Save ₹{savings.toLocaleString()}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>

        {/* Specs */}
        <div className="space-y-1">
          {product.specs.ram && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Zap size={12} className="mr-1" />
              {product.specs.ram} RAM • {product.specs.storage}
            </div>
          )}
          {product.specs.display && (
            <div className="text-xs text-muted-foreground">
              {product.specs.display}
            </div>
          )}
          {product.specs.processor && (
            <div className="text-xs text-muted-foreground">
              {product.specs.processor}
            </div>
          )}
        </div>

        {/* Price Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
            {savings > 0 && (
              <span className="text-xs text-success font-medium">
                Best Price!
              </span>
            )}
          </div>

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
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isInCart
              ? 'bg-success text-success-foreground cursor-not-allowed'
              : 'btn-primary hover:scale-105 shadow-glow'
          }`}
        >
          <ShoppingCart size={16} />
          <span>{isInCart ? 'In Cart' : 'Buy from Electro Fusion'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;