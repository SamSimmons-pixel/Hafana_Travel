/**
 * Home Screen — app/(tabs)/index.tsx
 * Hafana Umrah Travel — Main Menu
 *
 * All icons use MaterialCommunityIcons (solid, single-color vector font).
 * Styles sourced from @/components/styles — edit theme.ts to retheme.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  cardStyles, layoutStyles, sectionStyles, emptyStyles, textStyles,
  MENU_ICONS, UI_ICONS,
} from '@/components/styles';
import { apiRequest } from '@/services/api';

// ── Types ────────────────────────────────────────────────────────────────────
interface Paket {
  id: number;
  nama_paket: string;
  kota_keberangkatan: string;
  tanggal_berangkat: string;
  durasi_hari: number;
  harga: number;
  maskapai: string;
  gambar: string | null;
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [pakets, setPakets]           = useState<Paket[]>([]);
  const [loadingPakets, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ data: Paket[] }>('/pakets');
        setPakets(res.data);
      } catch {
        setPakets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMenuPress = (id: string) => {
    if (id === 'konversi_valas') {
      router.push('/currency');
      return;
    }
    if (id === 'alquran') {
      router.push('/quran' as any);
      return;
    }
    if (id === 'kiblat') {
      router.push('/kiblat' as any);
      return;
    }
    Alert.alert('Segera Hadir', 'Fitur ini akan segera tersedia.');
  };

  const handleSignOut = () =>
    Alert.alert('Keluar', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);

  const filtered = pakets.filter(p =>
    p.nama_paket.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.kota_keberangkatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={layoutStyles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={layoutStyles.scrollContent}>

        {/* ── TOP BAR ── */}
        <View style={s.topBar}>
          <View style={layoutStyles.row}>
            <View style={s.logoCircle}>
              <Text style={s.logoText}>HF</Text>
            </View>
            <View style={{ marginLeft: SPACING.sm }}>
              <Text style={s.brandName}>Hafana Travel</Text>
              <Text style={s.brandSub}>Umrah & Haji</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={s.avatarBtn}>
            <Text style={s.avatarInitials}>
              {user?.name?.substring(0, 2).toUpperCase() ?? 'US'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── GREETING BANNER ── */}
        <View style={s.greeting}>
          <Text style={s.greetingHi}>Assalamu'alaikum</Text>
          <Text style={s.greetingName}>{user?.name ?? 'Jemaah'}</Text>
        </View>

        {/* ── SEARCH BAR ── */}
        <View style={s.searchBar}>
          {/* MaterialCommunityIcons: solid magnify icon, no outline border */}
          <MaterialCommunityIcons
            name={UI_ICONS.search.name}
            size={UI_ICONS.search.size}
            color={UI_ICONS.search.color}
            style={{ marginRight: SPACING.sm }}
          />
          <TextInput
            style={s.searchInput}
            placeholder="Sedang cari paket apa?"
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* ── MENU GRID ── */}
        <View style={[cardStyles.padded, s.menuCard]}>
          <View style={s.menuGrid}>
            {MENU_ICONS.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={s.menuItem}
                onPress={() => handleMenuPress(item.id)}
                activeOpacity={0.7}
              >
                <View style={s.menuIconBox}>
                  {/* Solid single-color vector icon — no OS emoji rendering */}
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={MENU_ICONS.iconSize}
                    color={MENU_ICONS.iconColor}
                  />
                </View>
                <Text style={s.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PAKET SECTION ── */}
        <View style={{ marginTop: SPACING.xl }}>
          <View style={sectionStyles.header}>
            <Text style={sectionStyles.title}>Paket</Text>
            <TouchableOpacity onPress={() => handleMenuPress('semua_paket')}>
              <Text style={sectionStyles.link}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {loadingPakets ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
          ) : filtered.length === 0 ? (
            <View style={emptyStyles.container}>
              {/* Solid mosque icon — single color, no outline */}
              <MaterialCommunityIcons
                name={UI_ICONS.mosque.name}
                size={UI_ICONS.mosque.size}
                color={UI_ICONS.mosque.color}
                style={{ marginBottom: SPACING.md }}
              />
              <Text style={emptyStyles.title}>Belum ada paket tersedia</Text>
              <Text style={emptyStyles.subtitle}>Admin belum menambahkan paket Umrah</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.page, gap: SPACING.md }}
            >
              {filtered.map((paket) => (
                <TouchableOpacity
                  key={paket.id}
                  style={s.paketCard}
                  onPress={() => handleMenuPress('semua_paket')}
                  activeOpacity={0.85}
                >
                  {/* Card Image / Placeholder */}
                  <View style={s.paketImageBox}>
                    {paket.gambar ? (
                      <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL?.replace('/api', '')}/storage/${paket.gambar}` }}
                        style={s.paketImage}
                      />
                    ) : (
                      <View style={s.paketImagePlaceholder}>
                        {/* Solid mosque placeholder — single color vector */}
                        <MaterialCommunityIcons
                          name="mosque"
                          size={44}
                          color={COLORS.primary}
                        />
                      </View>
                    )}
                    <View style={s.paketBadge}>
                      <Text style={s.paketBadgeText}>UMROH</Text>
                    </View>
                  </View>

                  {/* Card Info */}
                  <View style={s.paketInfo}>
                    <Text style={s.paketNama} numberOfLines={2}>{paket.nama_paket}</Text>
                    <View style={{ gap: 5, marginBottom: SPACING.sm }}>
                      <View style={layoutStyles.row}>
                        <MaterialCommunityIcons
                          name={UI_ICONS.calendar.name}
                          size={UI_ICONS.calendar.size}
                          color={UI_ICONS.calendar.color}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={textStyles.muted}>Berangkat {formatDate(paket.tanggal_berangkat)}</Text>
                      </View>
                      <View style={layoutStyles.row}>
                        <MaterialCommunityIcons
                          name={UI_ICONS.flight.name}
                          size={UI_ICONS.flight.size}
                          color={UI_ICONS.flight.color}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={textStyles.muted}>
                          Dari{' '}
                          <Text style={{ color: COLORS.primary, fontWeight: FONT.weightBold }}>
                            {paket.kota_keberangkatan.toUpperCase()}
                          </Text>
                        </Text>
                      </View>
                      <View style={layoutStyles.row}>
                        <MaterialCommunityIcons
                          name={UI_ICONS.clock.name}
                          size={UI_ICONS.clock.size}
                          color={UI_ICONS.clock.color}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={textStyles.muted}>Paket {paket.durasi_hari} Hari</Text>
                      </View>
                    </View>
                    <Text style={s.paketHarga}>
                      Rp {Number(paket.harga).toLocaleString('id-ID')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return dateStr; }
}

// ── Screen-local styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  logoCircle: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  logoText:      { color: COLORS.surface, fontWeight: FONT.weightBlack, fontSize: FONT.sizeMd },
  brandName:     { color: COLORS.textPrimary, fontSize: 15, fontWeight: FONT.weightBlack },
  brandSub:      { color: COLORS.primary, fontSize: FONT.sizeXs, fontWeight: FONT.weightMedium },
  avatarBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitials: { color: COLORS.surface, fontWeight: FONT.weightBold, fontSize: FONT.sizeMd },

  greeting: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 18,
  },
  greetingHi:   { color: 'rgba(255,255,255,0.85)', fontSize: FONT.sizeMd, marginBottom: 2 },
  greetingName: { color: COLORS.surface, fontSize: 22, fontWeight: FONT.weightBlack },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    ...SHADOW.card,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.sizeBase },

  menuCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  menuItem:    { width: '22%', alignItems: 'center' },
  menuIconBox: {
    width: 58, height: 58,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  menuLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeXs,
    textAlign: 'center',
    fontWeight: FONT.weightMedium,
    lineHeight: 15,
  },

  paketCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    width: 240,
    overflow: 'hidden',
    ...SHADOW.card,
    shadowOpacity: 0.07,
    elevation: 3,
  },
  paketImageBox: {
    height: 130,
    backgroundColor: COLORS.primaryLight,
    position: 'relative',
  },
  paketImage:            { width: '100%', height: '100%', resizeMode: 'cover' },
  paketImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  paketBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm, paddingVertical: 3,
    borderRadius: SPACING.xs,
  },
  paketBadgeText: { color: COLORS.surface, fontSize: 10, fontWeight: FONT.weightBlack, letterSpacing: 0.5 },
  paketInfo:      { padding: SPACING.md },
  paketNama:      { color: COLORS.textPrimary, fontSize: FONT.sizeMd, fontWeight: FONT.weightBold, marginBottom: SPACING.sm, lineHeight: 18 },
  paketHarga:     { color: COLORS.primary, fontSize: FONT.sizeBase, fontWeight: FONT.weightBlack },
});
