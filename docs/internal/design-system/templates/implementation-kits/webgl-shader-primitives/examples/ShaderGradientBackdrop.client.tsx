"use client";

import { CSSProperties, useEffect, useState } from "react";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

type ShaderGradientBackdropProps = {
  className?: string;
  style?: CSSProperties;
  staticFallback?: string;
};

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

export function ShaderGradientBackdrop({
  className,
  style,
  staticFallback = "radial-gradient(circle at 30% 20%, #6f8cff 0%, transparent 35%), linear-gradient(135deg, #101522, #1b2340)"
}: ShaderGradientBackdropProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: staticFallback,
          ...style
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style
      }}
    >
      <ShaderGradientCanvas
        pixelDensity={1}
        fov={45}
        style={{ position: "absolute", inset: 0 }}
      >
        <ShaderGradient
          animate="on"
          type="plane"
          color1="#6f8cff"
          color2="#f5d7ff"
          color3="#0f172a"
          uSpeed={0.18}
          uStrength={1.2}
          cDistance={32}
          cPolarAngle={125}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
