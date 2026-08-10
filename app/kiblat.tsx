/**
 * Kiblat Screen — app/kiblat.tsx
 * Hafana Umrah Travel — Powered by Google Qibla Finder (https://qiblafinder.withgoogle.com)
 *
 * Uses Chrome Custom Tabs (WebBrowser) inside the app so Google Qibla Finder has full
 * native Chrome access to WebGL, Camera, and Compass/DeviceOrientation sensors without hanging.
 */

import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  cardStyles, layoutStyles,
} from '@/components/styles';

const GOOGLE_QIBLA_FINDER_URL = 'https://qiblafinder.withgoogle.com';

export default function KiblatScreen() {
  const router = useRouter();

  // Auto-launch Chrome Custom Tab in-app on mount
  useEffect(() => {
    openGoogleQiblaFinder();
  }, []);

  const openGoogleQiblaFinder = async () => {
    try {
      await WebBrowser.openBrowserAsync(GOOGLE_QIBLA_FINDER_URL, {
        toolbarColor: COLORS.primary,
        controlsColor: '#ffffff',
        showTitle: true,
        enableBarCollapsing: true,
        showInRecents: false,
      });
    } catch {
      // Fallback handled automatically
    }
  };

  return (
    <SafeAreaView style={layoutStyles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── TOP BAR ── */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={s.headerTitle} numberOfLines={1}>
          🧭 Google Qibla Finder
        </Text>
      </View>

      {/* ── IN-APP CHROME CONTAINER CARD ── */}
      <View style={s.contentContainer}>
        {/* Kaabah Icon Card */}
        <View style={s.mainCard}>
          <View style={s.iconCircle}>
            <Text style={s.kaabahEmoji}>🕋</Text>
          </View>

          <Text style={s.cardTitle}>Google Qibla Finder</Text>
          <Text style={s.cardSub}>
            Menentukan arah Kiblat secara presisi menggunakan teknologi Kamera AR & Kompas resmi dari Google.
          </Text>

          {/* Features Checklist */}
          <View style={s.featureList}>
            <View style={s.featureRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primary} />
              <Text style={s.featureText}>Kompas & Sensor Gerak Presisi Google</Text>
            </View>
            <View style={s.featureRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primary} />
              <Text style={s.featureText}>Visualisasi Kamera 3D / Realitas Campuran (AR)</Text>
            </View>
            <View style={s.featureRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primary} />
              <Text style={s.featureText}>Akses Langsung Dalam Aplikasi (Chrome In-App)</Text>
            </View>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={s.launchBtn}
            onPress={openGoogleQiblaFinder}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="compass" size={22} color={COLORS.surface} style={{ marginRight: 8 }} />
            <Text style={s.launchBtnText}>Buka Qibla Finder (Chrome)</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions Footer */}
        <View style={s.tipCard}>
          <MaterialCommunityIcons name="information-outline" size={18} color={COLORS.primary} style={{ marginRight: 8, marginTop: 1 }} />
          <Text style={s.tipText}>
            Pilih <Text style={{ fontWeight: FONT.weightBold }}>"Izinkan Lokasi & Kamera"</Text> saat Chrome terbuka untuk pengalaman navigasi Kiblat 3D yang optimal.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: { padding: SPACING.xs },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    flex: 1,
    marginLeft: SPACING.sm,
  },

  contentContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },

  mainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    ...SHADOW.strong,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: '#b3e0f7',
  },
  kaabahEmoji: { fontSize: 40 },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: FONT.weightBlack,
    marginBottom: SPACING.xs,
  },
  cardSub: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },

  featureList: {
    width: '100%',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  featureText: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightMedium,
  },

  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    width: '100%',
    ...SHADOW.card,
  },
  launchBtnText: {
    color: COLORS.surface,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBlack,
  },

  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
    borderWidth: 1,
    borderColor: '#b3e0f7',
  },
  tipText: {
    flex: 1,
    color: COLORS.primaryDark,
    fontSize: FONT.sizeSm,
    lineHeight: 20,
  },
});
