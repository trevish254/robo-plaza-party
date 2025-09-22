import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { GamePortal } from './GamePortal';
import { FloatingPlatform } from './FloatingPlatform';

interface Scene3DProps {
  onPortalClick: (gameType: string) => void;
}

export const Scene3D = ({ onPortalClick }: Scene3DProps) => {
  const gamePortals = [
    { type: 'obby', position: [-4, 2, 0] as [number, number, number], color: '#0099ff' },
    { type: 'racing', position: [4, 2, 0] as [number, number, number], color: '#ff0066' },
    { type: 'tycoon', position: [0, 2, -4] as [number, number, number], color: '#00ff99' },
    { type: 'battle', position: [0, 2, 4] as [number, number, number], color: '#ff6600' },
  ];

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#0099ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6600ff" />
          
          {/* Background */}
          <Stars 
            radius={300} 
            depth={60} 
            count={1000} 
            factor={7} 
            saturation={0.8} 
            fade 
            speed={0.5}
          />
          
          {/* Central Platform */}
          <FloatingPlatform position={[0, 0, 0]} scale={[6, 0.5, 6]} />
          
          {/* Game Portals */}
          {gamePortals.map((portal, index) => (
            <GamePortal
              key={portal.type}
              position={portal.position}
              gameType={portal.type}
              color={portal.color}
              onClick={() => onPortalClick(portal.type)}
            />
          ))}
          
          {/* Controls */}
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={20}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};