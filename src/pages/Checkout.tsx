import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Building, Truck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Address, Order } from '../contexts/AppContext';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { toast } from '../hooks/use-toast';

type CheckoutStep = 'address' | 'payment' | 'confirmation';

const Checkout: React.FC = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [address, setAddress] = useState<Address>({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Redirect if cart is empty or user not authenticated
  React.useEffect(() => {
    if (state.cart.length === 0) {
      navigate('/cart');
      return;
    }
    if (!state.isAuthenticated) {
      navigate('/profile');
      return;
    }
  }, [state.cart.length, state.isAuthenticated, navigate]);

  if (state.cart.length === 0) return null;

  const totalAmount = actions.getCartTotal();

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['name', 'email', 'phone', 'street', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !address[field as keyof Address]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Please fill all required fields",
        description: `Missing: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      toast({
        title: "Invalid email address",
        variant: "destructive",
      });
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(address.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    // Pincode validation
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(address.pincode)) {
      toast({
        title: "Invalid pincode",
        description: "Please enter a 6-digit pincode",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast({
        title: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    // Mock payment processing
    setTimeout(() => {
      const orderId = `EF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const order: Order = {
        id: orderId,
        items: [...state.cart],
        total: totalAmount,
        address: { ...address },
        paymentMethod,
        date: new Date().toISOString(),
        status: 'Confirmed',
      };

      // Add order and clear cart
      actions.addOrder(order);
      actions.clearCart();
      
      // Generate and download PDF
      generateInvoicePDF(order);
      
      setOrderPlaced(true);
      setCurrentStep('confirmation');
      
      toast({
        title: "Order placed successfully!",
        description: "Your invoice has been downloaded automatically",
      });
    }, 2000);
  };

  const steps = [
    { key: 'address', title: 'Delivery Address', icon: Truck },
    { key: 'payment', title: 'Payment Method', icon: CreditCard },
    { key: 'confirmation', title: 'Order Confirmation', icon: Building },
  ];

  return (
    <div className="min-h-screen py-8 px-6 bg-gradient-card">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="w-20"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === currentStep;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
            
            return (
              <React.Fragment key={step.key}>
                <div className={`flex flex-col items-center space-y-2 ${
                  isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                }`}>
                  <div className={`p-3 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary/10' : 
                    isCompleted ? 'border-success bg-success/10' : 
                    'border-muted bg-muted'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 mx-4 rounded ${
                    isCompleted ? 'bg-success' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'address' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-semibold mb-6">Delivery Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="form-input"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address *</label>
                    <textarea
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="form-input"
                      rows={3}
                      placeholder="House No, Building Name, Road Name, Area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="form-input"
                        placeholder="6-digit pincode"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="form-input"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <button type="submit" className="w-full btn-hero">
                    Continue to Payment
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI Payment', icon: Smartphone },
                      { id: 'netbanking', label: 'Net Banking', icon: Building },
                      { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-primary"
                          />
                          <Icon size={20} />
                          <span className="font-medium">{method.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('address')}
                      className="flex-1 py-3 px-6 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button type="submit" className="flex-1 btn-hero">
                      {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                      <ArrowRight className="ml-2" size={20} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 'confirmation' && (
              <div className="glass-card p-8 text-center">
                <div className="text-6xl mb-6">✅</div>
                <h2 className="text-3xl font-bold text-success mb-4">Order Confirmed!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your order has been placed successfully. Expected delivery in 2 days.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/orders')}
                    className="btn-primary"
                  >
                    View Order History
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-glass"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {state.cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;