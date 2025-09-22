import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface PlayerStats {
  id: string;
  name: string;
  wins: number;
  games: string[];
}

interface LeaderboardProps {
  players: PlayerStats[];
}

export const Leaderboard = ({ players }: LeaderboardProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1: return <Medal className="w-5 h-5 text-gray-300" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold">#{rank + 1}</span>;
    }
  };

  return (
    <Card className="gaming-border bg-background/90 backdrop-blur-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-primary animate-glow" />
        <h2 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
          LEADERBOARD
        </h2>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 gaming-border transition-gaming hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {getRankIcon(index)}
              <div>
                <p className="font-semibold text-foreground">{player.name}</p>
                <div className="flex gap-1 flex-wrap">
                  {player.games.map((game) => (
                    <Badge 
                      key={game} 
                      variant="secondary" 
                      className="text-xs bg-secondary/50 text-secondary-foreground"
                    >
                      {game}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{player.wins}</p>
              <p className="text-xs text-muted-foreground">wins</p>
            </div>
          </div>
        ))}
        
        {sortedPlayers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No scores yet!</p>
            <p className="text-sm">Be the first to complete a game!</p>
          </div>
        )}
      </div>
    </Card>
  );
};