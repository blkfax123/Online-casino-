import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameCard } from './GameCard';
import { 
  Search, 
  TrendingUp, 
  Zap, 
  Dices, 
  CircleDot, 
  Spade, 
  Target,
  Bomb,
  Ticket,
  Crown,
  Filter
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rtp: number;
  players: number;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
}

interface GameDashboardProps {
  onGameSelect: (gameId: string) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ onGameSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const games: Game[] = [
    {
      id: 'crash',
      name: 'Crash',
      description: 'Watch the multiplier rise and cash out before it crashes!',
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      rtp: 99,
      players: 2847,
      category: 'featured',
      isHot: true
    },
    {
      id: 'dice',
      name: 'Dice',
      description: 'Roll the dice and predict the outcome',
      icon: <Dices className="w-8 h-8 text-secondary" />,
      rtp: 98.5,
      players: 1532,
      category: 'dice'
    },
    {
      id: 'limbo',
      name: 'Limbo',
      description: 'Set your target and see if you can reach it',
      icon: <Target className="w-8 h-8 text-accent" />,
      rtp: 99,
      players: 892,
      category: 'featured',
      isNew: true
    },
    {
      id: 'slots',
      name: 'Slots Deluxe',
      description: 'Spin the reels for massive jackpots',
      icon: <CircleDot className="w-8 h-8 text-primary" />,
      rtp: 96.8,
      players: 3421,
      category: 'slots',
      isHot: true
    },
    {
      id: 'roulette',
      name: 'European Roulette',
      description: 'Classic casino experience with single zero',
      icon: <CircleDot className="w-8 h-8 text-destructive" />,
      rtp: 97.3,
      players: 1876,
      category: 'table'
    },
    {
      id: 'blackjack',
      name: 'Blackjack Pro',
      description: 'Beat the dealer in this classic card game',
      icon: <Spade className="w-8 h-8 text-foreground" />,
      rtp: 99.5,
      players: 1243,
      category: 'table'
    },
    {
      id: 'plinko',
      name: 'Plinko',
      description: 'Drop the ball and watch it bounce to riches',
      icon: <CircleDot className="w-8 h-8 text-accent" />,
      rtp: 98.8,
      players: 756,
      category: 'arcade'
    },
    {
      id: 'mines',
      name: 'Mines',
      description: 'Navigate the minefield for explosive wins',
      icon: <Bomb className="w-8 h-8 text-destructive" />,
      rtp: 97.5,
      players: 634,
      category: 'arcade'
    },
    {
      id: 'keno',
      name: 'Keno',
      description: 'Pick your lucky numbers and win big',
      icon: <Ticket className="w-8 h-8 text-secondary" />,
      rtp: 95.2,
      players: 445,
      category: 'lottery'
    },
    {
      id: 'wheel',
      name: 'Wheel of Fortune',
      description: 'Spin the wheel for massive multipliers',
      icon: <Crown className="w-8 h-8 text-primary" />,
      rtp: 96.5,
      players: 892,
      category: 'featured'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Games', icon: <Filter className="w-4 h-4" /> },
    { id: 'featured', label: 'Featured', icon: <Zap className="w-4 h-4" /> },
    { id: 'slots', label: 'Slots', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'table', label: 'Table Games', icon: <Spade className="w-4 h-4" /> },
    { id: 'dice', label: 'Dice', icon: <Dices className="w-4 h-4" /> },
    { id: 'arcade', label: 'Arcade', icon: <Target className="w-4 h-4" /> },
    { id: 'lottery', label: 'Lottery', icon: <Ticket className="w-4 h-4" /> }
  ];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-casino bg-clip-text text-transparent">
              Game Lobby
            </h1>
            <p className="text-muted-foreground">
              Choose from our collection of provably fair games
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="pl-10 bg-input/50 border-card-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 bg-muted/50 h-auto p-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3 px-2 text-xs sm:text-sm"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Games Grid */}
        <TabsContent value={selectedCategory} className="mt-4 sm:mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => onGameSelect(game.id)}
              />
            ))}
          </div>
          
          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No games found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-card-border">
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{games.length}</div>
          <div className="text-sm text-muted-foreground">Total Games</div>
        </div>
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-secondary">
            {games.reduce((sum, game) => sum + game.players, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Active Players</div>
        </div>
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">98.1%</div>
          <div className="text-sm text-muted-foreground">Average RTP</div>
        </div>
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">24/7</div>
          <div className="text-sm text-muted-foreground">Support</div>
        </div>
      </div>
    </div>
  );
};