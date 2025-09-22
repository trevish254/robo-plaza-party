import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Coins, 
  Palette, 
  Crown, 
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cosmetic' | 'boost' | 'special';
  icon: any;
  color: string;
  owned: boolean;
}

interface ShopProps {
  playerCoins: number;
  onPurchase: (itemId: string, cost: number) => void;
}

export const Shop = ({ playerCoins, onPurchase }: ShopProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cosmetic' | 'boost' | 'special'>('all');

  const shopItems: ShopItem[] = [
    {
      id: 'neon-trail',
      name: 'Neon Trail',
      description: 'Leave a glowing neon trail behind you',
      price: 100,
      category: 'cosmetic',
      icon: Sparkles,
      color: 'text-blue-400',
      owned: false
    },
    {
      id: 'speed-boost',
      name: 'Speed Boost',
      description: 'Move 25% faster for 5 minutes',
      price: 50,
      category: 'boost',
      icon: Zap,
      color: 'text-yellow-400',
      owned: false
    },
    {
      id: 'golden-crown',
      name: 'Golden Crown',
      description: 'Show off your royal status',
      price: 500,
      category: 'cosmetic',
      icon: Crown,
      color: 'text-yellow-500',
      owned: false
    },
    {
      id: 'shield-boost',
      name: 'Protection Shield',
      description: 'Take 50% less damage for 3 minutes',
      price: 150,
      category: 'boost',
      icon: Shield,
      color: 'text-green-400',
      owned: false
    },
    {
      id: 'rainbow-aura',
      name: 'Rainbow Aura',
      description: 'Surround yourself with rainbow colors',
      price: 300,
      category: 'special',
      icon: Palette,
      color: 'text-purple-400',
      owned: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'cosmetic', label: 'Cosmetics' },
    { id: 'boost', label: 'Boosts' },
    { id: 'special', label: 'Special' }
  ] as const;

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: ShopItem) => {
    if (item.owned) {
      toast({
        title: "Already Owned",
        description: "You already own this item!",
        variant: "default"
      });
      return;
    }

    if (playerCoins < item.price) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${item.price - playerCoins} more coins!`,
        variant: "destructive"
      });
      return;
    }

    onPurchase(item.id, item.price);
    item.owned = true;
    
    toast({
      title: "Purchase Successful!",
      description: `You bought ${item.name}!`,
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Gaming Shop
          </h1>
          <p className="text-muted-foreground mb-4">
            Upgrade your gaming experience with awesome items!
          </p>
          
          <Card className="gaming-border bg-background/90 backdrop-blur-md p-4 inline-block">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-accent" />
              <span className="font-semibold">{playerCoins} Coins</span>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "gradient-primary text-primary-foreground" : "gaming-border"}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <Card key={item.id} className="gaming-border bg-background/90 backdrop-blur-md p-6 hover:glow-primary transition-gaming">
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full gradient-secondary mb-3`}>
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-secondary/50">
                      {item.category}
                    </Badge>
                    {item.owned && (
                      <Badge variant="outline" className="border-green-400 text-green-400">
                        Owned
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-accent" />
                    <span className="font-semibold">{item.price}</span>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={item.owned || playerCoins < item.price}
                    size="sm"
                    className={item.owned ? "bg-muted text-muted-foreground" : "gradient-accent text-accent-foreground"}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {item.owned ? 'Owned' : 'Buy'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No items in this category yet!</p>
          </div>
        )}
      </div>
    </div>
  );
};