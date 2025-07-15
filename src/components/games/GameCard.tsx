import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Play } from 'lucide-react';

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rtp: number;
  players: number;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  name,
  description,
  icon,
  rtp,
  players,
  category,
  isHot = false,
  isNew = false,
  onClick
}) => {
  return (
    <Card className="group bg-card/50 backdrop-blur-sm border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-glass hover:scale-[1.02] cursor-pointer">
      <CardContent className="p-3 sm:p-4">
        <div className="relative mb-3 sm:mb-4">
          {/* Game icon/thumbnail */}
          <div className="w-full h-24 sm:h-32 bg-gradient-card rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="text-2xl sm:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            
            {/* Status badges */}
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1">
              {isNew && (
                <Badge className="bg-accent text-accent-foreground text-xs">
                  NEW
                </Badge>
              )}
              {isHot && (
                <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse">
                  🔥 HOT
                </Badge>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce-subtle" />
            </div>
          </div>

          {/* Game info */}
          <div className="space-y-2 sm:space-y-3">
            <div>
              <h3 className="font-bold text-sm sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="w-3 h-3" />
                <span>{rtp}% RTP</span>
              </div>
              <div className="flex items-center gap-1 text-secondary">
                <Users className="w-3 h-3" />
                <span>{players.toLocaleString()}</span>
              </div>
            </div>

            {/* Category badge */}
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
        </div>

        {/* Play button */}
        <Button 
          variant="neon" 
          className="w-full group-hover:shadow-neon-primary"
          onClick={onClick}
        >
          <Play className="w-4 h-4 mr-2" />
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
};