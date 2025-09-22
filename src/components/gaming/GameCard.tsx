import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Users, 
  Clock, 
  Trophy, 
  Timer,
  Target
} from 'lucide-react';
import { MiniGame, GameStats } from '@/types/roblox';

interface GameCardProps {
  game: MiniGame;
  gameStats?: GameStats;
  onPlay: (gameId: string) => void;
  onViewStats?: (gameId: string) => void;
}

export const GameCard = ({ game, gameStats, onPlay, onViewStats }: GameCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'Hard': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'Expert': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-muted-foreground border-muted/30 bg-muted/10';
    }
  };

  const getCategoryIcon = () => {
    switch (game.category) {
      case 'obby': return Target;
      case 'racing': return Timer;
      case 'battle': return Trophy;
      case 'tycoon': return Users;
      default: return Play;
    }
  };

  const CategoryIcon = getCategoryIcon();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="gaming-border bg-background/90 backdrop-blur-md p-6 hover:glow-primary transition-gaming group">
      
      {/* Thumbnail */}
      <div className="relative mb-4 rounded-lg overflow-hidden bg-muted/30 aspect-video">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Online Status */}
        <div className="absolute top-2 right-2">
          {game.isActive ? (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30">
              Live
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
              Offline
            </Badge>
          )}
        </div>

        {/* Category Icon */}
        <div className="absolute top-2 left-2">
          <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center">
            <CategoryIcon className="w-4 h-4 text-secondary-foreground" />
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-foreground group-hover:gradient-primary group-hover:bg-clip-text group-hover:text-transparent transition-gaming">
            {game.name}
          </h3>
          <Badge 
            variant="outline" 
            className={getDifficultyColor(game.difficulty)}
          >
            {game.difficulty}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {game.description}
        </p>

        {/* Game Meta Info */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{game.totalPlayers.toLocaleString()} players</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>~{formatTime(game.averagePlayTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>Max {game.maxPlayers}</span>
          </div>
        </div>

        {/* Player Stats */}
        {gameStats && (
          <div className="gaming-border bg-muted/20 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Your Stats</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <p className="text-primary font-bold">{gameStats.wins}</p>
                <p className="text-muted-foreground">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-accent font-bold">{gameStats.totalPlays}</p>
                <p className="text-muted-foreground">Plays</p>
              </div>
              <div className="text-center">
                <p className="text-secondary font-bold">{Math.round(gameStats.winRate)}%</p>
                <p className="text-muted-foreground">Win Rate</p>
              </div>
            </div>
            
            {gameStats.bestTime && (
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Best Time: <span className="text-accent font-semibold">{formatTime(gameStats.bestTime)}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => onPlay(game.id)}
          disabled={!game.isActive}
          variant="gaming"
          className="flex-1 gap-2"
        >
          <Play className="w-4 h-4" />
          {game.isActive ? 'Play Now' : 'Offline'}
        </Button>
        
        {onViewStats && gameStats && (
          <Button
            onClick={() => onViewStats(game.id)}
            variant="outline"
            size="sm"
            className="gaming-border"
          >
            <Trophy className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};