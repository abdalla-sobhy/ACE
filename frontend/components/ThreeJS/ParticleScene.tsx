"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  isDark: boolean;
}

function ParticleField({ isDark }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  // Create particle geometry
  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Create a sphere of particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Sphere distribution
      const radius = 2 + Math.random() * 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Holographic/colorful gradient
      const colorAngle = (theta / (Math.PI * 2)) + (phi / Math.PI);
      colors[i3] = Math.sin(colorAngle * 2) * 0.5 + 0.5; // R
      colors[i3 + 1] = Math.sin(colorAngle * 2 + 2) * 0.5 + 0.5; // G
      colors[i3 + 2] = Math.sin(colorAngle * 2 + 4) * 0.5 + 0.5; // B
    }

    return [positions, colors];
  }, []);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current.x = (event.clientX / size.width) * 2 - 1;
      mousePos.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Rotate the particle sphere
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;

    // React to mouse position
    meshRef.current.rotation.x += mousePos.current.y * 0.01;
    meshRef.current.rotation.y += mousePos.current.x * 0.01;

    // Animate particle positions for wave effect
    const positionsArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positionsArray.length; i += 3) {
      const i3 = i;
      const x = positionsArray[i3];
      const y = positionsArray[i3 + 1];
      const z = positionsArray[i3 + 2];

      // Add subtle wave motion
      const distance = Math.sqrt(x * x + y * y + z * z);
      const wave = Math.sin(time * 2 + distance * 2) * 0.02;

      positionsArray[i3] = positions[i3] + x * wave;
      positionsArray[i3 + 1] = positions[i3 + 1] + y * wave;
      positionsArray[i3 + 2] = positions[i3 + 2] + z * wave;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={isDark ? 0.8 : 0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface ParticleSceneProps {
  isDark?: boolean;
}

export default function ParticleScene({ isDark = false }: ParticleSceneProps) {
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ParticleField isDark={isDark} />
      </Canvas>
    </div>
  );
}
