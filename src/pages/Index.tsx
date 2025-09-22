import { useState, useEffect } from 'react';
import { Scene3D } from '@/components/gaming/Scene3D';
import { GamingUI } from '@/components/gaming/GamingUI';
import { Leaderboard } from '@/components/gaming/Leaderboard';
import { GameModes } from '@/components/gaming/GameModes';
import { Shop } from '@/components/gaming/Shop';
import { Navbar } from '@/components/navigation/Navbar';
import { LobbyDashboard } from '@/components/gaming/LobbyDashboard';
import { StatsPage } from '@/components/gaming/StatsPage';
import { toast } from '@/hooks/use-toast';
import { 
  getPlayerStats, 
  getPlayerGameStats, 
  getGameList, 
  getPlayerAchievements,
  teleportToGame,
  mockData 
} from '@/services/robloxApi';
import { PlayerStats, GameStats, MiniGame, Achievement } from '@/types/roblox';

const Index = () => {
  const [currentView, setCurrentView] = useState<'lobby' | 'game' | 'shop' | 'stats' | 'profile'>('lobby');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Roblox data
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [availableGames, setAvailableGames] = useState<MiniGame[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Legacy player stats for compatibility
  const [legacyPlayerStats, setLegacyPlayerStats] = useState({
    name: 'Player1',
    coins: 250,
    wins: 0,
    currentGame: undefined as string | undefined
  });

  // Load data on component mount
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    setIsLoading(true);
    try {
      // For development, use mock data directly
      // In production, these would be actual API calls
      setPlayerStats(mockData.playerStats);
      setAvailableGames(mockData.games);
      setAchievements(mockData.achievements);
      
      // Mock game stats
      const mockGameStats: GameStats[] = [
        {
          gameId: "obby-1",
          gameName: "Mega Obby Challenge",
          wins: 12,
          losses: 8,
          bestTime: 720,
          totalPlays: 20,
          winRate: 60,
          lastPlayed: "2023-12-15"
        },
        {
          gameId: "race-1", 
          gameName: "Neon Speed Circuit",
          wins: 15,
          losses: 5,
          bestTime: 145,
          totalPlays: 20,
          winRate: 75,
          lastPlayed: "2023-12-20"
        }
      ];
      setGameStats(mockGameStats);
      setIsLoggedIn(true);
      
    } catch (error) {
      console.error('Failed to load game data:', error);
      toast({
        title: "Error",
        description: "Failed to load game data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock leaderboard data
  const [leaderboardData] = useState([
    { id: '1', name: 'GamerPro', wins: 15, games: ['obby', 'racing', 'battle'] },
    { id: '2', name: 'SpeedRunner', wins: 12, games: ['racing', 'obby'] },
    { id: '3', name: 'BuilderKing', wins: 8, games: ['tycoon', 'battle'] },
    { id: '4', name: 'FightClub', wins: 6, games: ['battle'] },
    { id: '5', name: 'Parkour_Master', wins: 4, games: ['obby'] }
  ]);

  const handlePortalClick = (gameType: string) => {
    setSelectedGame(gameType);
    setCurrentView('game');
    setPlayerStats(prev => ({ ...prev, currentGame: gameType }));
    
    toast({
      title: `Entering ${gameType.charAt(0).toUpperCase() + gameType.slice(1)}!`,
      description: 'Good luck and have fun!',
    });
  };

  const handlePlayGame = async (gameId: string) => {
    const game = availableGames.find(g => g.id === gameId);
    if (!game) return;

    if (!game.isActive) {
      toast({
        title: "Game Offline",
        description: "This game is currently offline. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In production, this would teleport the player to the Roblox game
      if (game.placeId) {
        await teleportToGame({
          placeId: game.placeId,
          userId: playerStats?.userId || "guest"
        });
      }
      
      // For demo purposes, show the game mode
      setSelectedGame(gameId);
      setCurrentView('game');
      
      toast({
        title: `Entering ${game.name}!`,
        description: 'Good luck and have fun!',
      });
    } catch (error) {
      toast({
        title: "Teleport Failed",
        description: "Unable to join the game. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGameComplete = (gameType: string) => {
    // Update legacy stats for compatibility
    setLegacyPlayerStats(prev => ({
      ...prev,
      wins: prev.wins + 1,
      coins: prev.coins + 50,
      currentGame: undefined
    }));
    
    // Update player stats
    if (playerStats) {
      setPlayerStats(prev => prev ? ({
        ...prev,
        totalWins: prev.totalWins + 1,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        coins: prev.coins + 50,
        experience: prev.experience + 100
      }) : null);
    }
    
    setCurrentView('lobby');
    setSelectedGame(null);
    
    toast({
      title: 'Congratulations!',
      description: `You completed ${gameType}! +1 Win, +50 Coins`,
    });
  };

  const handleBackToLobby = () => {
    setCurrentView('lobby');
    setSelectedGame(null);
    setPlayerStats(prev => ({ ...prev, currentGame: undefined }));
  };

  const handlePurchase = (itemId: string, cost: number) => {
    // Update legacy stats
    setLegacyPlayerStats(prev => ({
      ...prev,
      coins: prev.coins - cost
    }));
    
    // Update player stats
    if (playerStats) {
      setPlayerStats(prev => prev ? ({
        ...prev,
        coins: prev.coins - cost
      }) : null);
    }
  };

  const handleViewChange = (view: 'lobby' | 'game' | 'shop' | 'stats' | 'profile') => {
    if (view === 'lobby') {
      handleBackToLobby();
    } else {
      setCurrentView(view);
    }
  };

  const handleNavigation = (view: 'lobby' | 'stats' | 'shop' | 'profile') => {
    setCurrentView(view);
    setSelectedGame(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary animate-pulse"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Robo Plaza...</h2>
          <p className="text-muted-foreground">Connecting to the gaming hub</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigation}
        playerCoins={playerStats?.coins || legacyPlayerStats.coins}
        playerName={playerStats?.displayName || legacyPlayerStats.name}
        isLoggedIn={isLoggedIn}
      />

      {/* Lobby Dashboard */}
      {currentView === 'lobby' && (
        <>
          <LobbyDashboard
            games={availableGames}
            playerGameStats={gameStats}
            onPlayGame={handlePlayGame}
            onViewGameStats={(gameId) => {
              console.log('View stats for game:', gameId);
              // Could open a modal or navigate to detailed stats
            }}
          />
          
          {/* 3D Scene Background (optional overlay) */}
          <div className="fixed inset-0 -z-10 opacity-20">
            <Scene3D onPortalClick={handlePortalClick} />
          </div>
          
          {/* Floating Leaderboard */}
          <div className="fixed bottom-4 right-4 z-40 max-w-sm">
            <Leaderboard players={[...leaderboardData, { 
              id: 'player', 
              name: playerStats?.displayName || legacyPlayerStats.name, 
              wins: playerStats?.totalWins || legacyPlayerStats.wins, 
              games: [] 
            }]} />
          </div>
        </>
      )}

      {/* Game Mode View */}
      {currentView === 'game' && selectedGame && (
        <GameModes
          gameType={selectedGame}
          onBack={handleBackToLobby}
          onGameComplete={handleGameComplete}
        />
      )}

      {/* Shop View */}
      {currentView === 'shop' && (
        <Shop
          playerCoins={playerStats?.coins || legacyPlayerStats.coins}
          onPurchase={handlePurchase}
        />
      )}

      {/* Stats View */}
      {currentView === 'stats' && playerStats && (
        <StatsPage
          playerStats={playerStats}
          gameStats={gameStats}
          achievements={achievements}
        />
      )}

      {/* Profile View */}
      {currentView === 'profile' && (
        <div className="min-h-screen pt-20 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              Player Profile
            </h1>
            <p className="text-muted-foreground mb-6">
              Profile management coming soon! This will include avatar customization, 
              friend lists, and account settings.
            </p>
            <div className="gaming-border bg-background/90 backdrop-blur-md p-6 rounded-lg">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {playerStats?.displayName.charAt(0) || 'P'}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {playerStats?.displayName || 'Player'}
              </h3>
              <p className="text-sm text-muted-foreground">
                @{playerStats?.username || 'username'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Gaming UI Overlay - shown only in game mode */}
      {currentView === 'game' && (
        <GamingUI
          currentView={currentView}
          onViewChange={handleViewChange}
          playerStats={legacyPlayerStats}
        />
      )}
    </div>
  );
};

export default Index;
