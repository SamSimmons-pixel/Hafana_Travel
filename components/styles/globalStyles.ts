/**
 * 🧩 GLOBAL STYLES — Shared StyleSheet blocks reused across screens.
 *
 * Import from here instead of re-defining styles per-screen.
 * Think of this as your global CSS file (like app.css in Laravel).
 */

import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from './theme';

// ── Shared Layout ────────────────────────────────────────────────────────────
export const layoutStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagePadding: {
    paddingHorizontal: SPACING.page,
  },
});

// ── Shared Card ──────────────────────────────────────────────────────────────
export const cardStyles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    ...SHADOW.card,
  },
  padded: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOW.card,
  },
});

// ── Shared Input ─────────────────────────────────────────────────────────────
export const inputStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  wrapperFocused: {
    borderColor: COLORS.primary,
  },
  field: {
    flex: 1,
    paddingVertical: 14,
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeMd,
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
});

// ── Shared Button ────────────────────────────────────────────────────────────
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center' as const,
    ...SHADOW.button,
  },
  primaryText: {
    color: COLORS.surface,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.6,
  },
});

// ── Shared Text ──────────────────────────────────────────────────────────────
export const textStyles = StyleSheet.create({
  heading: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeXl,
    fontWeight: FONT.weightBlack,
  },
  subheading: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
  },
  body: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
  },
  muted: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeMd,
  },
  tiny: {
    color: COLORS.textMuted,
    fontSize: FONT.sizeXs,
  },
  link: {
    color: COLORS.primary,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightSemi,
  },
});

// ── Shared Section Header ────────────────────────────────────────────────────
export const sectionStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: FONT.weightBlack,
  },
  link: {
    color: COLORS.primary,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightSemi,
  },
});

// ── Shared Empty State ───────────────────────────────────────────────────────
export const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT.sizeMd,
    textAlign: 'center',
  },
});
