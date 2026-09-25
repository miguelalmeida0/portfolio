import type { GradientT } from '@shadergradient/react';

/** Slow, broad folds. The colours are resolved from the portfolio's CSS tokens. */
export const heroGradientPreset = {
  control: 'props',
  type: 'waterPlane',
  shader: 'defaults',
  animate: 'off',
  uTime: 0.2,
  uSpeed: 0.065,
  uStrength: 2.4,
  uDensity: 1.1,
  uFrequency: 5.5,
  uAmplitude: 0,
  cAzimuthAngle: 180,
  cPolarAngle: 115,
  cDistance: 3.9,
  cameraZoom: 1,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 235,
  positionX: -0.5,
  positionY: 0.1,
  positionZ: 0,
  lightType: '3d',
  brightness: 1,
  reflection: 0,
  grain: 'off',
  wireframe: false,
  enableTransition: false,
  enableCameraUpdate: false,
  toggleAxis: false
} satisfies GradientT;

export type GradientPalette = { color1: string; color2: string; color3: string };
export type GradientController = { pause: (paused: boolean) => void; destroy: () => void };
