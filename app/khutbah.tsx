/**
 * Khutbah Jum'at Screen — app/khutbah.tsx
 * Hafana Umrah Travel
 *
 * 3-State Thematic System:
 * - State 1: Standby / Belum Ada Jadwal Siaran (Muted Slate / Cool Navy Theme)
 * - State 2: Terjadwal / Upcoming Live Stream Ditemukan (Warm Amber Gold Theme)
 * - State 3: Siaran Langsung Berlangsung + Terjemahan Indonesia (Emerald Green & Red Pulse Theme)
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
import { LARAVEL_API_URL, KhutbahLiveResponse, KhutbahLiveVideo } from '@/services/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getDeviceTimeZoneLabel(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Jakarta') || tz.includes('Bangkok') || tz.includes('Pontianak') || tz === 'Asia/Jakarta') {
      return 'WIB';
    }
    if (tz.includes('Makassar') || tz.includes('Ujung_Pandang') || tz.includes('Bali') || tz.includes('Manado') || tz.includes('Kuala_Lumpur') || tz.includes('Singapore')) {
      return 'WITA';
    }
    if (tz.includes('Jayapura')) {
      return 'WIT';
    }
    if (tz.includes('Riyadh') || tz.includes('Saudi') || tz.includes('Aden') || tz.includes('Kuwait') || tz.includes('Qatar') || tz.includes('Bahrain') || tz === 'Asia/Riyadh') {
      return 'Waktu Saudi (AST)';
    }

    const formatter = new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : (tz || 'Waktu Lokal');
  } catch {
    return 'Waktu Lokal';
  }
}

function parseScheduledDate(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d;

  const cleaned = raw.replace(/^Scheduled for\s+/i, '').replace(/^Terjadwal\s+/i, '').trim();
  const d2 = new Date(cleaned);
  if (!isNaN(d2.getTime())) return d2;

  const match = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let month = parseInt(match[1], 10) - 1;
    let day = parseInt(match[2], 10);
    let year = parseInt(match[3], 10);
    if (year < 100) year += 2000;
    let hour = parseInt(match[4], 10);
    let minute = parseInt(match[5], 10);
    const ampm = match[6]?.toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return new Date(Date.UTC(year, month, day, hour, minute));
  }

  return null;
}

function formatScheduled(raw: string | null | undefined): string {
  if (!raw) return '';
  const d = parseScheduledDate(raw);
  if (!d) return raw;

  const tzLabel = getDeviceTimeZoneLabel();
  try {
    const formatted = d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formatted} ${tzLabel}`;
  } catch {
    return raw;
  }
}


// ── Main Screen ───────────────────────────────────────────────────────────────

export default function KhutbahScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  const [selectedMosque, setSelectedMosque] = useState<'haram' | 'nabawi'>('haram');
  const [data, setData] = useState<KhutbahLiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

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
      if (json.status === 'live' || json.state_id === 3) startPulse();
    } catch (err) {
      setData({ status: 'error', state_id: 1, live: null, upcoming: [], error: String(err) });
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

  // ── Active Mosque & State Calculation ──────────────────────────────────────

  const activeMosqueName = selectedMosque === 'haram' ? 'Masjidil Haram (Makkah)' : 'Masjid Nabawi (Madinah)';
  const activeMosqueData = selectedMosque === 'haram' ? data?.masjidil_haram : data?.masjid_nabawi;

  const currentLive = activeMosqueData?.live || (data?.live && (data.live.masjid === selectedMosque || !data.live.masjid) ? data.live : null);
  const currentUpcoming = (activeMosqueData?.upcoming && activeMosqueData.upcoming.length > 0)
    ? activeMosqueData.upcoming
    : (data?.upcoming?.filter(u => u.masjid === selectedMosque || !u.masjid) ?? []);

  // Compute 3-State ID for active mosque:
  // State 3: Live stream active (Indonesian translation)
  // State 2: Upcoming stream detected on channel
  // State 1: No upcoming or live stream found (Standby)
  let activeStateId: 1 | 2 | 3 = 1;
  if (currentLive) {
    activeStateId = 3;
  } else if (currentUpcoming.length > 0) {
    activeStateId = 2;
  } else {
    activeStateId = 1;
  }

  // Active video to play in-app
  const activeVideo = currentLive || (selectedVideoId ? currentUpcoming.find(v => v.videoId === selectedVideoId) : (currentUpcoming[0] || null));
  const activePlayingId = activeVideo?.videoId || currentLive?.videoId || null;

  // ── Render State Views ─────────────────────────────────────────────────────

  // STATE 3: LIVE STREAMING BERLANGSUNG (Emerald Green & Red Pulse Theme)
  const renderState3Live = (video: KhutbahLiveVideo) => (
    <View style={[s.stateCard, s.stateCard3, { backgroundColor: isDarkMode ? '#052e16' : '#f0fdf4', borderColor: '#22c55e' }]}>
      {/* State Header Banner */}
      <View style={s.stateHeaderRow}>
        <View style={[s.statePill, { backgroundColor: '#ef4444' }]}>
          <Animated.View style={[s.liveDotWhite, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={s.statePillTextLight}>LIVE SEKARANG</Text>
        </View>
        <View style={[s.langBadge, { backgroundColor: isDarkMode ? '#14532d' : '#dcfce7' }]}>
          <Text style={[s.langBadgeText, { color: '#16a34a' }]}>🇮🇩 Bahasa Indonesia</Text>
        </View>
      </View>

      <Text style={[s.state3Title, { color: isDarkMode ? '#ffffff' : '#14532d' }]} numberOfLines={3}>
        {video.title}
      </Text>

      {/* Embedded Player */}
      <View style={[s.playerWrapper, { backgroundColor: '#000000' }]}>
        <YoutubePlayerWrapper
          height={220}
          play={playing}
          videoId={video.videoId}
          onChangeState={(state: string) => {
            if (state === 'ended') setPlaying(false);
          }}
        />
      </View>

    </View>
  );

  // STATE 2: SIARAN TERJADWAL (Warm Amber Gold Theme)
  const renderState2Upcoming = (items: KhutbahLiveVideo[]) => (
    <View style={s.state2Container}>
      {/* State Header Banner */}
      <View style={[s.stateHeaderBanner, { backgroundColor: isDarkMode ? '#451a03' : '#fef3c7', borderColor: '#f59e0b' }]}>
        <View style={s.stateHeaderRow}>
          <View style={[s.statePill, { backgroundColor: '#d97706' }]}>
            <MaterialCommunityIcons name="calendar-clock" size={14} color="#ffffff" />
            <Text style={s.statePillTextLight}>SIARAN TERJADWAL</Text>
          </View>
          <Text style={[s.stateHeaderSub, { color: isDarkMode ? '#fbbf24' : '#b45309' }]}>
            Upcoming Live
          </Text>
        </View>

        <Text style={[s.state2BannerTitle, { color: isDarkMode ? '#fef3c7' : '#92400e' }]}>
          Jadwal Siaran Khutbah Ditemukan
        </Text>
        <Text style={[s.state2BannerDesc, { color: isDarkMode ? '#fde68a' : '#78350f' }]}>
          Kanal Al-Haramain Sermons telah merilis jadwal siaran langsung untuk {activeMosqueName}. Waktu siaran otomatis disesuaikan dengan zona waktu HP Anda ({getDeviceTimeZoneLabel()}).
        </Text>
      </View>

      {/* Selected Video Player if user tapped to play upcoming/preview */}
      {selectedVideoId && activeVideo ? (
        <View style={[s.stateCard, { backgroundColor: colors.surface, borderColor: '#d97706', borderWidth: 2, marginBottom: SPACING.md }]}>
          <View style={s.stateHeaderRow}>
            <Text style={[s.videoTitle, { color: colors.textPrimary, flex: 1 }]} numberOfLines={2}>
              {activeVideo.title}
            </Text>
          </View>
          <View style={[s.playerWrapper, { backgroundColor: '#000000' }]}>
            <YoutubePlayerWrapper
              height={220}
              play={playing}
              videoId={activeVideo.videoId}
              onChangeState={(state: string) => {
                if (state === 'ended') setPlaying(false);
              }}
            />
          </View>
        </View>
      ) : null}

      <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>
        📅 Daftar Siaran Terjadwal ({items.length})
      </Text>

      {items.map((item, idx) => (
        <TouchableOpacity
          key={item.videoId + idx}
          style={[
            s.upcomingCard,
            {
              backgroundColor: colors.surface,
              borderColor: activePlayingId === item.videoId ? '#d97706' : colors.border,
              borderWidth: activePlayingId === item.videoId ? 2 : 1,
            },
          ]}
          onPress={() => {
            setSelectedVideoId(item.videoId);
            setPlaying(true);
          }}
          activeOpacity={0.8}
        >
          <View style={[s.upcomingIconBox, { backgroundColor: isDarkMode ? '#451a03' : '#fef3c7' }]}>
            <MaterialCommunityIcons
              name={activePlayingId === item.videoId ? 'play' : 'calendar-clock'}
              size={26}
              color="#d97706"
            />
          </View>
          <View style={s.upcomingInfo}>
            <Text style={[s.upcomingTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {item.title}
            </Text>
            {item.scheduledAt ? (
              <View style={s.upcomingMetaRow}>
                <MaterialCommunityIcons name="clock-outline" size={13} color="#d97706" />
                <Text style={[s.upcomingMeta, { color: isDarkMode ? '#fbbf24' : '#b45309', fontWeight: '700' }]}>
                  {' '}{formatScheduled(item.scheduledAt)}
                </Text>
              </View>
            ) : null}
            <View style={s.upcomingMetaRow}>
              <MaterialCommunityIcons name="play-circle-outline" size={13} color="#d97706" />
              <Text style={[s.upcomingMetaLink, { color: '#d97706' }]}>
                {' '}Putar di aplikasi / pasang pengingat
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );

  // STATE 1: STANDBY / BELUM ADA JADWAL SIARAN (Muted Slate / Cool Navy Theme)
  const renderState1Standby = () => (
    <View style={[s.stateCard, s.stateCard1, { backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderColor: isDarkMode ? '#334155' : '#cbd5e1' }]}>
      {/* State Header Banner */}
      <View style={s.stateHeaderRow}>
        <View style={[s.statePill, { backgroundColor: isDarkMode ? '#475569' : '#64748b' }]}>
          <MaterialCommunityIcons name="clock-outline" size={14} color="#ffffff" />
          <Text style={s.statePillTextLight}>BELUM ADA JADWAL</Text>
        </View>
        <Text style={[s.stateHeaderSub, { color: colors.textMuted }]}>Offline</Text>
      </View>

      <View style={s.state1Center}>
        <View style={[s.state1IconCircle, { backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }]}>
          <MaterialCommunityIcons name="mosque" size={44} color={isDarkMode ? '#94a3b8' : '#64748b'} />
        </View>
        <Text style={[s.state1Title, { color: colors.textPrimary }]}>
          Belum Ada Jadwal Siaran Khutbah
        </Text>
        <Text style={[s.state1Desc, { color: colors.textSecondary }]}>
          Kanal Al-Haramain Sermons belum merilis jadwal siaran langsung mendatang untuk {activeMosqueName}.
        </Text>
      </View>

      {/* Routine Schedule Guide */}
      <View style={[s.guideBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={s.guideRow}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
          <Text style={[s.guideTitle, { color: colors.textPrimary }]}>
            Informasi Waktu Pelaksanaan
          </Text>
        </View>
        <Text style={[s.guideText, { color: colors.textSecondary }]}>
          • Siaran rutin disiarkan setiap hari <Text style={{ fontWeight: '700' }}>Jum'at</Text> siang waktu Saudi (sekitar pukul <Text style={{ fontWeight: '700' }}>16:00 - 17:30 WIB</Text>).
        </Text>
        <Text style={[s.guideText, { color: colors.textSecondary }]}>
          • Jadwal siaran biasanya muncul di YouTube beberapa jam sebelum waktu sholat Jum'at dimulai.
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={s.loaderBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.loaderText, { color: colors.textSecondary }]}>
            Memeriksa status siaran langsung…
          </Text>
        </View>
      );
    }

    if (!data || data.status === 'error') {
      return (
        <View style={[s.stateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="wifi-off" size={48} color={colors.textMuted} style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={[s.state1Title, { color: colors.textPrimary, textAlign: 'center' }]}>Gagal Memuat Status</Text>
          <Text style={[s.state1Desc, { color: colors.textSecondary, textAlign: 'center' }]}>
            Periksa koneksi internet Anda lalu tekan tombol perbarui.
          </Text>
        </View>
      );
    }

    switch (activeStateId) {
      case 3:
        return (
          <>
            {currentLive ? renderState3Live(currentLive) : null}
            {currentUpcoming.length > 0 ? renderState2Upcoming(currentUpcoming) : null}
          </>
        );
      case 2:
        return renderState2Upcoming(currentUpcoming);
      case 1:
      default:
        return renderState1Standby();
    }
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
        
        {/* Right Header Buttons: YouTube Channel Redirection + Refresh */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity
            style={s.headerIconBtn}
            onPress={() => openYouTube('https://www.youtube.com/@Al-haramain-Sermons/streams')}
            activeOpacity={0.7}
            accessibilityLabel="Buka Saluran YouTube Al-Haramain"
          >
            <MaterialCommunityIcons name="youtube" size={24} color="#FF0000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.headerIconBtn}
            onPress={() => fetchLiveStatus(true)}
            disabled={refreshing || loading}
            activeOpacity={0.7}
            accessibilityLabel="Refresh data siaran"
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <MaterialCommunityIcons name="refresh" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── MOSQUE SWITCHER TABS ── */}
      <View style={[s.mosqueSwitcherContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            s.mosqueTabBtn,
            selectedMosque === 'haram' && [s.mosqueTabBtnActive, { backgroundColor: colors.primary }],
          ]}
          onPress={() => {
            setSelectedMosque('haram');
            setSelectedVideoId(null);
            setPlaying(false);
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="star-crescent"
            size={18}
            color={selectedMosque === 'haram' ? '#ffffff' : colors.textSecondary}
          />
          <Text
            style={[
              s.mosqueTabBtnText,
              { color: selectedMosque === 'haram' ? '#ffffff' : colors.textSecondary },
              selectedMosque === 'haram' && s.mosqueTabBtnTextActive,
            ]}
          >
            Masjidil Haram
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.mosqueTabBtn,
            selectedMosque === 'nabawi' && [s.mosqueTabBtnActive, { backgroundColor: colors.primary }],
          ]}
          onPress={() => {
            setSelectedMosque('nabawi');
            setSelectedVideoId(null);
            setPlaying(false);
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="mosque"
            size={18}
            color={selectedMosque === 'nabawi' ? '#ffffff' : colors.textSecondary}
          />
          <Text
            style={[
              s.mosqueTabBtnText,
              { color: selectedMosque === 'nabawi' ? '#ffffff' : colors.textSecondary },
              selectedMosque === 'nabawi' && s.mosqueTabBtnTextActive,
            ]}
          >
            Masjid Nabawi
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── 3-STATE STATUS TRACKER (Traffic Light Workflow Tracker) ── */}
      <View style={[s.trackerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={s.trackerRow}>
          {/* Step 1: Standby */}
          <View
            style={[
              s.trackerPill,
              activeStateId === 1
                ? [s.trackerPillActive, { backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderColor: '#64748b' }]
                : { backgroundColor: 'transparent', borderColor: 'transparent' },
            ]}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={13}
              color={activeStateId === 1 ? (isDarkMode ? '#ffffff' : '#334155') : colors.textMuted}
            />
            <Text
              style={[
                s.trackerPillText,
                { color: activeStateId === 1 ? (isDarkMode ? '#ffffff' : '#334155') : colors.textMuted },
                activeStateId === 1 && { fontWeight: '800' },
              ]}
            >
              1. Standby
            </Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={14} color={colors.textMuted} />

          {/* Step 2: Terjadwal */}
          <View
            style={[
              s.trackerPill,
              activeStateId === 2
                ? [s.trackerPillActive, { backgroundColor: isDarkMode ? '#451a03' : '#fef3c7', borderColor: '#d97706' }]
                : { backgroundColor: 'transparent', borderColor: 'transparent' },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-clock"
              size={13}
              color={activeStateId === 2 ? '#d97706' : colors.textMuted}
            />
            <Text
              style={[
                s.trackerPillText,
                { color: activeStateId === 2 ? '#d97706' : colors.textMuted },
                activeStateId === 2 && { fontWeight: '800' },
              ]}
            >
              2. Terjadwal
            </Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={14} color={colors.textMuted} />

          {/* Step 3: Live Now */}
          <View
            style={[
              s.trackerPill,
              activeStateId === 3
                ? [s.trackerPillActive, { backgroundColor: isDarkMode ? '#052e16' : '#dcfce7', borderColor: '#16a34a' }]
                : { backgroundColor: 'transparent', borderColor: 'transparent' },
            ]}
          >
            {activeStateId === 3 ? (
              <Animated.View style={[s.miniLiveDot, { transform: [{ scale: pulseAnim }] }]} />
            ) : (
              <MaterialCommunityIcons name="broadcast" size={13} color={colors.textMuted} />
            )}
            <Text
              style={[
                s.trackerPillText,
                { color: activeStateId === 3 ? '#16a34a' : colors.textMuted },
                activeStateId === 3 && { fontWeight: '800' },
              ]}
            >
              3. Live ID
            </Text>
          </View>
        </View>
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

        {/* Manual Refresh Button */}
        {!loading && (
          <TouchableOpacity
            style={[s.refreshBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => fetchLiveStatus(true)}
            disabled={refreshing}
            accessibilityLabel="Perbarui status siaran"
            activeOpacity={0.7}
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
  headerIconBtn: {
    padding: SPACING.xs,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mosque Switcher Tabs
  mosqueSwitcherContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
  },
  mosqueTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: 'transparent',
  },
  mosqueTabBtnActive: {
    ...SHADOW.card,
  },
  mosqueTabBtnText: {
    fontSize: FONT.sizeSm,
    fontWeight: '600',
  },
  mosqueTabBtnTextActive: {
    fontWeight: '800',
  },

  // 3-State Status Tracker Bar
  trackerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
  },
  trackerPillActive: {
    ...SHADOW.card,
  },
  trackerPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  miniLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  // Scroll Content
  scroll: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  loaderBox: {
    alignItems: 'center',
    paddingTop: 80,
    gap: SPACING.md,
  },
  loaderText: {
    fontSize: FONT.sizeMd,
    marginTop: SPACING.sm,
  },

  // State Card Base
  stateCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    ...SHADOW.card,
    marginBottom: SPACING.lg,
  },
  stateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  statePillTextLight: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stateHeaderSub: {
    fontSize: 12,
    fontWeight: '700',
  },
  langBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  langBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // State 3: Live Theme
  stateCard3: {
    borderColor: '#22c55e',
  },
  liveDotWhite: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  state3Title: {
    fontSize: FONT.sizeLg,
    fontWeight: '800',
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  playerWrapper: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    ...SHADOW.button,
  },
  mainActionBtnText: {
    color: '#ffffff',
    fontSize: FONT.sizeBase,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  secondaryActionBtnText: {
    fontSize: FONT.sizeSm,
    fontWeight: '700',
  },

  // State 2: Upcoming Theme
  state2Container: {
    gap: SPACING.md,
  },
  stateHeaderBanner: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  state2BannerTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: '800',
    marginBottom: 4,
  },
  state2BannerDesc: {
    fontSize: FONT.sizeSm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: '800',
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
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingInfo: {
    flex: 1,
    gap: 3,
  },
  upcomingTitle: {
    fontSize: FONT.sizeBase,
    fontWeight: '700',
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
    fontWeight: '600',
  },
  videoTitle: {
    fontSize: FONT.sizeBase,
    fontWeight: '700',
  },

  // State 1: Standby Theme
  stateCard1: {},
  state1Center: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  state1IconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  state1Title: {
    fontSize: FONT.sizeLg,
    fontWeight: '800',
    textAlign: 'center',
  },
  state1Desc: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },
  guideBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 6,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  guideTitle: {
    fontSize: FONT.sizeSm,
    fontWeight: '800',
  },
  guideText: {
    fontSize: FONT.sizeXs,
    lineHeight: 18,
  },

  // Bottom Refresh Button
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
    fontWeight: '700',
  },
});

