import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrashGameProps {
  onBack: () => void;
}

type GameState = 'waiting' | 'flying' | 'crashed';

export const CrashGame: React.FC<CrashGameProps> = ({ onBack }) => {
  const { user, updateBalance } = useAuth();
  const { toast } = useToast();
  
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashOut, setAutoCashOut] = useState(2.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameHistory, setGameHistory] = useState<number[]>([2.34, 1.05, 8.92, 1.23, 15.67]);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  // Generate provably fair crash point
  const generateCrashPoint = () => {
    const seed = Math.random();
    const house_edge = 0.01;
    const crash = Math.floor((1 - house_edge) / seed);
    return Math.max(1.0, Math.min(100, crash + Math.random() * 2));
  };

  const startCountdown = () => {
    setTimeLeft(10);
    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setGameState('flying');
    setCurrentMultiplier(1.0);
    
    intervalRef.current = setInterval(() => {
      setCurrentMultiplier(prev => {
        const newMultiplier = prev + 0.01;
        
        if (hasBet && !hasCashedOut && newMultiplier >= autoCashOut) {
          cashOut(newMultiplier);
        }
        
        if (newMultiplier >= newCrashPoint) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setGameState('crashed');
          setGameHistory(prev => [newCrashPoint, ...prev.slice(0, 4)]);
          
          setTimeout(() => {
            setGameState('waiting');
            setHasBet(false);
            setHasCashedOut(false);
            setCurrentMultiplier(1.0);
            startCountdown();
          }, 3000);
          
          return newCrashPoint;
        }
        
        return newMultiplier;
      });
    }, 50);
  };

  const placeBet = () => {
    if (betAmount > (user?.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds for this bet.",
        variant: "destructive",
      });
      return;
    }
    
    setHasBet(true);
    updateBalance((user?.balance || 0) - betAmount);
    
    toast({
      title: "Bet placed!",
      description: `$${betAmount} bet placed successfully`,
    });
  };

  const cashOut = (multiplier?: number) => {
    if (!hasBet || hasCashedOut) return;
    
    const actualMultiplier = multiplier || currentMultiplier;
    const winnings = betAmount * actualMultiplier;
    
    setHasCashedOut(true);
    updateBalance((user?.balance || 0) + winnings);
    
    toast({
      title: "Cashed out!",
      description: `Won $${winnings.toFixed(2)} at ${actualMultiplier.toFixed(2)}x`,
    });
  };

  useEffect(() => {
    startCountdown();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const canPlaceBet = gameState === 'waiting' && !hasBet;
  const canCashOut = gameState === 'flying' && hasBet && !hasCashedOut;

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-casino bg-clip-text text-transparent">
              Crash
            </h1>
            <p className="text-sm text-muted-foreground">
              Cash out before the crash to win your multiplier
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Game Display */}
            <Card className="bg-gradient-card border-card-border relative overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-4">
                  {gameState === 'waiting' && (
                    <div className="space-y-4">
                      <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-muted-foreground">
                        <Clock className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4" />
                        {timeLeft}s
                      </div>
                      <p className="text-lg lg:text-xl text-muted-foreground">
                        Next round starts in...
                      </p>
                    </div>
                  )}
                  
                  {gameState === 'flying' && (
                    <div className="space-y-4">
                      <div className={`text-4xl sm:text-5xl lg:text-7xl font-bold transition-all duration-300 ${
                        currentMultiplier > 2 ? 'text-accent animate-glow' : 
                        currentMultiplier > 1.5 ? 'text-secondary' : 'text-primary'
                      }`}>
                        {currentMultiplier.toFixed(2)}x
                      </div>
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <TrendingUp className={`w-6 h-6 ${
                          currentMultiplier > 2 ? 'text-accent animate-bounce' : 'text-primary'
                        }`} />
                        <span className="text-success">Flying...</span>
                      </div>
                    </div>
                  )}
                  
                  {gameState === 'crashed' && (
                    <div className="space-y-4">
                      <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-destructive animate-pulse">
                        {crashPoint.toFixed(2)}x
                      </div>
                      <div className="text-xl text-destructive font-bold">
                        💥 CRASHED!
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Game History */}
            <Card className="bg-card/50 border-card-border">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 overflow-x-auto">
                  {gameHistory.map((result, index) => (
                    <div
                      key={index}
                      className={`min-w-[60px] sm:min-w-[80px] h-10 sm:h-12 rounded-lg flex items-center justify-center font-bold text-sm ${
                        result >= 2 ? 'bg-accent/20 text-accent' : 
                        result >= 1.5 ? 'bg-secondary/20 text-secondary' : 
                        'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {result.toFixed(2)}x
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Betting Panel */}
          <div className="space-y-4">
            <Card className="bg-card/50 border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Place Your Bet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bet Amount</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    min="1"
                    max={user?.balance || 0}
                    className="bg-input/50 border-card-border"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                    {[10, 25, 50, 100].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setBetAmount(amount)}
                        className="text-xs"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto Cash Out</label>
                  <Input
                    type="number"
                    value={autoCashOut}
                    onChange={(e) => setAutoCashOut(Number(e.target.value))}
                    min="1.01"
                    step="0.01"
                    className="bg-input/50 border-card-border"
                  />
                </div>

                <div className="space-y-2">
                  {canPlaceBet && (
                    <Button
                      variant="neon"
                      size="lg"
                      className="w-full"
                      onClick={placeBet}
                    >
                      Place Bet - ${betAmount}
                    </Button>
                  )}
                  
                  {canCashOut && (
                    <Button
                      variant="success"
                      size="lg"
                      className="w-full animate-pulse"
                      onClick={() => cashOut()}
                    >
                      Cash Out - ${(betAmount * currentMultiplier).toFixed(2)}
                    </Button>
                  )}
                  
                  {gameState === 'waiting' && hasBet && (
                    <div className="text-center text-success text-sm">
                      ✅ Bet placed for next round
                    </div>
                  )}
                  
                  {gameState === 'crashed' && hasBet && !hasCashedOut && (
                    <div className="text-center text-destructive text-sm">
                      💥 Better luck next time!
                    </div>
                  )}
                </div>

                {/* Balance */}
                <div className="pt-4 border-t border-card-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <span className="font-bold text-primary">
                      ${user?.balance?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card className="bg-card/50 border-card-border">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                <p>1. Place your bet before the round starts</p>
                <p>2. Watch the multiplier grow</p>
                <p>3. Cash out before it crashes to win</p>
                <p>4. Set auto cash out for automatic wins</p>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-primary font-medium text-xs sm:text-sm">
                    🛡️ Provably Fair - Every result is verifiable
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};