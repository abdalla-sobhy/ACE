"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WireframeShapeProps {
  isDark: boolean;
}

function WireframeShape({ isDark }: WireframeShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Smooth rotation
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;

    // Gentle floating motion
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      {/* Octahedron (diamond shape) */}
      <octahedronGeometry args={[1.5, 0]} />
      <meshBasicMaterial
        color={isDark ? "#58a6ff" : "#0969da"}
        wireframe
        transparent
        opacity={isDark ? 0.6 : 0.5}
      />
    </mesh>
  );
}

interface HeroSceneProps {
  isDark?: boolean;
}

export default function HeroScene({ isDark = false }: HeroSceneProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <WireframeShape isDark={isDark} />
      </Canvas>
    </div>
  );
}
