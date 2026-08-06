/**
 * 🎨 THEME — The single source of truth for the app's visual identity.
 *
 * Edit colors here to retheme the ENTIRE app in one place.
 * Like Laravel's config/app.php but for your UI design tokens.
 */

// ── Primary Palette ─────────────────────────────────────────────────────────
export const COLORS = {
  // Brand blues — change these two and the whole app shifts color
  primary:       '#00AEEF',   // Main brand blue (buttons, highlights, badges)
  primaryDark:   '#0099d4',   // Hover / pressed state
  primaryLight:  '#e6f7fd',   // Tinted backgrounds, cards

  // App backgrounds
  bg:            '#f2f6fa',   // Screen background
  surface:       '#ffffff',   // Card / panel background
  surfaceAlt:    '#f8fafc',   // Secondary surface

  // Text hierarchy
  textPrimary:   '#1a2a3a',   // Main text
  textSecondary: '#6b7f91',   // Subtext, hints
  textMuted:     '#9eb3c8',   // Placeholders, disabled

  // Borders & dividers
  border:        '#dde8f0',   // Input borders, dividers
  borderLight:   '#e8f4fb',   // Subtle dividers (tab bar, etc.)

  // Semantic states
  success:       '#1a7a4e',
  successBg:     '#e6f9f0',
  danger:        '#c0392b',
  dangerBg:      '#fde8e8',
  warning:       '#856404',
  warningBg:     '#fff3cd',
} as const;

// ── Spacing Scale ────────────────────────────────────────────────────────────
export const SPACING = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  page: 20,   // Standard horizontal page padding
} as const;

// ── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   14,
  xl:   16,
  xxl:  24,
  pill: 999,
} as const;

// ── Typography ───────────────────────────────────────────────────────────────
export const FONT = {
  sizeXs:   11,
  sizeSm:   12,
  sizeMd:   13,
  sizeBase: 14,
  sizeLg:   16,
  sizeXl:   20,
  sizeXxl:  24,

  weightRegular: '400' as const,
  weightMedium:  '500' as const,
  weightSemi:    '600' as const,
  weightBold:    '700' as const,
  weightBlack:   '800' as const,
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
