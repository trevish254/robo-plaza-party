import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  User,
  Coins,
  Gamepad2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GamingUIProps {
  currentView: 'lobby' | 'game' | 'shop' | 'stats';
  onViewChange: (view: 'lobby' | 'game' | 'shop' | 'stats') => void;
  playerStats: {
    name: string;
    coins: number;
    wins: number;
    currentGame?: string;
  };
}

export const GamingUI = ({ currentView, onViewChange, playerStats }: GamingUIProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'lobby', icon: Home, label: 'Lobby' },
    { id: 'shop', icon: ShoppingCart, label: 'Shop' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
  ] as const;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Player Info */}
        <Card className="gaming-border bg-background/90 backdrop-blur-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{playerStats.name}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{playerStats.coins}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {playerStats.wins} wins
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Game Badge */}
        {playerStats.currentGame && (
          <Card className="gaming-border bg-background/90 backdrop-blur-md p-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Playing: {playerStats.currentGame}</span>
            </div>
          </Card>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Card className="gaming-border bg-background/90 backdrop-blur-md p-2">
          <div className="flex items-center gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "transition-gaming",
                  currentView === item.id && "gradient-primary text-primary-foreground glow-primary"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Settings Button */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          className="gaming-border bg-background/90 backdrop-blur-md hover:glow-primary transition-gaming"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Game Instructions Overlay */}
      {currentView === 'lobby' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <Card className="gaming-border bg-background/80 backdrop-blur-md p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Welcome to the Gaming Hub!</p>
            <p className="text-xs text-muted-foreground">
              Click on the glowing portals to enter different mini-games
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};