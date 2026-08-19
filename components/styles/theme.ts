/**
 * 🎨 THEME — The single source of truth for the app's visual identity.
 *
 * Edit colors here to retheme the ENTIRE app in one place.
 * Supports Light Mode and Dark Mode palettes.
 */

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  successBg: string;
  danger: string;
  dangerBg: string;
  warning: string;
  warningBg: string;
}

// ── Light Mode Palette ──────────────────────────────────────────────────────
export const LIGHT_COLORS: ThemeColors = {
  // Brand blues — change these to shift app color
  primary: '#254091ff',      // Main brand blue (buttons, highlights, badges)
  primaryDark: '#172757ff',  // Hover / pressed state
  primaryLight: '#f7f7f7ff',   // Tinted backgrounds, cards

  // App backgrounds
  bg: '#f2f6fa',             // Screen background
  surface: '#ffffff',        // Card / panel background
  surfaceAlt: '#f8fafc',     // Secondary surface

  // Text hierarchy
  textPrimary: '#1a2a3a',     // Main text
  textSecondary: '#6b7f91',   // Subtext, hints
  textMuted: '#9eb3c8',       // Placeholders, disabled

  // Borders & dividers
  border: '#dde8f0',         // Input borders, dividers
  borderLight: '#e8f4fb',    // Subtle dividers (tab bar, etc.)

  // Semantic states
  success: '#1a7a4e',
  successBg: '#e6f9f0',
  danger: '#c0392b',
  dangerBg: '#fde8e8',
  warning: '#856404',
  warningBg: '#fff3cd',
};

// ── Dark Mode Palette ───────────────────────────────────────────────────────
export const DARK_COLORS: ThemeColors = {
  // Brand blues in Dark Mode
  primary: '#4976ffff',        // Vibrant blue accent in dark mode
  primaryDark: '#707fafff',    // Darker shade
  primaryLight: '#233044ff',   // Card background accent

  // App backgrounds
  bg: '#0f172a',             // Dark slate screen background
  surface: '#1e293b',        // Dark card background
  surfaceAlt: '#334155',     // Secondary dark surface

  // Text hierarchy
  textPrimary: '#f8fafc',     // Bright white text
  textSecondary: '#94a3b8',   // Light gray subtext
  textMuted: '#64748b',       // Muted text

  // Borders & dividers
  border: '#334155',         // Dark borders
  borderLight: '#1e293b',    // Subtle dark dividers

  // Semantic states
  success: '#10b981',
  successBg: '#064e3b',
  danger: '#ef4444',
  dangerBg: '#7f1d1d',
  warning: '#f59e0b',
  warningBg: '#78350f',
};

// Default export COLORS (points to LIGHT_COLORS)
export const COLORS: ThemeColors = LIGHT_COLORS;

// ── Spacing Scale ────────────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  page: 20,   // Standard horizontal page padding
} as const;

// ── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 24,
  pill: 999,
} as const;

// ── Typography ───────────────────────────────────────────────────────────────
export const FONT = {
  sizeXs: 11,
  sizeSm: 12,
  sizeMd: 13,
  sizeBase: 14,
  sizeLg: 16,
  sizeXl: 20,
  sizeXxl: 24,

  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemi: '600' as const,
  weightBold: '700' as const,
  weightBlack: '800' as const,
} as const;

// ── Shadows ──────────────────────────────────────────────────────────────────
export const SHADOW = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.07 as number,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  strong: {
    shadowColor: '#000',
    shadowOpacity: 0.12 as number,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  button: {
    shadowColor: '#00AEEF',
    shadowOpacity: 0.35 as number,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
} as const;
