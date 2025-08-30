import React from 'react';
import { Download, Package, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { downloadInvoice } from '../utils/pdfGenerator';
import { toast } from '../hooks/use-toast';

const OrderHistory: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const handleDownloadInvoice = (order: any) => {
    downloadInvoice(order);
    toast({
      title: "Invoice downloaded",
      description: `Invoice for order ${order.id} has been downloaded`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="text-success" size={20} />;
      case 'Processing':
        return <Clock className="text-warning" size={20} />;
      case 'Delivered':
        return <Package className="text-success" size={20} />;
      default:
        return <Clock className="text-muted-foreground" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-success bg-success/10';
      case 'Processing':
        return 'text-warning bg-warning/10';
      case 'Delivered':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-8">
            Please login to view your order history.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="btn-hero"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (state.orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-muted-foreground mb-8">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-hero"
          >
            <Package className="mr-2" size={20} />
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
          <h1 className="text-3xl font-bold">Order History</h1>
          <div className="text-muted-foreground">
            {state.orders.length} {state.orders.length === 1 ? 'order' : 'orders'}
          </div>
        </div>

        <div className="space-y-6">
          {state.orders.map((order) => (
            <div key={order.id} className="glass-card p-6">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Placed on {new Date(order.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>₹{order.total.toLocaleString()}</span>
                    <span>•</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                  
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Download size={16} />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="text-sm">₹{item.price.toLocaleString()}</span>
                        <span className="text-sm font-medium">
                          Total: ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {order.status === 'Delivered' && (
                      <div className="text-right">
                        <div className="text-sm text-success font-medium mb-1">Delivered</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Delivery Address</h4>
                <div className="text-sm text-muted-foreground">
                  <div>{order.address.name}</div>
                  <div>{order.address.street}</div>
                  <div>{order.address.city}, {order.address.state} - {order.address.pincode}</div>
                  <div>Phone: {order.address.phone}</div>
                </div>
              </div>

              {/* Expected Delivery */}
              {order.status !== 'Delivered' && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="text-primary" size={20} />
                    <span className="font-medium text-primary">
                      Expected delivery: {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;