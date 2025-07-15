import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/auth/LoginPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { GameDashboard } from '@/components/games/GameDashboard';
import { CrashGame } from '@/components/games/CrashGame';
import { DiceGame } from '@/components/games/DiceGame';
import { ComingSoonGame } from '@/components/games/ComingSoonGame';
import { 
  TrendingUp, 
  Dices, 
  CircleDot, 
  Spade, 
  Target,
  Bomb,
  Ticket,
  Crown
} from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Game data for coming soon games
  const gameData = {
    dice: { name: 'Dice', description: 'Roll the dice and predict the outcome', icon: <Dices className="w-8 h-8" /> },
    limbo: { name: 'Limbo', description: 'Set your target and see if you can reach it', icon: <Target className="w-8 h-8" /> },
    slots: { name: 'Slots Deluxe', description: 'Spin the reels for massive jackpots', icon: <CircleDot className="w-8 h-8" /> },
    roulette: { name: 'European Roulette', description: 'Classic casino experience with single zero', icon: <CircleDot className="w-8 h-8" /> },
    blackjack: { name: 'Blackjack Pro', description: 'Beat the dealer in this classic card game', icon: <Spade className="w-8 h-8" /> },
    plinko: { name: 'Plinko', description: 'Drop the ball and watch it bounce to riches', icon: <CircleDot className="w-8 h-8" /> },
    mines: { name: 'Mines', description: 'Navigate the minefield for explosive wins', icon: <Bomb className="w-8 h-8" /> },
    keno: { name: 'Keno', description: 'Pick your lucky numbers and win big', icon: <Ticket className="w-8 h-8" /> },
    wheel: { name: 'Wheel of Fortune', description: 'Spin the wheel for massive multipliers', icon: <Crown className="w-8 h-8" /> }
  };

  // Crash game (fully implemented)
  if (selectedGame === 'crash') {
    return (
      <MainLayout>
        <CrashGame onBack={() => setSelectedGame(null)} />
      </MainLayout>
    );
  }

  // Dice game (fully implemented)
  if (selectedGame === 'dice') {
    return (
      <MainLayout>
        <DiceGame onBack={() => setSelectedGame(null)} />
      </MainLayout>
    );
  }

  // Other games (coming soon)
  if (selectedGame && gameData[selectedGame as keyof typeof gameData]) {
    const game = gameData[selectedGame as keyof typeof gameData];
    return (
      <MainLayout>
        <ComingSoonGame 
          onBack={() => setSelectedGame(null)}
          gameName={game.name}
          gameDescription={game.description}
          icon={game.icon}
        />
      </MainLayout>
    );
  }

  // Main dashboard
  return (
    <MainLayout>
      <div className="min-h-screen">
        <GameDashboard onGameSelect={setSelectedGame} />
      </div>
    </MainLayout>
  );
};

export default Index;
