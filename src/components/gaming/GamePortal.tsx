import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh } from 'three';

interface GamePortalProps {
  position: [number, number, number];
  gameType: string;
  color: string;
  onClick: () => void;
}

export const GamePortal = ({ position, gameType, color, onClick }: GamePortalProps) => {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.7;
    }
  });

  const getPortalName = () => {
    switch (gameType) {
      case 'obby': return 'OBBY\nPARKOUR';
      case 'racing': return 'RACING\nTRACK';
      case 'tycoon': return 'TYCOON\nBUILDER';
      case 'battle': return 'BATTLE\nARENA';
      default: return gameType.toUpperCase();
    }
  };

  return (
    <group position={position} onClick={onClick}>
      {/* Portal Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Portal Center */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1.2, 1.2, 0.05, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.2}
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Portal Particles */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4}
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Game Label */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {getPortalName()}
      </Text>
      
      {/* Hover Glow */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.1}
          transparent 
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};