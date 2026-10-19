/** The two states the header alternates between. */
export type Role = 'engineer' | 'designer';

/**
 * Colour of the engineer state.
 * - `lime`: lime field, dark green type (default, always light)
 * - `plum`: plum field, lime type (always)
 * - `auto`: lime in light mode, forest green in dark mode
 * The designer state is always the fog room with plum type.
 */
export type EngineerTheme = 'lime' | 'plum' | 'auto';

export interface HeaderCta {
  label: string;
  href: string;
  /** `primary` renders the filled button, `link` the underlined text link. */
  variant: 'primary' | 'link';
}

export interface HeaderContent {
  /** Visually hidden heading text read by screen readers instead of the animated word. */
  heading: string;
  /** Render the hidden heading as h1, h2, or not at all (if the page already has one). */
  headingLevel: 1 | 2 | null;
  /** Giant word per state. Both words must have the same number of letters. */
  words: Record<Role, string>;
  /** Labels of the two role tabs. */
  roleLabels: Record<Role, string>;
  years: string;
  /** Shown while the engineer state is active. */
  stack: string[];
  /** Shown while the designer state is active. */
  designerLine: string;
  proof: string;
  ctas: HeaderCta[];
  /** Accessible description of the photo. */
  photoLabel: string;
  /** Accessible name of the role tab group. */
  rolesGroupLabel: string;
}

export interface HeaderAssets {
  /** Repaired front torso cut-out, transparent background, 1016×1065. */
  front: string;
  /** Matching back torso cut-out, registered to the same 1016×1065 frame. */
  back: string;
  /** Fog room background for the designer state. */
  room: string;
}

export interface HeaderOptions {
  assets: HeaderAssets;
  /** Optional navbar host for the single role switch, owned by this instance. */
  controlsContainer?: HTMLElement;
  content?: Partial<HeaderContent>;
  engineerTheme?: EngineerTheme;
  initialRole?: Role;
  /** Cycle between the roles automatically (default true; always off with reduced motion). */
  autoplay?: boolean;
  /** Seconds each role stays on screen before the next change (default 3). */
  holdSeconds?: number;
  /**
   * `auto` (default) renders the turn with WebGL when available.
   * `fallback` always cross-fades the two photos (use for software-GL CI or low-power modes).
   */
  renderer?: 'auto' | 'fallback';
  /** Called after every completed role change. */
  onRoleChange?: (role: Role) => void;
}

export interface HeaderInstance {
  readonly role: Role;
  readonly renderer: 'webgl' | 'fallback' | 'pending';
  /** Change role with the full transition. Choosing a role this way does not pause the cycle. */
  setRole(role: Role): Promise<void>;
  play(): void;
  pause(): void;
  destroy(): void;
}
