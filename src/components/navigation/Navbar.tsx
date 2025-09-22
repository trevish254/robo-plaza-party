import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Trophy, 
  ShoppingBag, 
  User, 
  LogIn,
  Menu,
  X,
  Coins
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'lobby' | 'stats' | 'shop' | 'profile') => void;
  playerCoins?: number;
  playerName?: string;
  isLoggedIn?: boolean;
}

export const Navbar = ({ 
  currentView, 
  onNavigate, 
  playerCoins = 0,
  playerName,
  isLoggedIn = false 
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'lobby', label: 'Lobby', icon: Home },
    { id: 'stats', label: 'Stats', icon: Trophy },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId as 'lobby' | 'stats' | 'shop' | 'profile');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gaming-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">R</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                Robo Plaza
              </h1>
              <p className="text-xs text-muted-foreground">Gaming Hub</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "gaming" : "ghost"}
                  size="sm"
                  onClick={() => handleNavClick(item.id)}
                  className={`gap-2 transition-gaming ${
                    isActive ? 'glow-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Player Info & Auth */}
          <div className="flex items-center gap-3">
            
            {/* Coins Display */}
            {isLoggedIn && (
              <div className="hidden sm:flex items-center gap-2 gaming-border bg-background/90 px-3 py-1 rounded-lg">
                <Coins className="w-4 h-4 text-accent" />
                <span className="font-semibold text-foreground">{playerCoins.toLocaleString()}</span>
              </div>
            )}

            {/* User Profile / Login */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-foreground">{playerName}</p>
                  <Badge variant="secondary" className="text-xs bg-secondary/50">
                    Online
                  </Badge>
                </div>
                <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="gaming-border">
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Log In</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "gaming" : "ghost"}
                    size="sm"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full justify-start gap-3 transition-gaming ${
                      isActive ? 'glow-primary' : ''
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile Coins Display */}
              {isLoggedIn && (
                <div className="flex items-center gap-2 gaming-border bg-background/90 px-3 py-2 rounded-lg">
                  <Coins className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-foreground">{playerCoins.toLocaleString()} Coins</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};