"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function ProductObject({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || reduced) return;
    meshRef.current.rotation.y += delta * 0.25;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#7dd3fc" roughness={0.35} metalness={0.25} />
    </mesh>
  );
}

export function R3FSceneShell() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      data-webgl-stage
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        minHeight: 260,
        overflow: "hidden",
        pointerEvents: "none"
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 4]} intensity={1.2} />
        <ProductObject reduced={reduced} />
      </Canvas>
      <span className="sr-only">Static product object preview. The animated WebGL scene is decorative.</span>
    </div>
  );
}
