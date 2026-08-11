/**
 * Semua Paket — app/pakets/index.tsx
 * Hafana Umrah Travel — Full Paket Listing
 *
 * Fetches all visible pakets from GET /api/pakets.
 * Supports real-time search (nama_paket / kota_keberangkatan) and
 * filter by city with a horizontal chip list.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
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

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles, textStyles, emptyStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';
import { apiRequest, getStorageUrl } from '@/services/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Paket {
  id: number;
  nama_paket: string;
  kota_keberangkatan: string;
  tanggal_berangkat: string;
  durasi_hari: number;
  harga: number;
  maskapai: string;
  kuota: number;
  deskripsi: string | null;
  gambar: string | null;
  is_visible: boolean;
}

function imageUri(gambar: string | null): string | null {
  return getStorageUrl(gambar);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

function formatRupiah(amount: number): string {
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function SemuaPaketScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();
  const [pakets, setPakets]         = useState<Paket[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery]           = useState('');
  const [cityFilter, setCityFilter] = useState<string | null>(null);

  const fetchPakets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await apiRequest<{ data: Paket[] }>('/pakets');
      setPakets(res.data);
    } catch {
      setPakets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPakets(); }, [fetchPakets]);

  // Unique kota list for chips
  const cities = useMemo(() => {
    const set = new Set(pakets.map((p) => p.kota_keberangkatan));
    return Array.from(set).sort();
  }, [pakets]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = pakets;
    if (cityFilter) list = list.filter((p) => p.kota_keberangkatan === cityFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.nama_paket.toLowerCase().includes(q) ||
          p.kota_keberangkatan.toLowerCase().includes(q) ||
          (p.maskapai && p.maskapai.toLowerCase().includes(q))
      );
    }
    return list;
  }, [pakets, query, cityFilter]);

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── HEADER ── */}
      <View style={[s.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.textPrimary }]}>Semua Paket</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={[s.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} style={{ marginRight: SPACING.sm }} />
        <TextInput
          style={[s.searchInput, { color: colors.textPrimary }]}
          placeholder="Cari nama paket, kota, maskapai..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>


      {/* ── RESULTS SUMMARY ── */}
      {!loading && (
        <View style={s.resultRow}>
          <Text style={s.resultText}>
            {filtered.length} paket ditemukan
          </Text>
        </View>
      )}

      {/* ── LIST ── */}
      {loading ? (
        <View style={[layoutStyles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[textStyles.muted, { marginTop: 12 }]}>Memuat paket...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPakets(true)}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          renderItem={({ item }) => (
            <PaketCard
              paket={item}
              onPress={() => router.push(`/pakets/${item.id}` as any)}
              colors={colors}
            />
          )}
          ListEmptyComponent={
            <View style={emptyStyles.container}>
              <MaterialCommunityIcons name="mosque" size={52} color={colors.textMuted} />
              <Text style={[emptyStyles.title, { marginTop: SPACING.md, color: colors.textPrimary }]}>
                {query || cityFilter
                  ? 'Tidak ada paket sesuai pencarian'
                  : 'Belum ada paket tersedia'}
              </Text>
              <Text style={[emptyStyles.subtitle, { color: colors.textSecondary }]}>
                {query || cityFilter
                  ? 'Coba ubah kata kunci atau filter kota'
                  : 'Admin belum menambahkan paket Umrah'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// ── PaketCard ─────────────────────────────────────────────────────────────────
function PaketCard({ paket, onPress, colors }: { paket: Paket; onPress: () => void; colors: any }) {
  const imgUri = imageUri(paket.gambar);

  return (
    <TouchableOpacity style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.85}>
      {/* Image */}
      <View style={s.cardImg}>
        {imgUri ? (
          <Image source={{ uri: imgUri }} style={s.cardImgInner} />
        ) : (
          <View style={[s.cardImgPlaceholder, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="mosque" size={40} color={colors.primary} />
          </View>
        )}
        <View style={[s.badge, { backgroundColor: colors.primary }]}>
          <Text style={s.badgeText}>UMROH</Text>
        </View>
      </View>

      {/* Info */}
      <View style={s.cardBody}>
        <Text style={[s.cardName, { color: colors.textPrimary }]} numberOfLines={2}>{paket.nama_paket}</Text>

        <View style={s.metaGrid}>
          <MetaRow icon="calendar" text={formatDate(paket.tanggal_berangkat)} color={colors.textSecondary} />
          <MetaRow icon="airplane-takeoff" text={`dari ${paket.kota_keberangkatan.toUpperCase()}`} color={colors.textSecondary} />
          <MetaRow icon="clock-outline" text={`${paket.durasi_hari} Hari`} color={colors.textSecondary} />
          {paket.maskapai ? (
            <MetaRow icon="airplane" text={paket.maskapai} color={colors.textSecondary} />
          ) : null}
          <MetaRow icon="account-group" text={`Kuota ${paket.kuota} orang`} color={colors.textSecondary} />
        </View>

        <View style={s.cardFooter}>
          <Text style={[s.harga, { color: colors.primary }]}>{formatRupiah(paket.harga)}</Text>
          <View style={[s.detailBtn, { backgroundColor: colors.primaryLight }]}>
            <Text style={[s.detailBtnText, { color: colors.primary }]}>Detail</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MetaRow({ icon, text, color }: { icon: string; text: string; color?: string }) {
  return (
    <View style={s.metaRow}>
      <MaterialCommunityIcons name={icon as any} size={13} color={color || COLORS.textMuted} style={{ marginRight: 4 }} />
      <Text style={[s.metaText, color ? { color } : null]} numberOfLines={1}>{text}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn:     { padding: SPACING.xs },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    flex: 1,
    textAlign: 'center',
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    ...SHADOW.card,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
    paddingVertical: 0,
  },

  chipsRow: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText:       { color: COLORS.textSecondary, fontSize: FONT.sizeSm, fontWeight: FONT.weightMedium },
  chipTextActive: { color: COLORS.surface, fontWeight: FONT.weightBold },

  resultRow: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  resultText: {
    color: COLORS.textMuted,
    fontSize: FONT.sizeSm,
  },

  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: 32, gap: SPACING.md },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  cardImg: {
    height: 160,
    backgroundColor: COLORS.primaryLight,
    position: 'relative',
  },
  cardImgInner:      { width: '100%', height: '100%', resizeMode: 'cover' },
  cardImgPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  badgeText: { color: COLORS.surface, fontSize: 10, fontWeight: FONT.weightBlack, letterSpacing: 0.5 },

  cardBody:   { padding: SPACING.lg },
  cardName:   { color: COLORS.textPrimary, fontSize: FONT.sizeLg, fontWeight: FONT.weightBlack, marginBottom: SPACING.sm, lineHeight: 22 },

  metaGrid: { gap: 5, marginBottom: SPACING.md },
  metaRow:  { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: COLORS.textSecondary, fontSize: FONT.sizeSm, flex: 1 },

  cardFooter:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  harga:         { color: COLORS.primary, fontSize: FONT.sizeLg, fontWeight: FONT.weightBlack },
  detailBtn:     { flexDirection: 'row', alignItems: 'center', gap: 2 },
  detailBtnText: { color: COLORS.primary, fontSize: FONT.sizeSm, fontWeight: FONT.weightBold },
});
