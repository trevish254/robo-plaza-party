import { useState } from 'react';
import { Scene3D } from '@/components/gaming/Scene3D';
import { GamingUI } from '@/components/gaming/GamingUI';
import { Leaderboard } from '@/components/gaming/Leaderboard';
import { GameModes } from '@/components/gaming/GameModes';
import { Shop } from '@/components/gaming/Shop';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState<'lobby' | 'game' | 'shop' | 'stats'>('lobby');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState({
    name: 'Player1',
    coins: 250,
    wins: 0,
    currentGame: undefined as string | undefined
  });

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

  const handleGameComplete = (gameType: string) => {
    setPlayerStats(prev => ({
      ...prev,
      wins: prev.wins + 1,
      coins: prev.coins + 50,
      currentGame: undefined
    }));
    
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
    setPlayerStats(prev => ({
      ...prev,
      coins: prev.coins - cost
    }));
  };

  const handleViewChange = (view: 'lobby' | 'game' | 'shop' | 'stats') => {
    if (view === 'lobby') {
      handleBackToLobby();
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Scene */}
      {currentView === 'lobby' && (
        <>
          <Scene3D onPortalClick={handlePortalClick} />
          
          {/* Leaderboard Overlay */}
          <div className="absolute top-4 left-4 z-40 max-w-sm">
            <Leaderboard players={[...leaderboardData, { 
              id: 'player', 
              name: playerStats.name, 
              wins: playerStats.wins, 
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
          playerCoins={playerStats.coins}
          onPurchase={handlePurchase}
        />
      )}

      {/* Stats View */}
      {currentView === 'stats' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              Player Statistics
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              <div className="gaming-border bg-background/90 backdrop-blur-md p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-primary">{playerStats.wins}</h3>
                <p className="text-muted-foreground">Total Wins</p>
              </div>
              <div className="gaming-border bg-background/90 backdrop-blur-md p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-accent">{playerStats.coins}</h3>
                <p className="text-muted-foreground">Coins</p>
              </div>
              <div className="gaming-border bg-background/90 backdrop-blur-md p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-secondary">4</h3>
                <p className="text-muted-foreground">Games Available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gaming UI Overlay */}
      <GamingUI
        currentView={currentView}
        onViewChange={handleViewChange}
        playerStats={playerStats}
      />
    </div>
  );
};

export default Index;
