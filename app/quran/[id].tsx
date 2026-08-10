/**
 * Surah Detail & Reading Screen — app/quran/[id].tsx
 * Hafana Umrah Travel — Full Ayah reading view with reliable "Ke Ayat" Jump
 *
 * JUMP FIX: Uses ScrollView + per-ayah onLayout position tracking instead of
 * FlatList.scrollToIndex. FlatList virtualization causes scrollToIndex to fail
 * for un-rendered items. ScrollView renders all ayahs at once and stores Y
 * positions so scrollTo() always works regardless of current viewport.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  cardStyles, layoutStyles, textStyles, emptyStyles,
} from '@/components/styles';

// ── Types ────────────────────────────────────────────────────────────────────
interface AyahItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  ayat: AyahItem[];
  suratSelanjutnya?: { nomor: number; namaLatin: string } | false;
  suratSebelumnya?: { nomor: number; namaLatin: string } | false;
}

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // Map of ayah number → measured Y offset from top of scroll content
  const ayahYPositions = useRef<Record<number, number>>({});

  const [detail, setDetail]   = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Jump to Ayah Modal states
  const [showJumpModal, setShowJumpModal]     = useState<boolean>(false);
  const [jumpAyatInput, setJumpAyatInput]     = useState<string>('');
  const [highlightedAyat, setHighlightedAyat] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchSurahDetail(id);
    }
  }, [id]);

  const fetchSurahDetail = async (surahNo: string) => {
    setLoading(true);
    setHighlightedAyat(null);
    ayahYPositions.current = {};
    try {
      const res = await fetch(`https://equran.id/api/v2/surat/${surahNo}`);
      const json = await res.json();
      if (json && json.code === 200 && json.data) {
        setDetail(json.data);
      } else {
        setDetail(null);
      }
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  /** Called when each ayah card is laid out — records its Y position */
  const handleAyahLayout = (nomorAyat: number, event: LayoutChangeEvent) => {
    const y = event.nativeEvent.layout.y;
    ayahYPositions.current[nomorAyat] = y;
  };

  /** Jump handler — uses recorded Y positions, no virtualization issues */
  const handleJumpToAyat = (targetNum?: number) => {
    if (!detail) return;
    const targetAyat = targetNum ?? parseInt(jumpAyatInput.trim(), 10);

    if (isNaN(targetAyat) || targetAyat < 1 || targetAyat > detail.jumlahAyat) {
      Alert.alert('Perhatian', `Masukkan nomor ayat antara 1 s/d ${detail.jumlahAyat}`);
      return;
    }

    setShowJumpModal(false);
    setJumpAyatInput('');
    setHighlightedAyat(targetAyat);

    const targetY = ayahYPositions.current[targetAyat];

    if (targetY !== undefined) {
      // Y position already measured — scroll immediately
      scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
    } else {
      // Fallback: estimate based on average ayah height (~280px) + header (~260px)
      const estimatedY = 260 + (targetAyat - 1) * 280;
      scrollViewRef.current?.scrollTo({ y: estimatedY, animated: true });
    }

    // Clear highlight after 3.5 seconds
    setTimeout(() => {
      setHighlightedAyat(null);
    }, 3500);
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
          {detail ? `${detail.nomor}. ${detail.namaLatin}` : 'Detail Surah'}
        </Text>

        {/* Ke Ayat Button */}
        {detail && (
          <TouchableOpacity
            onPress={() => setShowJumpModal(true)}
            style={s.jumpTopBtn}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="format-list-numbered" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={s.jumpTopText}>Ke Ayat</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={layoutStyles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          <Text style={[textStyles.muted, { marginTop: 12 }]}>Memuat ayat-ayat Surah...</Text>
        </View>
      ) : !detail ? (
        <View style={emptyStyles.container}>
          <Text style={emptyStyles.icon}>⚠️</Text>
          <Text style={emptyStyles.title}>Gagal Memuat Surah</Text>
          <Text style={emptyStyles.subtitle}>Periksa koneksi internet Anda</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── SURAH HEADER CARD ── */}
          <View style={[cardStyles.padded, s.headerCard]}>
            <Text style={s.headerSurahLatin}>{detail.namaLatin}</Text>
            <Text style={s.headerSurahArabic}>{detail.nama}</Text>
            <Text style={s.headerSurahArti}>"{detail.arti}"</Text>
            <View style={s.headerDivider} />
            <Text style={s.headerMeta}>
              {detail.tempatTurun === 'Mekah' ? '🕋 Makkah' : '🕌 Madinah'} · {detail.jumlahAyat} AYAT
            </Text>
            {detail.nomor !== 9 && (
              <View style={s.bismillahBox}>
                <Text style={s.bismillahText}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>
              </View>
            )}
          </View>

          {/* ── AYAH LIST ── */}
          {detail.ayat.map((item) => {
            const isHighlighted = highlightedAyat === item.nomorAyat;
            return (
              <View
                key={item.nomorAyat}
                style={[s.ayahCard, isHighlighted && s.ayahCardHighlighted]}
                onLayout={(e) => handleAyahLayout(item.nomorAyat, e)}
              >
                {/* Badge row */}
                <View style={s.ayahTopRow}>
                  <View style={[s.ayahBadge, isHighlighted && s.ayahBadgeHighlighted]}>
                    <Text style={[s.ayahBadgeText, isHighlighted && s.ayahBadgeTextHighlighted]}>
                      {detail.nomor}:{item.nomorAyat}{isHighlighted ? '  📍' : ''}
                    </Text>
                  </View>
                </View>

                {/* Arabic Text */}
                <Text style={s.teksArab}>{item.teksArab}</Text>

                {/* Latin */}
                <Text style={s.teksLatin}>{item.teksLatin}</Text>

                {/* Indonesian */}
                <Text style={s.teksIndonesia}>{item.teksIndonesia}</Text>
              </View>
            );
          })}

          {/* ── FOOTER NAVIGATION ── */}
          <View style={s.footerNav}>
            {detail.suratSebelumnya ? (
              <TouchableOpacity
                style={s.navPrevBtn}
                onPress={() => router.push(`/quran/${(detail.suratSebelumnya as any).nomor}` as any)}
              >
                <MaterialCommunityIcons name="chevron-left" size={20} color={COLORS.primary} />
                <Text style={s.navBtnText}>Surah Sebelumnya</Text>
              </TouchableOpacity>
            ) : <View />}

            {detail.suratSelanjutnya ? (
              <TouchableOpacity
                style={s.navNextBtn}
                onPress={() => router.push(`/quran/${(detail.suratSelanjutnya as any).nomor}` as any)}
              >
                <Text style={s.navBtnTextNext}>Surah Selanjutnya</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.surface} />
              </TouchableOpacity>
            ) : <View />}
          </View>
        </ScrollView>
      )}

      {/* ── KE AYAT JUMP MODAL ── */}
      {detail && (
        <Modal
          visible={showJumpModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowJumpModal(false)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalContainer}>
              <View style={layoutStyles.spaceBetween}>
                <View style={layoutStyles.row}>
                  <MaterialCommunityIcons name="format-list-numbered" size={22} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={s.modalTitle}>Lompat Ke Ayat</Text>
                </View>
                <TouchableOpacity onPress={() => setShowJumpModal(false)}>
                  <MaterialCommunityIcons name="close" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={s.modalSub}>
                Surah {detail.namaLatin} — <Text style={{ fontWeight: FONT.weightBold, color: COLORS.primary }}>1 s/d {detail.jumlahAyat} Ayat</Text>
              </Text>

              {/* Number Input */}
              <View style={s.modalInputWrapper}>
                <TextInput
                  style={s.modalInput}
                  placeholder={`Nomor Ayat (1 - ${detail.jumlahAyat})`}
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="number-pad"
                  value={jumpAyatInput}
                  onChangeText={setJumpAyatInput}
                  autoFocus
                />
              </View>

              {/* Quick Jump Chips */}
              <Text style={s.quickJumpLabel}>📌 Akses Cepat:</Text>
              <View style={s.quickJumpGrid}>
                {[
                  { label: `Awal (1)`, val: 1 },
                  { label: `Tengah (${Math.round(detail.jumlahAyat / 2)})`, val: Math.round(detail.jumlahAyat / 2) },
                  { label: `Akhir (${detail.jumlahAyat})`, val: detail.jumlahAyat },
                ].map((q) => (
                  <TouchableOpacity
                    key={q.val}
                    style={s.quickChip}
                    onPress={() => handleJumpToAyat(q.val)}
                  >
                    <Text style={s.quickChipText}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={s.modalActions}>
                <TouchableOpacity style={s.modalCancelBtn} onPress={() => setShowJumpModal(false)}>
                  <Text style={s.modalCancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.modalSubmitBtn} onPress={() => handleJumpToAyat()}>
                  <Text style={s.modalSubmitText}>📍 Lompat Ke Ayat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    textAlign: 'left',
    marginLeft: SPACING.sm,
  },

  jumpTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: '#b3e0f7',
  },
  jumpTopText: {
    color: COLORS.primaryDark,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 40,
    gap: SPACING.md,
  },

  // Surah Header Card
  headerCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  headerSurahLatin:  { color: COLORS.surface, fontSize: 24, fontWeight: FONT.weightBlack },
  headerSurahArabic: { color: COLORS.surface, fontSize: 32, fontWeight: FONT.weightBold, marginVertical: 4 },
  headerSurahArti:   { color: 'rgba(255,255,255,0.85)', fontSize: FONT.sizeBase, fontStyle: 'italic' },
  headerDivider: {
    width: '60%', height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: SPACING.md,
  },
  headerMeta: { color: COLORS.surface, fontSize: FONT.sizeXs, fontWeight: FONT.weightBlack, letterSpacing: 1 },
  bismillahBox: {
    marginTop: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  bismillahText: { color: COLORS.surface, fontSize: 22, fontWeight: FONT.weightBold, textAlign: 'center' },

  // Ayah Card
  ayahCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW.card,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: SPACING.sm,
  },
  ayahCardHighlighted: {
    borderColor: COLORS.primary,
    backgroundColor: '#edf8ff',
  },
  ayahTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  ayahBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: '#b3e0f7',
  },
  ayahBadgeHighlighted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  ayahBadgeText: { color: COLORS.primaryDark, fontSize: FONT.sizeXs, fontWeight: FONT.weightBlack },
  ayahBadgeTextHighlighted: { color: COLORS.surface },

  teksArab: {
    color: COLORS.textPrimary,
    fontSize: 26,
    lineHeight: 52,
    textAlign: 'right',
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.md,
  },
  teksLatin: {
    color: COLORS.primary,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightMedium,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  teksIndonesia: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeBase,
    lineHeight: 22,
  },

  // Footer Nav
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
  },
  navPrevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  navBtnText: { color: COLORS.primary, fontWeight: FONT.weightBold, fontSize: FONT.sizeSm },
  navNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
  },
  navBtnTextNext: { color: COLORS.surface, fontWeight: FONT.weightBold, fontSize: FONT.sizeSm },

  // Jump Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 360,
    ...SHADOW.strong,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
  },
  modalSub: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeSm,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  modalInputWrapper: {
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  modalInput: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: FONT.weightBlack,
    paddingVertical: 12,
  },
  quickJumpLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.xs,
  },
  quickJumpGrid: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  quickChip: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b3e0f7',
  },
  quickChipText: {
    color: COLORS.primaryDark,
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightBold,
  },
  modalActions: { flexDirection: 'row', gap: SPACING.sm },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalCancelText: { color: COLORS.textSecondary, fontWeight: FONT.weightBold, fontSize: FONT.sizeSm },
  modalSubmitBtn: {
    flex: 1.5,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitText: { color: COLORS.surface, fontWeight: FONT.weightBlack, fontSize: FONT.sizeSm },
});
