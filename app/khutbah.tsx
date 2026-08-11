/**
 * Khutbah Jumat Screen — app/khutbah.tsx
 * Hafana Umrah Travel
 *
 * Placeholder screen for Khutbah Jumat feature.
 */

import React from 'react';
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

import {
  COLORS, FONT, RADIUS, SPACING,
  layoutStyles, emptyStyles,
} from '@/components/styles';

import { useAppTheme } from '@/context/theme';

export default function KhutbahScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]}>Khutbah Jumat</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── CONTENT PLACEHOLDER ── */}
      <View style={emptyStyles.container}>
        <View style={[s.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <MaterialCommunityIcons name="account-voice" size={54} color={colors.primary} />
        </View>
        <Text style={[emptyStyles.title, { marginTop: SPACING.lg, color: colors.textPrimary }]}>
          Khutbah Jumat
        </Text>
        <Text style={[emptyStyles.subtitle, { textAlign: 'center', paddingHorizontal: SPACING.xl, color: colors.textSecondary }]}>
          Halaman Khutbah Jumat akan segera hadir dengan kumpulan teks & naskah khutbah pilihan.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  appBar: {
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
  appBarTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    textAlign: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
});
