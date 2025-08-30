import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';

const Cart: React.FC = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    actions.updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    actions.removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} removed from cart`,
    });
  };

  const totalAmount = actions.getCartTotal();
  const totalItems = actions.getCartItemCount();

  const handleCheckout = () => {
    if (!state.isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout",
        variant: "destructive",
      });
      navigate('/profile');
      return;
    }
    navigate('/checkout');
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-hero"
          >
            <ShoppingBag className="mr-2" size={20} />
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <div className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.cart.map((item) => (
              <div key={item.id} className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  {/* Product Image */}
                  <div className="w-full md:w-24 h-48 md:h-24 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-muted-foreground">{item.brand}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-primary">
                        ₹{item.price.toLocaleString()}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-hero"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2" size={20} />
              </button>

              <div className="mt-4 text-sm text-muted-foreground text-center">
                🔒 Secure checkout • Free delivery in 2 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;