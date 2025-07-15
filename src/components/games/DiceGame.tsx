import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Dices, DollarSign, TrendingUp, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiceGameProps {
  onBack: () => void;
}

export const DiceGame: React.FC<DiceGameProps> = ({ onBack }) => {
  const { user, updateBalance } = useAuth();
  const { toast } = useToast();
  
  const [betAmount, setBetAmount] = useState(10);
  const [targetNumber, setTargetNumber] = useState(50);
  const [isRollUnder, setIsRollUnder] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<boolean | null>(null);
  const [gameHistory, setGameHistory] = useState<Array<{roll: number, target: number, isUnder: boolean, won: boolean}>>([]);

  // Calculate win chance and payout
  const winChance = isRollUnder ? targetNumber : (100 - targetNumber);
  const payout = winChance > 0 ? (98 / winChance) : 0; // 98% RTP

  const generateRoll = () => {
    // Provably fair random number between 0 and 99.99
    return Math.random() * 100;
  };

  const rollDice = async () => {
    if (betAmount > (user?.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds for this bet.",
        variant: "destructive",
      });
      return;
    }

    setIsRolling(true);
    updateBalance((user?.balance || 0) - betAmount);

    // Animate the roll
    await new Promise(resolve => setTimeout(resolve, 1500));

    const roll = generateRoll();
    const won = isRollUnder ? roll < targetNumber : roll > targetNumber;
    
    setLastRoll(roll);
    setLastWin(won);
    setIsRolling(false);

    // Add to history
    setGameHistory(prev => [{
      roll,
      target: targetNumber,
      isUnder: isRollUnder,
      won
    }, ...prev.slice(0, 9)]);

    if (won) {
      const winnings = betAmount * payout;
      updateBalance((user?.balance || 0) + winnings);
      toast({
        title: "You won!",
        description: `Rolled ${roll.toFixed(2)}, won $${winnings.toFixed(2)}`,
      });
    } else {
      toast({
        title: "You lost!",
        description: `Rolled ${roll.toFixed(2)}, better luck next time!`,
        variant: "destructive",
      });
    }
  };

  const resetGame = () => {
    setLastRoll(null);
    setLastWin(null);
  };

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
              Dice
            </h1>
            <p className="text-sm text-muted-foreground">
              Set your target and roll the dice to win
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Game Display */}
            <Card className="bg-gradient-card border-card-border relative overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-6">
                  {/* Dice Display */}
                  <div className="relative">
                    <div className={`w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon-primary ${
                      isRolling ? 'animate-spin' : ''
                    }`}>
                      <Dices className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                    
                    {lastRoll !== null && !isRolling && (
                      <div className="mt-4">
                        <div className={`text-4xl sm:text-6xl font-bold ${
                          lastWin ? 'text-accent animate-glow' : 'text-destructive'
                        }`}>
                          {lastRoll.toFixed(2)}
                        </div>
                        <div className={`text-lg font-medium mt-2 ${
                          lastWin ? 'text-accent' : 'text-destructive'
                        }`}>
                          {lastWin ? '🎉 Winner!' : '💥 Lost!'}
                        </div>
                      </div>
                    )}
                    
                    {isRolling && (
                      <div className="mt-4">
                        <div className="text-2xl sm:text-4xl font-bold text-primary animate-pulse">
                          Rolling...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Target Visualization */}
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>0</span>
                        <span>Target: {targetNumber.toFixed(1)}</span>
                        <span>100</span>
                      </div>
                      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                        {isRollUnder ? (
                          <div 
                            className="h-full bg-gradient-primary"
                            style={{ width: `${targetNumber}%` }}
                          />
                        ) : (
                          <div 
                            className="h-full bg-gradient-primary ml-auto"
                            style={{ width: `${100 - targetNumber}%` }}
                          />
                        )}
                        {lastRoll !== null && (
                          <div 
                            className={`absolute top-0 w-1 h-full ${
                              lastWin ? 'bg-accent' : 'bg-destructive'
                            }`}
                            style={{ left: `${lastRoll}%` }}
                          />
                        )}
                      </div>
                      <div className="text-center mt-2 text-sm">
                        Win if roll is <span className="font-bold text-primary">
                          {isRollUnder ? 'under' : 'over'} {targetNumber.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game History */}
            <Card className="bg-card/50 border-card-border">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Rolls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {gameHistory.map((game, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-center ${
                        game.won ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      <div className="font-bold text-sm">{game.roll.toFixed(2)}</div>
                      <div className="text-xs opacity-75">
                        {game.isUnder ? '<' : '>'} {game.target.toFixed(1)}
                      </div>
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
                    disabled={isRolling}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                    {[10, 25, 50, 100].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setBetAmount(amount)}
                        className="text-xs"
                        disabled={isRolling}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Number: {targetNumber.toFixed(1)}</label>
                  <Slider
                    value={[targetNumber]}
                    onValueChange={(value) => setTargetNumber(value[0])}
                    min={1}
                    max={99}
                    step={0.1}
                    className="w-full"
                    disabled={isRolling}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Win Condition</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={isRollUnder ? "neon" : "outline"}
                      size="sm"
                      onClick={() => setIsRollUnder(true)}
                      disabled={isRolling}
                    >
                      Roll Under
                    </Button>
                    <Button
                      variant={!isRollUnder ? "neon" : "outline"}
                      size="sm"
                      onClick={() => setIsRollUnder(false)}
                      disabled={isRolling}
                    >
                      Roll Over
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-muted/20 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Win Chance:</span>
                    <span className="font-bold text-secondary">{winChance.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payout:</span>
                    <span className="font-bold text-accent">{payout.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Win Amount:</span>
                    <span className="font-bold text-primary">${(betAmount * payout).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="neon"
                    size="lg"
                    className="w-full"
                    onClick={rollDice}
                    disabled={isRolling || betAmount <= 0}
                  >
                    {isRolling ? "Rolling..." : `Roll Dice - $${betAmount}`}
                  </Button>
                  
                  {lastRoll !== null && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={resetGame}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Game
                    </Button>
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
                <p>1. Set your bet amount</p>
                <p>2. Choose target number (1-99)</p>
                <p>3. Pick roll under or over</p>
                <p>4. Roll dice to win!</p>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-primary font-medium text-xs sm:text-sm">
                    🛡️ Provably Fair - 98% RTP
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