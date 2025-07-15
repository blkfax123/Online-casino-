import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Settings, 
  History, 
  Crown, 
  Gift, 
  Users, 
  LogOut,
  Wallet,
  Trophy,
  Star,
  TrendingUp
} from 'lucide-react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    {
      category: 'Account',
      items: [
        { icon: User, label: 'Profile', onClick: () => {} },
        { icon: Settings, label: 'Settings', onClick: () => {} },
        { icon: History, label: 'Game History', onClick: () => {} },
      ]
    },
    {
      category: 'Rewards',
      items: [
        { icon: Crown, label: 'VIP Rewards', onClick: () => {}, highlight: user?.isVip },
        { icon: TrendingUp, label: 'Rakeback', onClick: () => {} },
        { icon: Gift, label: 'Bonuses & Challenges', onClick: () => {} },
        { icon: Trophy, label: 'Leaderboards', onClick: () => {} },
      ]
    },
    {
      category: 'Social',
      items: [
        { icon: Users, label: 'Affiliate Program', onClick: () => {} },
        { icon: Star, label: 'Referrals', onClick: () => {} },
      ]
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-80 bg-card/95 backdrop-blur-glass border-card-border p-0"
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-casino rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{user?.username}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'Wallet User'}</p>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-4">
          <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Balance</span>
            </div>
            <span className="font-bold text-primary">
              ${user?.balance?.toLocaleString() || '0.00'}
            </span>
          </div>
        </div>

        <div className="flex-1 px-6 space-y-6">
          {menuItems.map((category, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {category.category}
              </h3>
              <div className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className={`w-full justify-start h-12 px-4 ${
                      item.highlight ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''
                    }`}
                    onClick={() => {
                      item.onClick();
                      onClose();
                    }}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${
                      item.highlight ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span>{item.label}</span>
                    {item.highlight && (
                      <div className="ml-auto">
                        <Crown className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </Button>
                ))}
              </div>
              {index < menuItems.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        <div className="p-6 pt-4 border-t border-card-border">
          <Button
            variant="danger"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};