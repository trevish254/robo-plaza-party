import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Gamepad2, 
  Clock, 
  Target, 
  TrendingUp,
  Award,
  Star,
  Zap,
  Crown,
  Medal
} from 'lucide-react';
import { PlayerStats, GameStats, Achievement } from '@/types/roblox';

interface StatsPageProps {
  playerStats: PlayerStats;
  gameStats: GameStats[];
  achievements: Achievement[];
}

export const StatsPage = ({ playerStats, gameStats, achievements }: StatsPageProps) => {
  
  const totalWinRate = playerStats.totalGamesPlayed > 0 
    ? Math.round((playerStats.totalWins / playerStats.totalGamesPlayed) * 100)
    : 0;

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const achievementProgress = achievements.length > 0 
    ? Math.round((unlockedAchievements.length / achievements.length) * 100)
    : 0;

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'wins': return Trophy;
      case 'speed': return Zap;
      case 'skill': return Target;
      case 'social': return Award;
      case 'rare': return Crown;
      default: return Medal;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400 border-gray-400/30';
      case 'rare': return 'text-blue-400 border-blue-400/30';
      case 'epic': return 'text-purple-400 border-purple-400/30';
      case 'legendary': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-muted-foreground border-muted/30';
    }
  };

  const formatPlayTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const calculateLevel = (experience: number): { level: number; progress: number; nextLevelXP: number } => {
    // Simple level calculation (1000 XP per level)
    const level = Math.floor(experience / 1000) + 1;
    const currentLevelXP = experience % 1000;
    const nextLevelXP = 1000;
    const progress = (currentLevelXP / nextLevelXP) * 100;
    
    return { level, progress, nextLevelXP };
  };

  const levelInfo = calculateLevel(playerStats.experience);

  return (
    <div className="min-h-screen pt-20 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {playerStats.displayName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                {playerStats.displayName}
              </h1>
              <p className="text-muted-foreground">@{playerStats.username}</p>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Level {levelInfo.level}</span>
              <span className="text-sm text-muted-foreground">
                {playerStats.experience % 1000}/{levelInfo.nextLevelXP} XP
              </span>
            </div>
            <Progress value={levelInfo.progress} className="h-2" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="gaming-border bg-background/90 backdrop-blur-md p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary animate-glow" />
            <p className="text-2xl font-bold text-foreground">{playerStats.totalWins}</p>
            <p className="text-sm text-muted-foreground">Total Wins</p>
          </Card>
          
          <Card className="gaming-border bg-background/90 backdrop-blur-md p-4 text-center">
            <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold text-foreground">{playerStats.totalGamesPlayed}</p>
            <p className="text-sm text-muted-foreground">Games Played</p>
          </Card>
          
          <Card className="gaming-border bg-background/90 backdrop-blur-md p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold text-foreground">{totalWinRate}%</p>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </Card>
          
          <Card className="gaming-border bg-background/90 backdrop-blur-md p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{levelInfo.level}</p>
            <p className="text-sm text-muted-foreground">Player Level</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Game Statistics */}
          <div>
            <h2 className="text-2xl font-bold mb-4 gradient-primary bg-clip-text text-transparent flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              Game Statistics
            </h2>
            
            <div className="space-y-4">
              {gameStats.map((stats) => (
                <Card key={stats.gameId} className="gaming-border bg-background/90 backdrop-blur-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{stats.gameName}</h3>
                    <Badge variant="secondary" className="bg-secondary/50">
                      {stats.totalPlays} plays
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xl font-bold text-primary">{stats.wins}</p>
                      <p className="text-muted-foreground">Wins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-destructive">{stats.losses}</p>
                      <p className="text-muted-foreground">Losses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-accent">{Math.round(stats.winRate)}%</p>
                      <p className="text-muted-foreground">Win Rate</p>
                    </div>
                  </div>
                  
                  {stats.bestTime && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">Best Time:</span>
                        <span className="font-semibold text-accent">
                          {formatPlayTime(stats.bestTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              
              {gameStats.length === 0 && (
                <Card className="gaming-border bg-background/90 backdrop-blur-md p-8 text-center">
                  <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No game statistics yet!</p>
                  <p className="text-sm text-muted-foreground">Play some games to see your stats here.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Achievements
              </h2>
              <Badge variant="outline" className="gaming-border">
                {unlockedAchievements.length}/{achievements.length}
              </Badge>
            </div>
            
            {/* Achievement Progress */}
            <Card className="gaming-border bg-background/90 backdrop-blur-md p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Achievement Progress</span>
                <span className="text-sm text-muted-foreground">{achievementProgress}%</span>
              </div>
              <Progress value={achievementProgress} className="h-2" />
            </Card>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {achievements.map((achievement) => {
                const IconComponent = getAchievementIcon(achievement.category);
                const progress = (achievement.progress / achievement.maxProgress) * 100;
                
                return (
                  <Card 
                    key={achievement.id} 
                    className={`gaming-border bg-background/90 backdrop-blur-md p-4 transition-gaming ${
                      achievement.isUnlocked ? 'glow-accent' : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.isUnlocked ? 'gradient-accent' : 'bg-muted/30'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          achievement.isUnlocked ? 'text-accent-foreground' : 'text-muted-foreground'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            achievement.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.name}
                          </h3>
                          {achievement.isUnlocked && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        
                        {!achievement.isUnlocked && (
                          <div className="mb-2">
                            <Progress value={progress} className="h-1" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.progress}/{achievement.maxProgress}
                            </p>
                          </div>
                        )}
                        
                        {achievement.reward && (
                          <div className="flex items-center gap-1 text-xs text-accent">
                            <Star className="w-3 h-3" />
                            <span>
                              {achievement.reward.type === 'coins' && `+${achievement.reward.amount} coins`}
                              {achievement.reward.type === 'cosmetic' && 'Cosmetic reward'}
                              {achievement.reward.type === 'badge' && 'Special badge'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {achievements.length === 0 && (
              <Card className="gaming-border bg-background/90 backdrop-blur-md p-8 text-center">
                <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No achievements available yet!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};