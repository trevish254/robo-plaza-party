import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface ObbyGameProps {
  onGameComplete?: () => void;
  onClose?: () => void;
}

export const ObbyGame = ({ onGameComplete, onClose }: ObbyGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    class GameScene extends Phaser.Scene {
      private player!: Phaser.Physics.Arcade.Sprite;
      private platforms!: Phaser.Physics.Arcade.StaticGroup;
      private star!: Phaser.Physics.Arcade.Sprite;
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      private gameWon = false;

      constructor() {
        super({ key: 'GameScene' });
      }

      preload() {
        // Create simple colored rectangles as sprites
        this.add.graphics()
          .fillStyle(0x00ff00)
          .fillRect(0, 0, 32, 48)
          .generateTexture('player', 32, 48);

        this.add.graphics()
          .fillStyle(0x8b4513)
          .fillRect(0, 0, 400, 32)
          .generateTexture('ground', 400, 32);

        this.add.graphics()
          .fillStyle(0x6b6b6b)
          .fillRect(0, 0, 200, 16)
          .generateTexture('platform', 200, 16);

        this.add.graphics()
          .fillStyle(0xffff00)
          .fillRect(0, 0, 24, 24)
          .generateTexture('star', 24, 24);
      }

      create() {
        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        
        // Ground
        this.platforms.create(400, 584, 'ground').setScale(2, 1);
        
        // Platforms
        this.platforms.create(600, 450, 'platform');
        this.platforms.create(50, 350, 'platform');
        this.platforms.create(750, 320, 'platform');
        this.platforms.create(300, 220, 'platform');
        this.platforms.create(650, 150, 'platform');

        // Player
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Star (goal)
        this.star = this.physics.add.sprite(680, 100, 'star');
        this.star.setBounce(0.3);

        // Physics
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.star, this.platforms);
        this.physics.add.overlap(this.player, this.star, this.collectStar, undefined, this);

        // Controls
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Instructions
        this.add.text(16, 16, 'Use arrow keys to move and jump!\nCollect the yellow star to win!', {
          fontSize: '16px',
          color: '#000'
        });
      }

      collectStar() {
        if (this.gameWon) return;
        
        this.star.disableBody(true, true);
        this.gameWon = true;

        // Victory message
        const victoryText = this.add.text(400, 300, 'YOU WIN!', {
          fontSize: '64px',
          color: '#00ff00',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        // Call completion callback after a delay
        this.time.delayedCall(2000, () => {
          if (onGameComplete) onGameComplete();
        });
      }

      update() {
        if (this.gameWon) return;

        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(160);
        } else {
          this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body!.touching.down) {
          this.player.setVelocityY(-500);
        }
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
          gravity: { x: 0, y: 300 },
          debug: false
        }
      },
      scene: GameScene,
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
        <h2 className="text-xl font-semibold text-foreground">Obby Challenge</h2>
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