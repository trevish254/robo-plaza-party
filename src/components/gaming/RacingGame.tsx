import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface RacingGameProps {
  onGameComplete?: () => void;
  onClose?: () => void;
}

export const RacingGame = ({ onGameComplete, onClose }: RacingGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    class RaceScene extends Phaser.Scene {
      private player!: Phaser.Physics.Arcade.Sprite;
      private track!: Phaser.GameObjects.Graphics;
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      private speed = 0;
      private maxSpeed = 300;
      private acceleration = 5;
      private friction = 2;
      private lapCount = 0;
      private gameWon = false;
      private lapText!: Phaser.GameObjects.Text;
      private speedText!: Phaser.GameObjects.Text;
      private checkpoints: boolean[] = [false, false, false, false];
      private boostPads!: Phaser.Physics.Arcade.Group;

      constructor() {
        super({ key: 'RaceScene' });
      }

      preload() {
        // Create simple colored shapes
        this.add.graphics()
          .fillStyle(0xff0000)
          .fillRect(0, 0, 24, 16)
          .generateTexture('car', 24, 16);

        this.add.graphics()
          .fillStyle(0x00ffff)
          .fillRect(0, 0, 40, 20)
          .generateTexture('boost', 40, 20);
      }

      create() {
        // Draw track
        this.track = this.add.graphics();
        this.drawTrack();

        // Create player car
        this.player = this.physics.add.sprite(400, 500, 'car');
        this.player.setCollideWorldBounds(true);
        this.player.setAngle(270); // Face up initially

        // Create boost pads
        this.boostPads = this.physics.add.group();
        this.createBoostPads();

        // Controls
        this.cursors = this.input.keyboard!.createCursorKeys();

        // UI
        this.lapText = this.add.text(16, 16, 'Lap: 0/3', {
          fontSize: '20px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2
        });

        this.speedText = this.add.text(16, 46, 'Speed: 0', {
          fontSize: '16px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2
        });

        // Instructions
        this.add.text(400, 20, 'Complete 3 laps! Use arrow keys to drive, hit boost pads for speed!', {
          fontSize: '14px',
          color: '#ffff00',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5, 0);

        // Physics overlap for boost pads
        this.physics.add.overlap(this.player, this.boostPads, this.hitBoost, undefined, this);
      }

      drawTrack() {
        // Draw oval track
        this.track.lineStyle(20, 0x404040);
        this.track.strokeEllipse(400, 300, 600, 400);
        
        // Inner track boundary
        this.track.lineStyle(4, 0x808080);
        this.track.strokeEllipse(400, 300, 400, 250);
        
        // Start/finish line
        this.track.lineStyle(4, 0xffffff);
        this.track.lineBetween(390, 90, 410, 90);
        
        // Checkpoint markers
        this.track.fillStyle(0xffff00);
        this.track.fillCircle(700, 300, 8); // Right checkpoint
        this.track.fillCircle(400, 510, 8); // Bottom checkpoint
        this.track.fillCircle(100, 300, 8); // Left checkpoint
      }

      createBoostPads() {
        const positions = [
          { x: 600, y: 200 },
          { x: 600, y: 400 },
          { x: 200, y: 200 },
          { x: 200, y: 400 }
        ];

        positions.forEach(pos => {
          const boost = this.physics.add.sprite(pos.x, pos.y, 'boost');
          boost.setTint(0x00ffff);
          this.boostPads.add(boost);
        });
      }

      hitBoost(player: any, boost: any) {
        // Temporary speed boost
        this.speed = Math.min(this.speed + 100, this.maxSpeed + 100);
        
        // Visual effect
        boost.setTint(0xffffff);
        this.time.delayedCall(500, () => {
          boost.setTint(0x00ffff);
        });
      }

      checkLapProgress() {
        const x = this.player.x;
        const y = this.player.y;

        // Check checkpoint positions (roughly)
        if (x > 650 && y > 250 && y < 350 && !this.checkpoints[0]) {
          this.checkpoints[0] = true;
        } else if (y > 450 && x > 350 && x < 450 && this.checkpoints[0] && !this.checkpoints[1]) {
          this.checkpoints[1] = true;
        } else if (x < 150 && y > 250 && y < 350 && this.checkpoints[1] && !this.checkpoints[2]) {
          this.checkpoints[2] = true;
        } else if (y < 150 && x > 350 && x < 450 && this.checkpoints[2] && !this.checkpoints[3]) {
          this.checkpoints[3] = true;
        }

        // Check if completed a lap (back to start line)
        if (y < 150 && x > 350 && x < 450 && this.checkpoints[3]) {
          this.lapCount++;
          this.checkpoints = [false, false, false, false];
          this.lapText.setText(`Lap: ${this.lapCount}/3`);

          if (this.lapCount >= 3 && !this.gameWon) {
            this.gameWon = true;
            this.add.text(400, 300, 'RACE WON!', {
              fontSize: '48px',
              color: '#00ff00',
              stroke: '#000000',
              strokeThickness: 4
            }).setOrigin(0.5);

            this.time.delayedCall(2000, () => {
              if (onGameComplete) onGameComplete();
            });
          }
        }
      }

      update() {
        if (this.gameWon) return;

        // Apply friction
        this.speed = Math.max(0, this.speed - this.friction);

        // Handle input
        if (this.cursors.up.isDown) {
          this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        }
        if (this.cursors.down.isDown) {
          this.speed = Math.max(this.speed - this.acceleration * 2, -this.maxSpeed * 0.5);
        }

        // Steering (only when moving)
        if (this.speed > 10) {
          if (this.cursors.left.isDown) {
            this.player.angle -= 3;
          }
          if (this.cursors.right.isDown) {
            this.player.angle += 3;
          }
        }

        // Move player
        if (this.speed > 0) {
          const angleRad = Phaser.Math.DegToRad(this.player.angle);
          this.player.setVelocity(
            Math.cos(angleRad) * this.speed,
            Math.sin(angleRad) * this.speed
          );
        } else {
          this.player.setVelocity(0, 0);
        }

        // Update UI
        this.speedText.setText(`Speed: ${Math.round(this.speed)}`);

        // Check lap progress
        this.checkLapProgress();
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
      scene: RaceScene,
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
        <h2 className="text-xl font-semibold text-foreground">Speed Racing</h2>
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