import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface BattleGameProps {
  onGameComplete?: () => void;
  onClose?: () => void;
}

export const BattleGame = ({ onGameComplete, onClose }: BattleGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    class BattleScene extends Phaser.Scene {
      private player!: Phaser.Physics.Arcade.Sprite;
      private enemies!: Phaser.Physics.Arcade.Group;
      private bullets!: Phaser.Physics.Arcade.Group;
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      private spaceKey!: Phaser.Input.Keyboard.Key;
      private playerHealth = 100;
      private enemiesRemaining = 5;
      private gameWon = false;
      private healthText!: Phaser.GameObjects.Text;
      private enemiesText!: Phaser.GameObjects.Text;
      private lastShot = 0;

      constructor() {
        super({ key: 'BattleScene' });
      }

      preload() {
        // Create player sprite
        this.add.graphics()
          .fillStyle(0x00ff00)
          .fillCircle(16, 16, 16)
          .fillStyle(0x008000)
          .fillRect(8, 8, 16, 16)
          .generateTexture('player', 32, 32);

        // Create enemy sprite
        this.add.graphics()
          .fillStyle(0xff0000)
          .fillCircle(16, 16, 16)
          .fillStyle(0x800000)
          .fillRect(8, 8, 16, 16)
          .generateTexture('enemy', 32, 32);

        // Create bullet sprite
        this.add.graphics()
          .fillStyle(0xffff00)
          .fillCircle(4, 4, 4)
          .generateTexture('bullet', 8, 8);

        // Create arena background
        this.add.graphics()
          .fillStyle(0x333333)
          .fillRect(0, 0, 800, 600)
          .lineStyle(4, 0x666666)
          .strokeRect(20, 20, 760, 560)
          .generateTexture('arena', 800, 600);
      }

      create() {
        // Background
        this.add.image(400, 300, 'arena');

        // Player
        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // Create groups
        this.enemies = this.physics.add.group();
        this.bullets = this.physics.add.group();

        // Spawn enemies
        this.spawnEnemies();

        // Controls
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // UI
        this.healthText = this.add.text(16, 16, `Health: ${this.playerHealth}`, {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        });

        this.enemiesText = this.add.text(16, 46, `Enemies: ${this.enemiesRemaining}`, {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        });

        // Instructions
        this.add.text(400, 20, 'Defeat all enemies! Arrow keys to move, SPACE to shoot!', {
          fontSize: '16px',
          color: '#ffff00',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5, 0);

        // Collisions
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, undefined, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, undefined, this);

        // Enemy shooting
        this.time.addEvent({
          delay: 2000,
          callback: this.enemyShoot,
          callbackScope: this,
          loop: true
        });
      }

      spawnEnemies() {
        const positions = [
          { x: 100, y: 100 },
          { x: 700, y: 100 },
          { x: 100, y: 200 },
          { x: 700, y: 200 },
          { x: 400, y: 150 }
        ];

        positions.forEach(pos => {
          const enemy = this.physics.add.sprite(pos.x, pos.y, 'enemy');
          enemy.setCollideWorldBounds(true);
          enemy.setBounce(1);
          enemy.setVelocity(
            Phaser.Math.Between(-100, 100),
            Phaser.Math.Between(50, 150)
          );
          this.enemies.add(enemy);
        });
      }

      hitEnemy(bullet: any, enemy: any) {
        bullet.destroy();
        enemy.destroy();
        
        this.enemiesRemaining--;
        this.enemiesText.setText(`Enemies: ${this.enemiesRemaining}`);

        // Explosion effect
        const explosion = this.add.circle(enemy.x, enemy.y, 30, 0xffa500, 0.7);
        this.tweens.add({
          targets: explosion,
          scaleX: 2,
          scaleY: 2,
          alpha: 0,
          duration: 300,
          onComplete: () => explosion.destroy()
        });

        if (this.enemiesRemaining <= 0 && !this.gameWon) {
          this.gameWon = true;
          this.add.text(400, 300, 'VICTORY!\nAll enemies defeated!', {
            fontSize: '48px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
          }).setOrigin(0.5);

          this.time.delayedCall(2000, () => {
            if (onGameComplete) onGameComplete();
          });
        }
      }

      hitPlayer(player: any, enemy: any) {
        // Knockback effect
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        player.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);

        this.playerHealth -= 20;
        this.healthText.setText(`Health: ${this.playerHealth}`);

        // Flash effect
        this.tweens.add({
          targets: player,
          alpha: 0.5,
          duration: 100,
          yoyo: true,
          repeat: 3
        });

        if (this.playerHealth <= 0) {
          this.add.text(400, 300, 'GAME OVER\nTry Again!', {
            fontSize: '48px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
          }).setOrigin(0.5);

          this.time.delayedCall(2000, () => {
            if (onClose) onClose();
          });
        }
      }

      enemyShoot() {
        if (this.gameWon) return;

        this.enemies.children.entries.forEach((enemy: any) => {
          if (enemy.active) {
            const bullet = this.physics.add.sprite(enemy.x, enemy.y, 'bullet');
            bullet.setTint(0xff0000);
            
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            bullet.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150);

            // Remove bullet after 3 seconds
            this.time.delayedCall(3000, () => {
              if (bullet.active) bullet.destroy();
            });

            // Check collision with player
            this.physics.add.overlap(bullet, this.player, (bullet: any, player: any) => {
              bullet.destroy();
              this.hitPlayer(player, { x: bullet.x, y: bullet.y });
            });
          }
        });
      }

      shoot() {
        const currentTime = this.time.now;
        if (currentTime - this.lastShot < 250) return; // Rate limit

        this.lastShot = currentTime;

        const bullet = this.physics.add.sprite(this.player.x, this.player.y - 20, 'bullet');
        bullet.setVelocity(0, -400);
        this.bullets.add(bullet);

        // Remove bullet if it goes off screen
        this.time.delayedCall(2000, () => {
          if (bullet.active) bullet.destroy();
        });
      }

      update() {
        if (this.gameWon) return;

        // Player movement
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(200);
        } else {
          this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
          this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
          this.player.setVelocityY(200);
        } else {
          this.player.setVelocityY(0);
        }

        // Shooting
        if (this.spaceKey.isDown) {
          this.shoot();
        }

        // Keep player in bounds
        this.player.x = Phaser.Math.Clamp(this.player.x, 40, 760);
        this.player.y = Phaser.Math.Clamp(this.player.y, 40, 560);
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
      scene: BattleScene,
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
        <h2 className="text-xl font-semibold text-foreground">Battle Arena</h2>
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
