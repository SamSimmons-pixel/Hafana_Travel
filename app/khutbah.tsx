/**
 * Khutbah Jum'at Screen — app/khutbah.tsx
 * Hafana Umrah Travel
 *
 * Displays live / upcoming Al-Haramain Sermons (Indonesian) via YouTube.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import YoutubePlayerWrapper from '@/components/YoutubePlayerWrapper';
import { useFocusEffect } from '@react-navigation/native';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';
import { LARAVEL_API_URL } from '@/services/api';

// ── Types ────────────────────────────────────────────────────────────────────

interface LiveVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
  scheduledAt: string | null;
  isIndonesian: boolean;
}

interface KhutbahLiveResponse {
  status: 'live' | 'upcoming' | 'none' | 'error';
  live: LiveVideo | null;
  upcoming: LiveVideo[];
  error?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatScheduled(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }) + ' WIB';
  } catch {
    return iso;
  }
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function KhutbahScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  const [data, setData] = useState<KhutbahLiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Animation for live pulse badge
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const fetchLiveStatus = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`${LARAVEL_API_URL}/khutbah/live`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      const json: KhutbahLiveResponse = await res.json();
      setData(json);
      if (json.status === 'live') startPulse();
    } catch (err) {
      setData({ status: 'error', live: null, upcoming: [], error: String(err) });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [startPulse]);

  useFocusEffect(
    useCallback(() => {
      fetchLiveStatus(false);
      setPlaying(false);
    }, [fetchLiveStatus])
  );

  const openYouTube = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const renderLive = (video: LiveVideo) => (
    <View style={[s.liveCard, { backgroundColor: colors.surface }]}>
      {/* Live badge */}
      <View style={s.liveBadgeRow}>
        <Animated.View style={[s.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
        <Text style={s.liveBadgeText}>LIVE SEKARANG</Text>
      </View>

      {/* Title */}
      <Text style={[s.videoTitle, { color: colors.textPrimary }]} numberOfLines={3}>
        {video.title}
      </Text>

      {/* Video Player — Metro picks .native.tsx or .web.tsx automatically */}
      <View style={[s.playerWrapper, { backgroundColor: '#000' }]}>
        <YoutubePlayerWrapper
          height={220}
          play={playing}
          videoId={video.videoId}
          onChangeState={(state: string) => {
            if (state === 'ended') setPlaying(false);
          }}
        />
      </View>

      {/* Play / Watch buttons */}
      {!playing && (
        <TouchableOpacity
          style={[s.playBtn, { backgroundColor: colors.primary }]}
          onPress={() => setPlaying(true)}
          accessibilityLabel="Putar siaran langsung"
        >
          <MaterialCommunityIcons name="play-circle" size={20} color="#fff" />
          <Text style={s.playBtnText}>Putar Siaran Langsung</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[s.ytBtn, { borderColor: colors.border }]}
        onPress={() => openYouTube(video.url)}
        accessibilityLabel="Tonton di YouTube"
      >
        <MaterialCommunityIcons name="youtube" size={20} color="#FF0000" />
        <Text style={[s.ytBtnText, { color: colors.textPrimary }]}>Tonton di YouTube</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUpcoming = (items: LiveVideo[]) => (
    <View style={s.upcomingSection}>
      {/* "Not started" notice */}
      <View style={[s.notStartedBanner, { backgroundColor: colors.warningBg ?? '#fff3cd' }]}>
        <MaterialCommunityIcons name="clock-alert-outline" size={22} color={colors.warning ?? '#856404'} />
        <Text style={[s.notStartedText, { color: colors.warning ?? '#856404' }]}>
          Siaran belum dimulai. Pantau terus atau refresh halaman ini.
        </Text>
      </View>

      <Text style={[s.sectionLabel, { color: colors.textPrimary }]}>
        🕋 Jadwal Siaran Mendatang
      </Text>

      {items.map((item, idx) => (
        <TouchableOpacity
          key={item.videoId + idx}
          style={[s.upcomingCard, { backgroundColor: colors.surface }]}
          onPress={() => openYouTube(item.url)}
          activeOpacity={0.8}
          accessibilityLabel={`Jadwal siaran ${item.title}`}
        >
          <View style={[s.upcomingIconBox, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="calendar-clock" size={26} color={colors.primary} />
          </View>
          <View style={s.upcomingInfo}>
            <Text style={[s.upcomingTitle, { color: colors.textPrimary }]} numberOfLines={3}>
              {item.title}
            </Text>
            {item.scheduledAt ? (
              <View style={s.upcomingMetaRow}>
                <MaterialCommunityIcons name="clock-outline" size={13} color={colors.textSecondary} />
                <Text style={[s.upcomingMeta, { color: colors.textSecondary }]}>
                  {' '}{formatScheduled(item.scheduledAt)}
                </Text>
              </View>
            ) : null}
            <View style={s.upcomingMetaRow}>
              <MaterialCommunityIcons name="youtube" size={13} color="#FF0000" />
              <Text style={[s.upcomingMetaLink, { color: colors.primary }]}>
                {' '}Tonton di YouTube
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderNone = () => (
    <View style={[s.emptyBox, { backgroundColor: colors.surface }]}>
      <MaterialCommunityIcons name="television-off" size={52} color={colors.textMuted} />
      <Text style={[s.emptyTitle, { color: colors.textPrimary }]}>
        Belum Ada Siaran
      </Text>
      <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>
        Saat ini tidak ada siaran langsung atau jadwal siaran Khutbah Jum'at dalam Bahasa Indonesia dari Al-Haramain.
      </Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={s.loaderBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.loaderText, { color: colors.textSecondary }]}>
            Memeriksa siaran langsung…
          </Text>
        </View>
      );
    }

    if (!data || data.status === 'error') {
      return (
        <View style={[s.emptyBox, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name="wifi-off" size={52} color={colors.textMuted} />
          <Text style={[s.emptyTitle, { color: colors.textPrimary }]}>Gagal Memuat</Text>
          <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>
            Periksa koneksi internet Anda lalu tekan tombol refresh.
          </Text>
        </View>
      );
    }

    return (
      <>
        {data.status === 'live' && data.live ? renderLive(data.live) : null}
        {data.upcoming.length > 0 ? renderUpcoming(data.upcoming) : null}
        {data.status !== 'live' && data.upcoming.length === 0 ? renderNone() : null}
      </>
    );
  };

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} accessibilityLabel="Kembali">
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]}>Khutbah Jum'at</Text>
        {/* Refresh button */}
        <TouchableOpacity
          style={s.refreshHeaderBtn}
          onPress={() => fetchLiveStatus(true)}
          disabled={refreshing || loading}
          accessibilityLabel="Refresh data siaran"
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialCommunityIcons name="refresh" size={22} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── CHANNEL BANNER ── */}
      <View style={[s.channelBanner, { backgroundColor: colors.primaryLight }]}>
        <MaterialCommunityIcons name="account-voice" size={18} color={colors.primary} />
        <Text style={[s.channelBannerText, { color: colors.primary }]}>
          Al-Haramain Sermons — Siaran Langsung Indonesia
        </Text>
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchLiveStatus(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderContent()}

        {/* Manual refresh button at bottom */}
        {!loading && (
          <TouchableOpacity
            style={[s.refreshBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => fetchLiveStatus(true)}
            disabled={refreshing}
            accessibilityLabel="Perbarui status siaran"
          >
            <MaterialCommunityIcons name="refresh" size={18} color={colors.primary} />
            <Text style={[s.refreshBtnText, { color: colors.primary }]}>
              {refreshing ? 'Memperbarui…' : 'Perbarui Status Siaran'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: SPACING.xs },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
  },
  refreshHeaderBtn: {
    padding: SPACING.xs,
    width: 36,
    alignItems: 'center',
  },

  // Channel Banner
  channelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  channelBannerText: {
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightSemi,
    marginLeft: SPACING.xs,
  },

  // Scroll
  scroll: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },

  // Loader
  loaderBox: {
    alignItems: 'center',
    paddingTop: 80,
    gap: SPACING.md,
  },
  loaderText: {
    fontSize: FONT.sizeMd,
    marginTop: SPACING.sm,
  },

  // Live Card
  liveCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW.card,
    borderWidth: 2,
    borderColor: '#e53e3e',
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e53e3e',
  },
  liveBadgeText: {
    color: '#e53e3e',
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBlack,
    letterSpacing: 1,
  },
  videoTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  playerWrapper: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  webPlayerFallback: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  webPlayerFallbackText: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOW.button,
  },
  playBtnText: {
    color: '#fff',
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
  },
  ytBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  ytBtnText: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightSemi,
  },

  // Upcoming Section
  upcomingSection: {
    gap: SPACING.md,
  },
  notStartedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  notStartedText: {
    flex: 1,
    fontSize: FONT.sizeMd,
    fontWeight: FONT.weightSemi,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.xs,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOW.card,
  },
  upcomingIconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingInfo: {
    flex: 1,
    gap: 4,
  },
  upcomingTitle: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
    lineHeight: 20,
  },
  upcomingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  upcomingMeta: {
    fontSize: FONT.sizeXs,
  },
  upcomingMetaLink: {
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightSemi,
  },

  // Empty / None
  emptyBox: {
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    gap: SPACING.md,
    ...SHADOW.card,
  },
  emptyTitle: {
    fontSize: FONT.sizeXl,
    fontWeight: FONT.weightBold,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT.sizeMd,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Refresh button at bottom
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginTop: SPACING.xl,
  },
  refreshBtnText: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightSemi,
  },
});
