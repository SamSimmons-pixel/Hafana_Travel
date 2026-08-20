/**
 * Al-Quran Screen — app/quran/index.tsx
 * Hafana Umrah Travel — 114 Surah List Index using EQuran.id API
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/theme';
import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  cardStyles, layoutStyles, textStyles, emptyStyles,
} from '@/components/styles';

// ── Types ────────────────────────────────────────────────────────────────────
export interface SurahItem {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

// Popular Surahs often read during Umrah & daily worship
const POPULAR_SURAH_NUMBERS = [1, 18, 36, 55, 56, 67, 112, 113, 114];

export default function QuranIndexScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  const [surahs, setSurahs]           = useState<SurahItem[]>([]);
  const [loading, setLoading]         = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'POPULAR' | 'MEKAH' | 'MADINAH'>('ALL');

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://equran.id/api/v2/surat');
      const json = await res.json();
      if (json && json.code === 200 && Array.isArray(json.data)) {
        setSurahs(json.data);
      }
    } catch {
      setSurahs([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredSurahs = surahs.filter((item) => {
    // Search match
    const matchSearch =
      item.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomor.toString() === searchQuery.trim();

    if (!matchSearch) return false;

    // Category match
    if (filterCategory === 'POPULAR') {
      return POPULAR_SURAH_NUMBERS.includes(item.nomor);
    } else if (filterCategory === 'MEKAH') {
      return item.tempatTurun.toLowerCase().includes('mekah');
    } else if (filterCategory === 'MADINAH') {
      return item.tempatTurun.toLowerCase().includes('madinah');
    }

    return true;
  });

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── TOP BAR ── */}
      <View style={[s.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.textPrimary }]}>Al-Qur'anul Karim</Text>
        <TouchableOpacity onPress={fetchSurahs} style={s.refreshBtn}>
          <MaterialCommunityIcons name="refresh" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── BANNER ── */}
      <View style={[s.headerBanner, { backgroundColor: isDarkMode ? '#1e293b' : colors.primary }]}>
        <View>
          <Text style={s.bannerTitle}>Baca & Hayati Al-Qur'an 📖</Text>
          <Text style={s.bannerSub}>114 Surah lengkap teks Arab, latin & terjemahan</Text>
        </View>
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={[s.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} style={{ marginRight: SPACING.sm }} />
        <TextInput
          style={[s.searchInput, { color: colors.textPrimary }]}
          placeholder="Cari Surah (contoh: Yasin, Al-Kahf)..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── CATEGORY CHIPS ── */}
      <View style={s.chipSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipList}>
          {[
            { id: 'ALL', label: 'Semua (114)' },
            { id: 'POPULAR', label: '⭐ Populer Umrah' },
            { id: 'MEKAH', label: '🕋 Makkiyah' },
            { id: 'MADINAH', label: '🕌 Madaniyah' },
          ].map((cat) => {
            const active = filterCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[s.chip, { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border }]}
                onPress={() => setFilterCategory(cat.id as any)}
                activeOpacity={0.7}
              >
                <Text style={[s.chipText, { color: active ? '#ffffff' : colors.textSecondary }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── SURAH LIST ── */}
      {loading ? (
        <View style={layoutStyles.centered}>
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          <Text style={[textStyles.muted, { marginTop: 12, color: colors.textSecondary }]}>Memuat daftar Surah Al-Qur'an...</Text>
        </View>
      ) : filteredSurahs.length === 0 ? (
        <View style={emptyStyles.container}>
          <Text style={emptyStyles.icon}>📖</Text>
          <Text style={[emptyStyles.title, { color: colors.textPrimary }]}>Surah Tidak Ditemukan</Text>
          <Text style={[emptyStyles.subtitle, { color: colors.textSecondary }]}>Coba kata kunci pencarian yang lain</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => item.nomor.toString()}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.surahCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(`/quran/${item.nomor}` as any)}
              activeOpacity={0.75}
            >
              {/* Surah Number Star Badge */}
              <View style={[s.numberBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[s.numberText, { color: colors.primary }]}>{item.nomor}</Text>
              </View>

              {/* Surah Info */}
              <View style={s.surahInfo}>
                <Text style={[s.surahLatin, { color: colors.textPrimary }]}>{item.namaLatin}</Text>
                <Text style={[s.surahArti, { color: colors.textSecondary }]}>{item.arti} · <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.jumlahAyat} Ayat</Text></Text>
                <View style={s.tagRow}>
                  <Text style={[s.tempatTag, { backgroundColor: colors.surfaceAlt, color: colors.textSecondary }]}>
                    {item.tempatTurun === 'Mekah' ? '🕋 Makkiyah' : '🕌 Madaniyah'}
                  </Text>
                </View>
              </View>

              {/* Arabic Name */}
              <View style={s.arabicBox}>
                <Text style={[s.surahArabic, { color: colors.primary }]}>{item.nama}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
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
  },
  refreshBtn: { padding: SPACING.xs },

  headerBanner: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  bannerTitle: { color: COLORS.surface, fontSize: 18, fontWeight: FONT.weightBlack },
  bannerSub:   { color: 'rgba(255,255,255,0.85)', fontSize: FONT.sizeSm, marginTop: 2 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    ...SHADOW.card,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.sizeBase },

  chipSection: { marginTop: SPACING.md, marginBottom: SPACING.xs },
  chipList: { paddingHorizontal: SPACING.lg, gap: SPACING.xs },
  chip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: { color: COLORS.textSecondary, fontSize: FONT.sizeSm, fontWeight: FONT.weightMedium },
  chipTextActive: { color: COLORS.primaryDark, fontWeight: FONT.weightBold },

  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 40,
    gap: SPACING.sm,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  numberBadge: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: '#b3e0f7',
  },
  numberText: { color: COLORS.primaryDark, fontWeight: FONT.weightBlack, fontSize: FONT.sizeBase },

  surahInfo: { flex: 1 },
  surahLatin: { color: COLORS.textPrimary, fontSize: FONT.sizeBase, fontWeight: FONT.weightBold },
  surahArti:  { color: COLORS.textSecondary, fontSize: FONT.sizeSm, marginTop: 2 },
  tagRow:     { marginTop: 4 },
  tempatTag:  { color: COLORS.textMuted, fontSize: FONT.sizeXs, fontWeight: FONT.weightMedium },

  arabicBox:  { marginLeft: SPACING.sm },
  surahArabic: { color: COLORS.primary, fontSize: 22, fontWeight: FONT.weightBold },
});
