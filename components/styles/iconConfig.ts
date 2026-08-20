/**
 * 🧩 ICON CONFIG — All icons defined in one place.
 *
 * Uses MaterialCommunityIcons from @expo/vector-icons — solid, single-color vector fonts.
 * NO emoji, NO OS-rendered outline icons, NO borders.
 *
 * To change icon color app-wide → edit `iconColor` below.
 * To swap an icon → change `name` for that menu item.
 * Icon browser: https://icons.expo.fyi/
 */

import { COLORS } from './theme';

// ── Tab Bar Icons ────────────────────────────────────────────────────────────
// Drives tab bar icon color — single static value, no outline.
export const TAB_ICON = {
  color: COLORS.textMuted,   // Inactive tab
  activeColor: COLORS.primary,     // Active tab ← change here for whole tab bar
  size: 26,
} as const;

// ── Menu Grid Icons ──────────────────────────────────────────────────────────
// All use MaterialCommunityIcons — solid, perfectly single-color vector icons.
// iconColor applies to ALL menu icons. Change once, updates everywhere.
export const MENU_ICONS = {
  iconColor: COLORS.primary,        // ← single icon color for all menu icons
  iconSize: 28,                    // ← icon size inside the box
  iconBg: COLORS.primaryLight,   // ← box background behind all icons

  items: [
    // ── Row 1 ──
    {
      id: 'semua_paket',
      label: 'Semua\nPaket',
      icon: 'package-variant-closed' as const,
    },
    {
      id: 'doa_dzikir',
      label: 'Doa &\nDzikir',
      icon: 'hands-pray' as const,
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: 'image-multiple' as const,
    },
    {
      id: 'khutbah',
      label: 'Khutbah\nJumat',
      icon: 'account-voice' as const,
    },

    // ── Row 2 ──
    {
      id: 'waktu_sholat',
      label: 'Waktu Sholat',
      icon: 'clock-time-four-outline' as const,
    },
    {
      id: 'konversi_valas',
      label: 'Konversi\nMata Uang',
      icon: 'swap-horizontal-bold' as const,
    },
    {
      id: 'kiblat',
      label: 'Kiblat',
      icon: 'compass-rose' as const,
    },
    {
      id: 'alquran',
      label: 'Al-Quran',
      icon: 'book-open-page-variant' as const,
    },
  ],
} as const;

// ── Inline / Utility Icons ───────────────────────────────────────────────────
// Icons used inline across screens (search, paket badge, etc.)
export const UI_ICONS = {
  search: { name: 'magnify' as const, size: 20, color: COLORS.textMuted },
  avatar: { name: 'account-circle' as const, size: 22, color: COLORS.surface },
  signOut: { name: 'logout' as const, size: 20, color: COLORS.surface },
  calendar: { name: 'calendar' as const, size: 14, color: COLORS.textSecondary },
  flight: { name: 'airplane-takeoff' as const, size: 14, color: COLORS.textSecondary },
  clock: { name: 'clock-outline' as const, size: 14, color: COLORS.textSecondary },
  mosque: { name: 'mosque' as const, size: 40, color: COLORS.primary },
} as const;
