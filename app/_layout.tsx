/**
 * Root Layout — app/_layout.tsx
 *
 * 🎓 LESSON: Global Providers & Route Definitions
 * Equivalent to Laravel's AppServiceProvider + main Blade layout (layouts/app.blade.php)
 *
 * Flash-fix: the navigation transition "white flash" is caused by React Navigation's
 * ThemeProvider defaulting to a white background between screen transitions.
 * We build a custom nav theme that always matches the app's color scheme, and
 * also set contentStyle on every Stack.Screen so no white gap appears behind screens.
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/auth';
import { AppThemeProvider, useAppTheme } from '@/context/theme';
import { DARK_COLORS, LIGHT_COLORS } from '@/components/styles/theme';

import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

// ── Custom navigation themes (matched to our brand palette) ────────────────────

const LIGHT_NAV_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: LIGHT_COLORS.bg,       // '#f2f6fa'
    card:       LIGHT_COLORS.surface,  // '#ffffff'
    text:       LIGHT_COLORS.textPrimary,
    border:     LIGHT_COLORS.border,
  },
};

const DARK_NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: DARK_COLORS.bg,        // '#0f172a'
    card:       DARK_COLORS.surface,   // '#1e293b'
    text:       DARK_COLORS.textPrimary,
    border:     DARK_COLORS.border,
  },
};

// ── Inner layout (has access to AppThemeProvider context) ─────────────────────

function InnerLayout() {
  const { isDarkMode, colors } = useAppTheme();

  // Keep the Android system navigation bar & background in sync with theme
  SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});

  const navTheme = isDarkMode ? DARK_NAV_THEME : LIGHT_NAV_THEME;

  // contentStyle applied to every screen prevents the white "gap" flash
  // that appears behind screens during push/pop transition animations.
  const screenBg = { contentStyle: { backgroundColor: colors.bg } };

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)"           options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="login"            options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="currency"         options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="quran/index"      options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="quran/[id]"       options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="kiblat"           options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="doa/index"        options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="doa/[category]"   options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="doa/detail"       options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="pakets/index"     options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="pakets/[id]"      options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="gallery/index"    options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="khutbah"          options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="waktu-sholat"     options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="destination/[id]" options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="articles/[id]"    options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen name="tentang"          options={{ headerShown: false, ...screenBg }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal', headerShown: true }}
        />
      </Stack>
      <FloatingWhatsApp />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={colors.bg} />
    </ThemeProvider>
  );
}

// ── Root Layout ────────────────────────────────────────────────────────────────

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Set system UI background immediately on mount before providers load
  // to prevent the very first cold-launch flash
  const initialBg = colorScheme === 'dark' ? DARK_COLORS.bg : LIGHT_COLORS.bg;
  SystemUI.setBackgroundColorAsync(initialBg).catch(() => {});

  return (
    <AppThemeProvider>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </AppThemeProvider>
  );
}
