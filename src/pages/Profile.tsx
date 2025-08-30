import React, { useState } from 'react';
import { User, LogOut, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';

const Profile: React.FC = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      // Login Logic
      if (!formData.email || !formData.password) {
        toast({
          title: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }

      // Mock login - in real app, you'd validate against a backend
      actions.login({
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
      });

      toast({
        title: "Login successful!",
        description: `Welcome back, ${formData.name || formData.email.split('@')[0]}!`,
      });

      navigate('/');
    } else {
      // Signup Logic
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          variant: "destructive",
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }

      // Mock signup
      actions.login({
        email: formData.email,
        name: formData.name,
      });

      toast({
        title: "Account created successfully!",
        description: `Welcome to Electro Fusion, ${formData.name}!`,
      });

      navigate('/');
    }
  };

  const handleLogout = () => {
    actions.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/');
  };

  if (state.isAuthenticated) {
    return (
      <div className="min-h-screen py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8">
            {/* Profile Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {state.user?.name}!</h1>
              <p className="text-muted-foreground">{state.user?.email}</p>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {state.orders.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {state.wishlist.length}
                </div>
                <div className="text-sm text-muted-foreground">Wishlist Items</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {state.cart.length}
                </div>
                <div className="text-sm text-muted-foreground">Cart Items</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              
              <button
                onClick={() => navigate('/orders')}
                className="w-full p-4 text-left bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    📦
                  </div>
                  <div>
                    <div className="font-medium">View Order History</div>
                    <div className="text-sm text-muted-foreground">
                      Track your orders and download invoices
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/wishlist')}
                className="w-full p-4 text-left bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    💝
                  </div>
                  <div>
                    <div className="font-medium">My Wishlist</div>
                    <div className="text-sm text-muted-foreground">
                      View and manage your saved items
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="w-full p-4 text-left bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    🛒
                  </div>
                  <div>
                    <div className="font-medium">Shopping Cart</div>
                    <div className="text-sm text-muted-foreground">
                      Review items and proceed to checkout
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-6 bg-gradient-card">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {isLoginMode ? <LogIn size={32} className="text-primary" /> : <UserPlus size={32} className="text-primary" />}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isLoginMode ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground">
              {isLoginMode 
                ? 'Sign in to your Electro Fusion account' 
                : 'Join Electro Fusion today'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    placeholder="Enter your full name"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    placeholder="Confirm your password"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="w-full btn-hero">
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Demo Note */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground text-center">
              <div className="font-medium mb-1">Demo Mode</div>
              <div>This is a demo login. Use any email and password to sign in.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;