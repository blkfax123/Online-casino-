import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction, Zap, Star, Clock } from 'lucide-react';

interface ComingSoonGameProps {
  onBack: () => void;
  gameName: string;
  gameDescription: string;
  icon: React.ReactNode;
}

export const ComingSoonGame: React.FC<ComingSoonGameProps> = ({ 
  onBack, 
  gameName, 
  gameDescription, 
  icon 
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-casino bg-clip-text text-transparent">
            {gameName}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {gameDescription}
          </p>
        </div>
      </div>

      {/* Coming Soon Display */}
      <Card className="bg-gradient-card border-card-border relative overflow-hidden">
        <CardContent className="p-8 sm:p-12">
          <div className="text-center space-y-6">
            {/* Game Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-casino rounded-2xl flex items-center justify-center mx-auto animate-float">
              <div className="text-3xl sm:text-4xl text-white">
                {icon}
              </div>
            </div>

            {/* Coming Soon Message */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                Coming Soon
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                We're working hard to bring you the best {gameName.toLowerCase()} experience. 
                This game will feature provably fair algorithms and exciting gameplay!
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6">
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
                <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Instant Play</p>
              </div>
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
                <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">Provably Fair</p>
              </div>
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-sm font-medium">24/7 Available</p>
              </div>
            </div>
          </div>
          
          {/* Animated background */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
          </div>
        </CardContent>
      </Card>

      {/* Subscribe for Updates */}
      <Card className="bg-card/50 border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Construction className="w-5 h-5 text-primary" />
            Development Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Game mechanics in development</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span>UI/UX design in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span>Testing and optimization pending</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-card-border">
            <p className="text-sm text-muted-foreground text-center">
              🚀 Want to be notified when this game launches? Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Back to Games */}
      <div className="text-center">
        <Button 
          variant="neon" 
          size="lg"
          onClick={onBack}
          className="px-8"
        >
          Back to Game Lobby
        </Button>
      </div>
    </div>
  );
};