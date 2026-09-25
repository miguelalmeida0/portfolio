import { Component, createElement as h, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { Mesh, type MeshPhysicalMaterial } from 'three';
import { heroGradientPreset, type GradientController, type GradientPalette } from './preset';

type FrameProps = { paused: boolean; onReady: () => void; onError: () => void };

/** Advance only by visible frame time: returning to the page never jumps the folds. */
function GradientFrames({ paused, onReady, onError }: FrameProps) {
  const { gl, scene, setFrameloop } = useThree();
  const elapsed = useRef<number>(heroGradientPreset.uTime);
  const frames = useRef(0);

  useLayoutEffect(() => {
    setFrameloop(paused ? 'never' : 'always');
  }, [paused, setFrameloop]);

  useLayoutEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onError(); };
    const previousShaderError = gl.debug.onShaderError;
    gl.debug.onShaderError = onError;
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => {
      gl.debug.onShaderError = previousShaderError;
      gl.domElement.removeEventListener('webglcontextlost', lost);
    };
  }, [gl, onError]);

  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.05);
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials as MeshPhysicalMaterial[]) {
        if (material.userData.uTime) material.userData.uTime.value = elapsed.current;
      }
    });
    // Let the renderer draw before revealing the canvas over its static fallback.
    if (++frames.current === 3) onReady();
  });

  return null;
}

class GradientBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** The sole React island: imported only after motion and visibility checks pass. */
export function mountHeroGradient(
  host: HTMLElement,
  palette: GradientPalette,
  onReady: () => void,
  onError: () => void
): GradientController {
  const root = createRoot(host);
  const density = window.matchMedia('(max-width: 760px)').matches ? 1 : Math.min(devicePixelRatio, 1.5);
  let disposed = false;

  const render = (paused: boolean) => root.render(
    h(GradientBoundary, { onError, children:
      h(ShaderGradientCanvas, {
        pixelDensity: density,
        fov: 45,
        pointerEvents: 'none',
        lazyLoad: false,
        preserveDrawingBuffer: false,
        powerPreference: 'low-power',
        children: [
          h(ShaderGradient, { key: 'gradient', ...heroGradientPreset, ...palette }),
          h(GradientFrames, { key: 'frames', paused, onReady, onError })
        ]
      })
    })
  );

  render(false);
  return {
    pause(paused) { if (!disposed) render(paused); },
    destroy() { if (!disposed) { disposed = true; root.unmount(); } }
  };
}
