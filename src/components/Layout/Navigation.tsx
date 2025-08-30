import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Package, Home, Menu } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useIsMobile } from '../../hooks/use-mobile';

const Navigation: React.FC = () => {
  const { state } = useApp();
  const location = useLocation();
  const isMobile = useIsMobile();

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
    { path: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistCount },
    { path: '/orders', icon: Package, label: 'Orders' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (isMobile) {
    return (
      <nav className="nav-mobile">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav-glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="logo">Electro Fusion</div>
          <span className="text-sm text-muted-foreground hidden md:block">
            One stop solution for all electronics items
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {navItems.slice(1).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="hidden md:block">{item.label}</span>
              </Link>
            );
          })}

          {/* User Greeting */}
          {state.isAuthenticated && (
            <div className="text-sm text-muted-foreground hidden lg:block">
              Hello, {state.user?.name}!
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;