import { useState } from 'react';
import { GameCard } from './GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Gamepad2, 
  Users, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { MiniGame, GameStats } from '@/types/roblox';

interface LobbyDashboardProps {
  games: MiniGame[];
  playerGameStats: GameStats[];
  onPlayGame: (gameId: string) => void;
  onViewGameStats?: (gameId: string) => void;
}

export const LobbyDashboard = ({ 
  games, 
  playerGameStats, 
  onPlayGame, 
  onViewGameStats 
}: LobbyDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'difficulty'>('popular');

  const categories = [
    { id: 'all', label: 'All Games', count: games.length },
    { id: 'obby', label: 'Obby', count: games.filter(g => g.category === 'obby').length },
    { id: 'racing', label: 'Racing', count: games.filter(g => g.category === 'racing').length },
    { id: 'battle', label: 'Battle', count: games.filter(g => g.category === 'battle').length },
    { id: 'tycoon', label: 'Tycoon', count: games.filter(g => g.category === 'tycoon').length },
    { id: 'puzzle', label: 'Puzzle', count: games.filter(g => g.category === 'puzzle').length },
  ];

  // Filter and sort games
  const filteredGames = games
    .filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.totalPlayers - a.totalPlayers;
        case 'newest':
          return new Date(b.name).getTime() - new Date(a.name).getTime(); // Mock sort by name as proxy for newest
        case 'difficulty':
          const difficultyOrder = { 'Easy': 0, 'Medium': 1, 'Hard': 2, 'Expert': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

  const getGameStats = (gameId: string): GameStats | undefined => {
    return playerGameStats.find(stats => stats.gameId === gameId);
  };

  const totalOnlinePlayers = games.reduce((sum, game) => sum + (game.isActive ? game.totalPlayers : 0), 0);
  const activeGames = games.filter(game => game.isActive).length;

  return (
    <div className="min-h-screen pt-20 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Game Lobby
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Choose your adventure in the Robo Plaza!
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="gaming-border bg-background/90 backdrop-blur-md p-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{games.length}</p>
              <p className="text-sm text-muted-foreground">Total Games</p>
            </div>
            
            <div className="gaming-border bg-background/90 backdrop-blur-md p-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{activeGames}</p>
              <p className="text-sm text-muted-foreground">Active Now</p>
            </div>
            
            <div className="gaming-border bg-background/90 backdrop-blur-md p-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalOnlinePlayers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Players Online</p>
            </div>
            
            <div className="gaming-border bg-background/90 backdrop-blur-md p-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 gaming-border bg-background/90"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "gaming" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`gap-2 ${selectedCategory === category.id ? '' : 'gaming-border'}`}
              >
                {category.label}
                <Badge variant="secondary" className="ml-1 bg-secondary/30">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-center gap-2">
            <span className="text-sm text-muted-foreground self-center">Sort by:</span>
            {[
              { id: 'popular', label: 'Most Popular' },
              { id: 'newest', label: 'Newest' },
              { id: 'difficulty', label: 'Difficulty' }
            ].map((sort) => (
              <Button
                key={sort.id}
                variant={sortBy === sort.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortBy(sort.id as any)}
              >
                {sort.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              gameStats={getGameStats(game.id)}
              onPlay={onPlayGame}
              onViewStats={onViewGameStats}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No games found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};