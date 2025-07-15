import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Zap, 
  Wallet, 
  Plus, 
  Minus, 
  Bell, 
  Menu, 
  Eye, 
  EyeOff,
  Crown
} from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(balance);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-glass border-b border-card-border shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="hover:bg-primary/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-casino rounded-lg flex items-center justify-center shadow-neon-primary">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-casino bg-clip-text text-transparent hidden sm:block">
                NeonBet
              </span>
            </div>
          </div>

          {/* Center - Balance display */}
          <div className="flex items-center gap-4">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-card-border">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {balanceVisible ? formatBalance(user?.balance || 0) : '••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-primary/10"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                  >
                    {balanceVisible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                {user?.isVip && (
                  <Badge variant="secondary" className="ml-2 bg-gradient-casino text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    VIP {user.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="sm"
              className="hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-1" />
              Deposit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Minus className="w-4 h-4 mr-1" />
              Withdraw
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-primary/10"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </span>
            </Button>

            {/* Mobile deposit/withdraw */}
            <div className="flex sm:hidden gap-1">
              <Button variant="success" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};