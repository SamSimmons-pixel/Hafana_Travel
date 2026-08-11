/**
 * Root Layout — app/_layout.tsx
 * 
 * 🎓 LESSON: Global Providers & Route Definitions
 * Equivalent to Laravel's AppServiceProvider + main Blade layout (layouts/app.blade.php)
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/auth';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="currency" options={{ headerShown: false }} />
          <Stack.Screen name="quran/index" options={{ headerShown: false }} />
          <Stack.Screen name="quran/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="kiblat" options={{ headerShown: false }} />
          <Stack.Screen name="doa/index" options={{ headerShown: false }} />
          <Stack.Screen name="doa/[category]" options={{ headerShown: false }} />
          <Stack.Screen name="doa/detail" options={{ headerShown: false }} />
          <Stack.Screen name="pakets/index" options={{ headerShown: false }} />
          <Stack.Screen name="pakets/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="gallery/index" options={{ headerShown: false }} />
          <Stack.Screen name="destination/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
