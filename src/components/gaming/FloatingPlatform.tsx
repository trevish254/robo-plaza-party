import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface FloatingPlatformProps {
  position: [number, number, number];
  scale: [number, number, number];
}

export const FloatingPlatform = ({ position, scale }: FloatingPlatformProps) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#1a1a2e" 
        emissive="#0066cc" 
        emissiveIntensity={0.1}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
};