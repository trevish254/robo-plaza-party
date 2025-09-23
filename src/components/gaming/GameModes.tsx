import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Trophy, 
  Timer,
  Zap,
  Building,
  Swords,
  Mountain
} from 'lucide-react';

interface GameModeProps {
  gameType: string;
  onBack: () => void;
  onGameComplete: (gameType: string) => void;
}

export const GameModes = ({ gameType, onBack, onGameComplete }: GameModeProps) => {
  const gameData = {
    obby: {
      title: 'Parkour Obby',
      description: 'Navigate through challenging parkour obstacles and reach the end!',
      icon: Mountain,
      difficulty: 'Medium',
      estimatedTime: '3-5 min',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      features: ['Checkpoints', 'Increasing difficulty', 'Time tracking']
    },
    racing: {
      title: 'Speed Racing',
      description: 'Race around the track and be the first to complete 3 laps!',
      icon: Zap,
      difficulty: 'Easy',
      estimatedTime: '2-3 min',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      features: ['Speed boost pads', '3 lap race', 'Multiplayer ready']
    },
    tycoon: {
      title: 'Money Tycoon',
      description: 'Build your empire! Generate cash and buy upgrades to expand.',
      icon: Building,
      difficulty: 'Easy',
      estimatedTime: '5-10 min',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      features: ['Money generators', 'Upgrade system', 'Endless growth']
    },
    battle: {
      title: 'Battle Arena',
      description: 'Fight other players with swords and blasters in epic PvP combat!',
      icon: Swords,
      difficulty: 'Hard',
      estimatedTime: '2-4 min',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      features: ['PvP combat', 'Multiple weapons', 'Last player standing']
    }
  };

  const game = gameData[gameType as keyof typeof gameData];

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="gaming-border p-8 text-center">
          <p className="text-muted-foreground mb-4">Game mode not found!</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
        </Card>
      </div>
    );
  }

  const IconComponent = game.icon;


  const handleStartGame = () => {
    // Simulate game completion after a short delay
    setTimeout(() => {
      onGameComplete(gameType);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className={`gaming-border ${game.bgColor} p-8 max-w-md w-full`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
            <IconComponent className={`w-8 h-8 text-primary-foreground`} />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            {game.title}
          </h1>
          
          <p className="text-muted-foreground mb-4">
            {game.description}
          </p>
          
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-secondary/50">
              <Timer className="w-3 h-3 mr-1" />
              {game.estimatedTime}
            </Badge>
            <Badge 
              variant="outline" 
              className={`border-current ${
                game.difficulty === 'Easy' ? 'text-green-400 border-green-400' :
                game.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-400' :
                'text-red-400 border-red-400'
              }`}
            >
              {game.difficulty}
            </Badge>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-foreground">Game Features:</h3>
          <ul className="space-y-2">
            {game.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleStartGame}
            className="w-full gradient-primary text-primary-foreground glow-primary transition-gaming"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
          
          <Button 
            onClick={onBack}
            variant="outline"
            className="w-full gaming-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
        </div>

        {/* Game Preview */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 gaming-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Game Preview</span>
            <Trophy className="w-4 h-4 text-accent" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Completion Rate</span>
              <span>Loading...</span>
            </div>
            <Progress value={Math.random() * 100} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
};