import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { HamburgerMenu } from './HamburgerMenu';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar onMenuToggle={handleMenuToggle} />
      
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};