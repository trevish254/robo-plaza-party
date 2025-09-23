import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface TycoonGameProps {
  onGameComplete?: () => void;
  onClose?: () => void;
}

export const TycoonGame = ({ onGameComplete, onClose }: TycoonGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    class TycoonScene extends Phaser.Scene {
      private money = 10;
      private moneyPerSecond = 1;
      private buildings: any[] = [];
      private moneyText!: Phaser.GameObjects.Text;
      private incomeText!: Phaser.GameObjects.Text;
      private upgradeButtons: any[] = [];
      private gameWon = false;

      constructor() {
        super({ key: 'TycoonScene' });
      }

      preload() {
        // Create building sprites
        this.add.graphics()
          .fillStyle(0x8b4513)
          .fillRect(0, 0, 80, 100)
          .fillStyle(0x654321)
          .fillRect(10, 80, 60, 20)
          .generateTexture('building1', 80, 100);

        this.add.graphics()
          .fillStyle(0x4169e1)
          .fillRect(0, 0, 100, 120)
          .fillStyle(0x1e90ff)
          .fillRect(10, 100, 80, 20)
          .generateTexture('building2', 100, 120);

        this.add.graphics()
          .fillStyle(0xff6347)
          .fillRect(0, 0, 120, 140)
          .fillStyle(0xff4500)
          .fillRect(10, 120, 100, 20)
          .generateTexture('building3', 120, 140);

        // Money icon
        this.add.graphics()
          .fillStyle(0xffd700)
          .fillCircle(12, 12, 12)
          .fillStyle(0xffa500)
          .fillRect(8, 8, 8, 8)
          .generateTexture('coin', 24, 24);
      }

      create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x87ceeb);
        
        // Ground
        this.add.rectangle(400, 550, 800, 100, 0x228b22);

        // UI
        this.moneyText = this.add.text(16, 16, `Money: $${this.money}`, {
          fontSize: '24px',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: { x: 10, y: 5 }
        });

        this.incomeText = this.add.text(16, 56, `Income: $${this.moneyPerSecond}/sec`, {
          fontSize: '18px',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: { x: 10, y: 5 }
        });

        // Instructions
        this.add.text(400, 20, 'Build your empire! Click buildings to upgrade them. Reach $10,000 to win!', {
          fontSize: '16px',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0);

        // Create initial building plots
        this.createBuildingPlots();

        // Start money generation
        this.time.addEvent({
          delay: 1000,
          callback: this.generateMoney,
          callbackScope: this,
          loop: true
        });

        // Create floating money animation
        this.time.addEvent({
          delay: 500,
          callback: this.spawnFloatingMoney,
          callbackScope: this,
          loop: true
        });
      }

      createBuildingPlots() {
        const positions = [
          { x: 150, y: 450, cost: 50, income: 2, level: 0 },
          { x: 300, y: 450, cost: 200, income: 5, level: 0 },
          { x: 450, y: 450, cost: 500, income: 12, level: 0 },
          { x: 600, y: 450, cost: 1000, income: 25, level: 0 },
          { x: 750, y: 450, cost: 2000, income: 50, level: 0 }
        ];

        positions.forEach((plot, index) => {
          const buildingData = {
            ...plot,
            sprite: null,
            text: null,
            index
          };

          // Create plot base
          const base = this.add.rectangle(plot.x, plot.y + 50, 100, 20, 0x8b4513);
          
          // Create upgrade button/info
          const button = this.add.rectangle(plot.x, plot.y + 80, 90, 30, 0x4169e1)
            .setInteractive()
            .on('pointerdown', () => this.upgradeBuilding(buildingData))
            .on('pointerover', () => button.setFillStyle(0x1e90ff))
            .on('pointerout', () => button.setFillStyle(0x4169e1));

          const text = this.add.text(plot.x, plot.y + 80, `Buy: $${plot.cost}`, {
            fontSize: '12px',
            color: '#ffffff'
          }).setOrigin(0.5);

          buildingData.text = text;
          this.buildings.push(buildingData);
        });
      }

      upgradeBuilding(building: any) {
        if (this.money >= building.cost) {
          this.money -= building.cost;
          this.moneyPerSecond += building.income;
          building.level++;

          // Remove old sprite if exists
          if (building.sprite) {
            building.sprite.destroy();
          }

          // Create new building sprite based on level
          let texture = 'building1';
          if (building.level >= 3) texture = 'building3';
          else if (building.level >= 2) texture = 'building2';

          const positions = [
            { x: 150, y: 450 },
            { x: 300, y: 450 },
            { x: 450, y: 450 },
            { x: 600, y: 450 },
            { x: 750, y: 450 }
          ];

          building.sprite = this.add.image(positions[building.index].x, positions[building.index].y, texture);

          // Update cost and text
          building.cost = Math.floor(building.cost * 1.5);
          building.income = Math.floor(building.income * 1.2);
          
          building.text.setText(`Upgrade: $${building.cost}\nLv.${building.level} (+$${building.income})`);

          this.updateUI();
        }
      }

      generateMoney() {
        this.money += this.moneyPerSecond;
        this.updateUI();

        // Check win condition
        if (this.money >= 10000 && !this.gameWon) {
          this.gameWon = true;
          this.add.text(400, 300, 'EMPIRE BUILT!\nYou are a Tycoon!', {
            fontSize: '48px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
          }).setOrigin(0.5);

          this.time.delayedCall(3000, () => {
            if (onGameComplete) onGameComplete();
          });
        }
      }

      spawnFloatingMoney() {
        if (this.moneyPerSecond > 1) {
          const x = Phaser.Math.Between(100, 700);
          const y = Phaser.Math.Between(400, 500);
          
          const coin = this.add.image(x, y, 'coin');
          coin.setScale(0.5);
          
          this.tweens.add({
            targets: coin,
            y: y - 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => coin.destroy()
          });
        }
      }

      updateUI() {
        this.moneyText.setText(`Money: $${this.money}`);
        this.incomeText.setText(`Income: $${this.moneyPerSecond}/sec`);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: TycoonScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [onGameComplete]);

  return (
    <div className="w-full h-full bg-background rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Money Tycoon</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>
      </div>
      <div ref={gameRef} className="w-full h-[600px] flex items-center justify-center" />
    </div>
  );
};