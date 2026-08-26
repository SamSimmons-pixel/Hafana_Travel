/**
 * Tentang Kami Screen — app/tentang.tsx
 * Menampilkan Halaman Resmi Tentang Hafana Travel via WebView (https://hafanatravel.com/tentang/)
 */

import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { FONT, RADIUS, SPACING, layoutStyles } from '@/components/styles';
import { useAppTheme } from '@/context/theme';

const TENTANG_URL = 'https://hafanatravel.com/tentang/';

export default function TentangScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();
  const webViewRef = useRef<WebView>(null);
  const [hasError, setHasError] = useState(false);

  const handleOpenExternal = () => {
    Linking.openURL(TENTANG_URL).catch(() => {});
  };

  const handleReload = () => {
    setHasError(false);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      {/* ── TOP NAVIGATION BAR ── */}
      <View style={[s.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[s.navBtn, { backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[s.topBarTitle, { color: colors.textPrimary }]}>Tentang Hafana Travel</Text>

        <View style={s.navActions}>
          <TouchableOpacity
            style={[s.navBtn, { backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }]}
            onPress={handleReload}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="reload" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.navBtn, { backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }]}
            onPress={handleOpenExternal}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="open-in-new" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── WEBVIEW CONTAINER ── */}
      <View style={s.webContainer}>
        {hasError ? (
          <View style={[s.errorContainer, { backgroundColor: colors.bg }]}>
            <MaterialCommunityIcons name="wifi-off" size={48} color={colors.textMuted} />
            <Text style={[s.errorTitle, { color: colors.textPrimary }]}>Gagal Memuat Halaman</Text>
            <Text style={[s.errorSub, { color: colors.textSecondary }]}>
              Pastikan perangkat Anda terhubung ke internet.
            </Text>
            <TouchableOpacity
              style={[s.retryBtn, { backgroundColor: colors.primary }]}
              onPress={handleReload}
              activeOpacity={0.8}
            >
              <Text style={s.retryBtnText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: TENTANG_URL }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={[s.loadingContainer, { backgroundColor: colors.bg }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[s.loadingText, { color: colors.textSecondary }]}>
                  Memuat informasi Tentang Hafana...
                </Text>
              </View>
            )}
            onError={() => setHasError(true)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={{ flex: 1, backgroundColor: colors.bg }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBar: {
    height: 56,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBarTitle: {
    fontSize: FONT.sizeMd,
    fontWeight: '800',
  },
  webContainer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    zIndex: 10,
  },
  loadingText: {
    fontSize: FONT.sizeSm,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  errorTitle: {
    fontSize: FONT.sizeBase,
    fontWeight: '800',
    marginTop: SPACING.sm,
  },
  errorSub: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    marginTop: SPACING.sm,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: FONT.sizeSm,
    fontWeight: '700',
  },
});
