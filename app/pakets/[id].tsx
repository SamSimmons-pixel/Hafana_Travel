/**
 * Detail Paket — app/pakets/[id].tsx
 * Hafana Umrah Travel — Paket Detail Page
 *
 * Fetches single paket from GET /api/pakets/{id}.
 * Displays full info: hero image, nama, tanggal, durasi, maskapai, kuota, harga, deskripsi.
 */

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles, textStyles,
} from '@/components/styles';
import { apiRequest, getStorageUrl } from '@/services/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Paket {
  id: number;
  nama_paket: string;
  kota_keberangkatan: string;
  tanggal_berangkat: string;
  durasi_hari: number;
  harga: number;
  maskapai: string | null;
  kuota: number;
  deskripsi: string | null;
  gambar: string | null;
}

function imageUri(gambar: string | null): string | null {
  return getStorageUrl(gambar);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

function formatRupiah(amount: number): string {
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function DetailPaketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [paket, setPaket]   = useState<Paket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ data: Paket }>(`/pakets/${id}`);
        setPaket(res.data);
      } catch {
        Alert.alert('Error', 'Gagal memuat detail paket. Silakan coba lagi.');
        router.back();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[layoutStyles.screen, layoutStyles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[textStyles.muted, { marginTop: 12 }]}>Memuat detail paket...</Text>
      </SafeAreaView>
    );
  }

  if (!paket) return null;

  const imgUri = imageUri(paket.gambar);

  return (
    <SafeAreaView style={layoutStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── HERO IMAGE ── */}
        <View style={s.hero}>
          {imgUri ? (
            <Image source={{ uri: imgUri }} style={s.heroImage} />
          ) : (
            <View style={s.heroPlaceholder}>
              <MaterialCommunityIcons name="mosque" size={72} color={COLORS.surface} />
            </View>
          )}

          {/* Overlay gradient header */}
          <View style={s.heroOverlay}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.surface} />
            </TouchableOpacity>
            <View style={s.heroBadge}>
              <Text style={s.heroBadgeText}>UMROH</Text>
            </View>
          </View>
        </View>

        {/* ── CONTENT ── */}
        <View style={s.body}>
          {/* Title */}
          <Text style={s.title}>{paket.nama_paket}</Text>

          {/* Harga — highlighted */}
          <View style={s.hargaCard}>
            <Text style={s.hargaLabel}>Harga per Orang</Text>
            <Text style={s.hargaValue}>{formatRupiah(paket.harga)}</Text>
          </View>

          {/* Info Grid */}
          <View style={s.infoCard}>
            <InfoRow
              icon="calendar-range"
              label="Tanggal Berangkat"
              value={formatDate(paket.tanggal_berangkat)}
            />
            <Divider />
            <InfoRow
              icon="clock-outline"
              label="Durasi"
              value={`${paket.durasi_hari} Hari`}
            />
            <Divider />
            <InfoRow
              icon="airplane-takeoff"
              label="Kota Keberangkatan"
              value={paket.kota_keberangkatan}
            />
            {paket.maskapai ? (
              <>
                <Divider />
                <InfoRow
                  icon="airplane"
                  label="Maskapai"
                  value={paket.maskapai}
                />
              </>
            ) : null}
            <Divider />
            <InfoRow
              icon="account-group"
              label="Kuota"
              value={`${paket.kuota} orang`}
            />
          </View>

          {/* Deskripsi */}
          {paket.deskripsi ? (
            <View style={s.descCard}>
              <Text style={s.descTitle}>Deskripsi Paket</Text>
              <Text style={s.descText}>{paket.deskripsi}</Text>
            </View>
          ) : null}

          {/* CTA */}
          <TouchableOpacity
            style={s.ctaBtn}
            activeOpacity={0.85}
            onPress={() => {
              WebBrowser.openBrowserAsync('https://hafanatravel.com/chat');
            }}
          >
            <MaterialCommunityIcons name="phone" size={20} color={COLORS.surface} style={{ marginRight: 8 }} />
            <Text style={s.ctaBtnText}>Hubungi Agen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIconBox}>
        <MaterialCommunityIcons name={icon as any} size={18} color={COLORS.primary} />
      </View>
      <View style={s.infoText}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: COLORS.borderLight, marginLeft: 46 }} />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  hero: {
    height: 260,
    backgroundColor: COLORS.primaryLight,
    position: 'relative',
  },
  heroImage:       { width: '100%', height: '100%', resizeMode: 'cover' },
  heroPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  heroBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  heroBadgeText: { color: COLORS.surface, fontSize: FONT.sizeXs, fontWeight: FONT.weightBlack, letterSpacing: 0.8 },

  body: { padding: SPACING.xl, gap: SPACING.lg },

  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: FONT.weightBlack,
    lineHeight: 30,
  },

  hargaCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.button,
  },
  hargaLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT.sizeSm, fontWeight: FONT.weightMedium, marginBottom: 4 },
  hargaValue: { color: COLORS.surface, fontSize: 28, fontWeight: FONT.weightBlack },

  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText:  { flex: 1 },
  infoLabel: { color: COLORS.textMuted, fontSize: FONT.sizeXs, fontWeight: FONT.weightMedium, marginBottom: 2 },
  infoValue: { color: COLORS.textPrimary, fontSize: FONT.sizeBase, fontWeight: FONT.weightBold },

  descCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOW.card,
  },
  descTitle: { color: COLORS.textPrimary, fontSize: FONT.sizeLg, fontWeight: FONT.weightBlack, marginBottom: SPACING.md },
  descText:  { color: COLORS.textSecondary, fontSize: FONT.sizeBase, lineHeight: 24 },

  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    ...SHADOW.button,
  },
  ctaBtnText: { color: COLORS.surface, fontSize: FONT.sizeLg, fontWeight: FONT.weightBlack },
});
