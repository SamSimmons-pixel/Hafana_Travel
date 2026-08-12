/**
 * Home Screen — app/(tabs)/index.tsx
 * Hafana Umrah Travel — Main Menu
 *
 * All icons use MaterialCommunityIcons (solid, single-color vector font).
 * Styles sourced from @/components/styles — edit theme.ts to retheme.
 */

import {
  COLORS, FONT,
  MENU_ICONS,
  RADIUS,
  SHADOW,
  SPACING,
  UI_ICONS,
  cardStyles,
  emptyStyles,
  layoutStyles, sectionStyles,
  textStyles,
} from '@/components/styles';
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';
import { Article, apiRequest, fetchArticles, formatIndonesianDate, getStorageUrl } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const { isDarkMode, toggleTheme, colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [loadingPakets, setLoading] = useState(true);
  const [appLogo, setAppLogo] = useState<string | null>(null);

  const [articles, setArticles]               = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articleError, setArticleError]       = useState(false);

  const loadArticles = async () => {
    setLoadingArticles(true);
    setArticleError(false);
    try {
      const res = await fetchArticles(1, 5);
      setArticles(res.data);
    } catch {
      setArticleError(true);
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [paketsRes, settingsRes] = await Promise.all([
          apiRequest<{ data: Paket[] }>('/pakets'),
          apiRequest<{ data: { app_logo: string | null } }>('/settings').catch(() => null),
        ]);
        setPakets(paketsRes.data);
        if (settingsRes?.data?.app_logo) {
          setAppLogo(getStorageUrl(settingsRes.data.app_logo));
        }
      } catch {
        setPakets([]);
      } finally {
        setLoading(false);
      }
    })();

    loadArticles();
  }, []);

  const handleMenuPress = (id: string) => {
    if (id === 'semua_paket') {
      router.push('/pakets' as any);
      return;
    }
    if (id === 'doa_dzikir') {
      router.push('/doa' as any);
      return;
    }
    if (id === 'gallery') {
      router.push('/gallery' as any);
      return;
    }
    if (id === 'khutbah') {
      router.push('/khutbah' as any);
      return;
    }
    if (id === 'waktu_sholat') {
      router.push('/waktu-sholat' as any);
      return;
    }
    if (id === 'konversi_valas') {
      router.push('/currency');
      return;
    }
    if (id === 'kiblat') {
      router.push('/kiblat' as any);
      return;
    }
    if (id === 'alquran') {
      router.push('/quran' as any);
      return;
    }
    Alert.alert('Segera Hadir', 'Fitur ini akan segera tersedia.');
  };

  const handleAvatarPress = () => {
    if (user) {
      router.push('/(tabs)/profile' as any);
    } else {
      router.push('/login');
    }
  };

  const filtered = pakets.filter(p =>
    p.nama_paket.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.kota_keberangkatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={layoutStyles.scrollContent}>

        {/* ── TOP BAR ── */}
        <View style={[s.topBar, { backgroundColor: colors.surface }]}>
          <View style={layoutStyles.row}>
            {appLogo ? (
              <Image source={{ uri: appLogo }} style={s.logoImage} />
            ) : (
              <View style={[s.logoCircle, { backgroundColor: colors.primary }]}>
                <Text style={s.logoText}>HF</Text>
              </View>
            )}
            <View style={{ marginLeft: SPACING.sm }}>
              <Text style={[s.brandName, { color: colors.textPrimary }]}>Hafana Travel</Text>
              <Text style={[s.brandSub, { color: colors.textSecondary }]}>Umrah & Haji</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {/* 🌙 Theme Toggle Button (sebelah user profile avatar) */}
            <TouchableOpacity
              onPress={toggleTheme}
              style={[s.themeToggleBtn, { backgroundColor: isDarkMode ? colors.surfaceAlt : colors.primaryLight }]}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={isDarkMode ? 'weather-sunny' : 'weather-night'}
                size={20}
                color={isDarkMode ? '#f59e0b' : colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAvatarPress} style={user ? [s.avatarBtn, { backgroundColor: colors.primary }] : [s.loginHeaderBtn, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
              {user ? (
                <Text style={s.avatarInitials}>
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'JM'}
                </Text>
              ) : (
                <View style={layoutStyles.row}>
                  <MaterialCommunityIcons name="login" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={s.loginHeaderBtnText}>Masuk</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── GREETING BANNER ── */}
        <View style={[s.greeting, { backgroundColor: isDarkMode ? '#1e293b' : colors.primaryDark }]}>
          <Text style={s.greetingHi}>Assalamu'alaikum</Text>
          <Text style={s.greetingName}>{user?.name ?? 'Jemaah'}</Text>
        </View>

        {/* ── SEARCH BAR ── */}
        <View style={[s.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons
            name={UI_ICONS.search.name}
            size={UI_ICONS.search.size}
            color={colors.textMuted}
            style={{ marginRight: SPACING.sm }}
          />
          <TextInput
            style={[s.searchInput, { color: colors.textPrimary }]}
            placeholder="Sedang cari paket apa?"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* ── MENU GRID ── */}
        <View style={[cardStyles.padded, s.menuCard, { backgroundColor: colors.surface }]}>
          <View style={s.menuGrid}>
            {MENU_ICONS.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={s.menuItem}
                onPress={() => handleMenuPress(item.id)}
                activeOpacity={0.7}
              >
                <View style={[s.menuIconBox, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={MENU_ICONS.iconSize}
                    color={colors.primary}
                  />
                </View>
                <Text style={[s.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PAKET SECTION ── */}
        <View style={{ marginTop: SPACING.xl }}>
          <View style={sectionStyles.header}>
            <Text style={[sectionStyles.title, { color: colors.textPrimary }]}>Paket</Text>
            <TouchableOpacity onPress={() => handleMenuPress('semua_paket')}>
              <Text style={[sectionStyles.link, { color: colors.primary }]}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {loadingPakets ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : filtered.length === 0 ? (
            <View style={emptyStyles.container}>
              <MaterialCommunityIcons
                name="mosque"
                size={40}
                color={colors.primary}
                style={{ marginBottom: SPACING.md }}
              />
              <Text style={[emptyStyles.title, { color: colors.textPrimary }]}>Belum ada paket tersedia</Text>
              <Text style={[emptyStyles.subtitle, { color: colors.textSecondary }]}>Admin belum menambahkan paket Umrah</Text>
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
                  style={[s.paketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push(`/pakets/${paket.id}` as any)}
                  activeOpacity={0.85}
                >
                  {/* Card Image / Placeholder */}
                  <View style={s.paketImageBox}>
                    {paket.gambar && getStorageUrl(paket.gambar) ? (
                      <Image
                        source={{ uri: getStorageUrl(paket.gambar)! }}
                        style={s.paketImage}
                      />
                    ) : (
                      <View style={[s.paketImagePlaceholder, { backgroundColor: colors.primaryLight }]}>
                        <MaterialCommunityIcons
                          name="mosque"
                          size={44}
                          color={colors.primary}
                        />
                      </View>
                    )}
                    <View style={[s.paketBadge, { backgroundColor: colors.primary }]}>
                      <Text style={s.paketBadgeText}>UMROH</Text>
                    </View>
                  </View>

                  {/* Card Info */}
                  <View style={s.paketInfo}>
                    <Text style={[s.paketNama, { color: colors.textPrimary }]} numberOfLines={2}>{paket.nama_paket}</Text>
                    <View style={{ gap: 5, marginBottom: SPACING.sm }}>
                      <View style={layoutStyles.row}>
                        <MaterialCommunityIcons
                          name={UI_ICONS.calendar.name}
                          size={UI_ICONS.calendar.size}
                          color={colors.textSecondary}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={{ color: colors.textSecondary, fontSize: FONT.sizeSm }}>Berangkat {formatDate(paket.tanggal_berangkat)}</Text>
                      </View>
                      <View style={layoutStyles.row}>
                        <MaterialCommunityIcons
                          name={UI_ICONS.flight.name}
                          size={UI_ICONS.flight.size}
                          color={colors.textSecondary}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={{ color: colors.textSecondary, fontSize: FONT.sizeSm }}>
                          Dari{' '}
                          <Text style={{ color: colors.primary, fontWeight: FONT.weightBold }}>
                            {paket.kota_keberangkatan.toUpperCase()}
                          </Text>
                        </Text>
                      </View>
                      <View style={layoutStyles.row}>
                        <MaterialCommunityIcons
                          name={UI_ICONS.clock.name}
                          size={UI_ICONS.clock.size}
                          color={colors.textSecondary}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={{ color: colors.textSecondary, fontSize: FONT.sizeSm }}>Paket {paket.durasi_hari} Hari</Text>
                      </View>
                    </View>
                    <Text style={[s.paketHarga, { color: colors.primary }]}>
                      Rp {Number(paket.harga).toLocaleString('id-ID')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* ── ARTIKEL SECTION ── */}
        <View style={{ marginHorizontal: SPACING.lg, marginTop: SPACING.xl, marginBottom: SPACING.xxl }}>
          <View style={layoutStyles.spaceBetween}>
            <Text style={[sectionStyles.title, { color: colors.textPrimary }]}>Artikel</Text>
            <TouchableOpacity onPress={() => router.push('/articles' as any)} activeOpacity={0.8}>
              <Text style={[sectionStyles.link, { color: colors.primary }]}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {loadingArticles ? (
            <View style={{ gap: SPACING.md, marginTop: SPACING.md }}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={[s.articleCardSkeleton, { backgroundColor: colors.surface, borderColor: colors.border }]} />
              ))}
            </View>
          ) : articleError ? (
            <View style={[s.articleErrorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={32} color={colors.textMuted} />
              <Text style={{ color: colors.textSecondary, fontSize: FONT.sizeSm, marginTop: 4, marginBottom: SPACING.sm }}>
                Gagal memuat artikel
              </Text>
              <TouchableOpacity
                style={[s.retryBtn, { backgroundColor: colors.primary }]}
                onPress={loadArticles}
                activeOpacity={0.85}
              >
                <Text style={s.retryBtnText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : articles.length === 0 ? (
            <Text style={{ color: colors.textMuted, marginTop: SPACING.md, fontSize: FONT.sizeSm }}>
              Belum ada artikel terbaru.
            </Text>
          ) : (
            <View style={{ gap: SPACING.md, marginTop: SPACING.md }}>
              {articles.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[s.articleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push(`/articles/${item.id}` as any)}
                  activeOpacity={0.88}
                >
                  <Image
                    source={{ uri: item.thumbnail_url }}
                    style={s.articleThumb}
                    resizeMode="cover"
                  />
                  <View style={s.articleInfo}>
                    <Text style={[s.articleTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={[s.articleAuthor, { color: colors.textMuted }]}>
                      Posted by {item.author}
                    </Text>
                    <Text style={[s.articleDate, { color: colors.textMuted }]}>
                      {formatIndonesianDate(item.published_at)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
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
  logoImage: {
    width: 44, height: 44,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  logoText: { color: COLORS.surface, fontWeight: FONT.weightBlack, fontSize: FONT.sizeMd },
  brandName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: FONT.weightBlack },
  brandSub: { color: COLORS.primary, fontSize: FONT.sizeXs, fontWeight: FONT.weightMedium },
  avatarBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitials: { color: COLORS.surface, fontWeight: FONT.weightBold, fontSize: FONT.sizeMd },
  loginHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    justifyContent: 'center', alignItems: 'center',
  },
  loginHeaderBtnText: { color: COLORS.surface, fontWeight: FONT.weightBold, fontSize: FONT.sizeSm },

  greeting: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 18,
  },
  greetingHi: { color: 'rgba(255,255,255,0.85)', fontSize: FONT.sizeMd, marginBottom: 2 },
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
  menuItem: { width: '22%', alignItems: 'center' },
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
  paketImage: { width: '100%', height: '100%', resizeMode: 'cover' },
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
  paketInfo: { padding: SPACING.md },
  paketNama: { color: COLORS.textPrimary, fontSize: FONT.sizeMd, fontWeight: FONT.weightBold, marginBottom: SPACING.sm, lineHeight: 18 },
  paketHarga: { color: COLORS.primary, fontSize: FONT.sizeBase, fontWeight: FONT.weightBlack },

  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
    ...SHADOW.card,
  },
  articleThumb: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
  },
  articleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  articleTitle: {
    fontSize: FONT.sizeSm + 1,
    fontWeight: FONT.weightBold,
    lineHeight: 19,
    marginBottom: 4,
  },
  articleAuthor: {
    fontSize: FONT.sizeXs,
    marginBottom: 2,
  },
  articleDate: {
    fontSize: FONT.sizeXs,
  },
  articleCardSkeleton: {
    height: 92,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    opacity: 0.6,
  },
  articleErrorCard: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginTop: SPACING.md,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  retryBtnText: {
    color: '#ffffff',
    fontWeight: FONT.weightBold,
    fontSize: FONT.sizeSm,
  },
});
