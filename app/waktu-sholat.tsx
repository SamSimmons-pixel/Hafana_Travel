/**
 * Waktu Sholat Screen — app/waktu-sholat.tsx
 * Hafana Umrah Travel
 *
 * Dynamic location-based prayer times (Aladhan API - Umm Al-Qura method)
 * using expo-location + real-time Saudi clock.
 */

import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
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
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';

// ── Widget Clock URL (Saudi Arabia) ──────────────────────────────────────────
const SAUDI_CLOCK_URL =
  'https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=en&size=small&timezone=Asia%2FRiyadh&show=hour_minute';

interface AddressData {
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface PrayerTimings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface HijriDateInfo {
  day: string;
  monthEn: string;
  monthAr: string;
  year: string;
  readable: string;
}

const PRAYER_LIST = [
  { key: 'Imsak',   label: 'Imsak',   icon: 'weather-night' },
  { key: 'Fajr',    label: 'Subuh',   icon: 'weather-sunset-up' },
  { key: 'Sunrise', label: 'Terbit',  icon: 'white-balance-sunny' },
  { key: 'Dhuhr',   label: 'Dzuhur',  icon: 'weather-sunny' },
  { key: 'Asr',     label: 'Ashar',   icon: 'weather-partly-cloudy' },
  { key: 'Maghrib', label: 'Maghrib', icon: 'weather-sunset-down' },
  { key: 'Isha',    label: 'Isya',    icon: 'weather-night-partly-cloudy' },
];

const buildClockHtml = (isDark: boolean) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
    }
    .clock-card {
      background: linear-gradient(135deg, #254091 0%, #172757 100%);
      border-radius: 16px;
      padding: 16px 18px;
      position: relative;
      overflow: hidden;
    }
    .clock-card::before {
      content: '';
      position: absolute;
      top: -30px; right: -30px;
      width: 120px; height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.06);
    }
    .clock-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.7);
      margin-bottom: 4px;
    }
    .clock-city {
      font-size: 15px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .clock-embed {
      background: transparent;
      border: none;
      width: 100%;
      height: 85px;
      display: block;
      filter: ${isDark ? 'invert(1) hue-rotate(180deg) saturate(0.8)' : 'invert(1) brightness(2)'};
    }
  </style>
</head>
<body>
  <div class="clock-card">
    <div class="clock-label">WAKTU SAAT INI</div>
    <div class="clock-city">🇸🇦 Makkah · Arab Saudi (AST / UTC+3)</div>
    <iframe
      class="clock-embed"
      src="${SAUDI_CLOCK_URL}"
      frameborder="0"
      scrolling="no"
      seamless
      title="Saudi Arabia Real-Time Clock"
    ></iframe>
  </div>
</body>
</html>
`;

export default function WaktuSholatScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);
  const [address, setAddress]           = useState<AddressData | null>(null);
  const [prayerTimes, setPrayerTimes]   = useState<PrayerTimings | null>(null);
  const [hijriDate, setHijriDate]       = useState<HijriDateInfo | null>(null);
  const [nextPrayerKey, setNextPrayer]  = useState<string | null>(null);

  // Fetch location and prayer times using Aladhan API with Umm Al-Qura method (method=4)
  const fetchLocationAndPrayers = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Request foreground location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      let lat = -6.2088; // Default Jakarta fallback
      let lng = 106.8456;
      let city = 'Jakarta';
      let province = 'DKI Jakarta';
      let country = 'Indonesia';

      if (status === 'granted') {
        try {
          const userLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          lat = userLocation.coords.latitude;
          lng = userLocation.coords.longitude;

          // 2. Reverse geocode
          const geoAddress = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: lng,
          });

          if (geoAddress && geoAddress.length > 0) {
            const place = geoAddress[0];
            city = place.city || place.subregion || place.district || 'Kota Anda';
            province = place.region || '';
            country = place.country || 'Indonesia';
          }
        } catch {
          // If GPS fix fails, fallback gracefully
          city = 'Lokasi Terdeteksi';
        }
      } else {
        setErrorMsg('Izin lokasi ditolak. Menampilkan estimasi waktu sholat.');
      }

      setAddress({
        city,
        province,
        country,
        latitude: lat,
        longitude: lng,
      });

      // 3. Fetch Prayer Times from AlAdhan API with Umm Al-Qura method (method=4)
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`
      );
      const json = await response.json();

      if (json.code === 200 && json.data) {
        setPrayerTimes(json.data.timings);

        if (json.data.date) {
          const hijri = json.data.date.hijri;
          setHijriDate({
            day: hijri?.day || '',
            monthEn: hijri?.month?.en || '',
            monthAr: hijri?.month?.ar || '',
            year: hijri?.year || '',
            readable: json.data.date.readable || '',
          });
        }

        determineNextPrayer(json.data.timings);
      } else {
        setErrorMsg('Gagal mengambil jadwal sholat dari server Aladhan.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan saat memuat waktu sholat. Periksa internet Anda.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Determine the next upcoming prayer time
  const determineNextPrayer = (timings: PrayerTimings) => {
    if (!timings) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const mainPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (const key of mainPrayers) {
      const timeStr = timings[key];
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        if (prayerMinutes > currentMinutes) {
          setNextPrayer(key);
          return;
        }
      }
    }
    setNextPrayer('Fajr'); // Next day Fajr
  };

  useEffect(() => {
    fetchLocationAndPrayers();
  }, []);

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} accessibilityLabel="Kembali">
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]}>Waktu Sholat</Text>
        <TouchableOpacity
          onPress={() => fetchLocationAndPrayers(true)}
          style={s.refreshBtn}
          accessibilityLabel="Perbarui Jadwal"
          disabled={loading || refreshing}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialCommunityIcons name="refresh" size={22} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── SCROLL CONTENT ── */}
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchLocationAndPrayers(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* 1. Real-time Saudi Arabia Clock Card (Kept as requested) */}
        <View style={s.clockWrapper}>
          {Platform.OS !== 'web' ? (
            <WebView
              style={s.clockWebview}
              originWhitelist={['*']}
              source={{ html: buildClockHtml(isDarkMode) }}
              scrollEnabled={false}
              javaScriptEnabled
              domStorageEnabled
            />
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #254091 0%, #172757 100%)',
              borderRadius: '16px',
              padding: '16px',
              color: '#fff',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7, marginBottom: '4px' }}>WAKTU SAAT INI</div>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px' }}>🇸🇦 Makkah · Arab Saudi (AST / UTC+3)</div>
              <iframe
                title="Saudi Clock"
                src={SAUDI_CLOCK_URL}
                style={{ width: '100%', height: '85px', border: 'none', filter: 'invert(1) brightness(2)' }}
                scrolling="no"
              />
            </div>
          )}
        </View>

        {/* 2. User Location & Hijri Date Card */}
        <View style={[s.locationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={s.locationTopRow}>
            <View style={[s.locationIconBox, { backgroundColor: colors.primaryLight }]}>
              <MaterialCommunityIcons name="map-marker-radius-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.locationTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {address ? `${address.city}${address.province ? `, ${address.province}` : ''}` : 'Mendeteksi Lokasi...'}
              </Text>
              <Text style={[s.locationSub, { color: colors.textSecondary }]}>
                {address?.country || 'Indonesia'} · <Text style={{ color: colors.primary, fontWeight: FONT.weightBold }}>Metode Umm Al-Qura</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={[s.gpsBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => fetchLocationAndPrayers(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="crosshairs-gps" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Hijri & Gregorian Date Row */}
          {hijriDate ? (
            <View style={[s.dateBanner, { backgroundColor: colors.surfaceAlt || colors.bg }]}>
              <View style={s.dateCol}>
                <Text style={[s.dateLabel, { color: colors.textMuted }]}>Kalender Hijriyah</Text>
                <Text style={[s.dateValue, { color: colors.textPrimary }]}>
                  🌙 {hijriDate.day} {hijriDate.monthEn} {hijriDate.year} H
                </Text>
              </View>
              <View style={s.dateColRight}>
                <Text style={[s.dateLabel, { color: colors.textMuted }]}>Masehi</Text>
                <Text style={[s.dateValue, { color: colors.textSecondary }]}>
                  {hijriDate.readable}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Error message notice if any */}
        {errorMsg ? (
          <View style={[s.errorBox, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#ef4444" />
            <Text style={s.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* 3. Dynamic Prayer Times List */}
        <View style={[s.prayerSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[s.prayerHeaderRow, { borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="mosque" size={18} color={colors.primary} />
              <Text style={[s.prayerSectionTitle, { color: colors.textPrimary }]}>Jadwal Waktu Sholat</Text>
            </View>
            <Text style={[s.methodBadge, { color: colors.primary, backgroundColor: colors.primaryLight }]}>
              Umm Al-Qura
            </Text>
          </View>

          {loading && !prayerTimes ? (
            <View style={s.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[s.loadingText, { color: colors.textSecondary }]}>
                Mengambil jadwal sholat untuk lokasi Anda...
              </Text>
            </View>
          ) : prayerTimes ? (
            <View style={s.prayerList}>
              {PRAYER_LIST.map((item, idx) => {
                const isNext = nextPrayerKey === item.key;
                const timeValue = prayerTimes[item.key] || '--:--';

                return (
                  <View
                    key={item.key}
                    style={[
                      s.prayerRow,
                      { borderBottomColor: colors.border },
                      idx === PRAYER_LIST.length - 1 ? { borderBottomWidth: 0 } : null,
                      isNext ? [s.nextPrayerRow, { backgroundColor: colors.primaryLight, borderColor: colors.primary }] : null,
                    ]}
                  >
                    <View style={s.prayerLeft}>
                      <View
                        style={[
                          s.prayerIconBox,
                          { backgroundColor: isNext ? colors.primary : (colors.surfaceAlt || colors.bg) },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={item.icon as any}
                          size={18}
                          color={isNext ? '#ffffff' : colors.primary}
                        />
                      </View>
                      <View>
                        <Text
                          style={[
                            s.prayerName,
                            { color: colors.textPrimary },
                            isNext ? { fontWeight: FONT.weightBlack, color: colors.primary } : null,
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={[s.prayerKeySub, { color: colors.textMuted }]}>
                          {item.key}
                        </Text>
                      </View>
                    </View>

                    <View style={s.prayerRight}>
                      {isNext ? (
                        <View style={[s.nextBadge, { backgroundColor: colors.primary }]}>
                          <Text style={s.nextBadgeText}>Berikutnya</Text>
                        </View>
                      ) : null}
                      <Text
                        style={[
                          s.prayerTime,
                          { color: colors.textPrimary },
                          isNext ? { color: colors.primary, fontSize: 18 } : null,
                        ]}
                      >
                        {timeValue}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* 4. Footer Source Note */}
        <View style={[s.footerNote, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="information-outline" size={16} color={colors.primary} />
          <Text style={[s.footerNoteText, { color: colors.textSecondary }]}>
            Jadwal sholat dihitung otomatis via <Text style={{ fontWeight: FONT.weightBold, color: colors.textPrimary }}>Aladhan API</Text> menggunakan metode <Text style={{ fontWeight: FONT.weightBold, color: colors.textPrimary }}>Umm Al-Qura University, Makkah</Text> berdasarkan koordinat GPS perangkat Anda.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

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
  refreshBtn: { padding: SPACING.xs },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
  },

  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },

  /* Clock Card */
  clockWrapper: {
    height: 155,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  clockWebview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },

  /* Location Card */
  locationCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: SPACING.md,
    ...SHADOW.card,
  },
  locationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
    letterSpacing: -0.2,
  },
  locationSub: {
    fontSize: FONT.sizeXs,
    marginTop: 2,
  },
  gpsBtn: {
    padding: SPACING.sm,
    borderRadius: RADIUS.pill,
  },

  /* Hijri Date Banner */
  dateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
  },
  dateCol: {
    flex: 1,
  },
  dateColRight: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: FONT.weightSemi,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
  },

  /* Error Box */
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: '#ef4444',
    fontSize: FONT.sizeXs,
    flex: 1,
  },

  /* Prayer Times Section */
  prayerSection: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  prayerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  prayerSectionTitle: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
  },
  methodBadge: {
    fontSize: 10,
    fontWeight: FONT.weightBold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },

  loadingContainer: {
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
  },

  prayerList: {
    paddingVertical: 2,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  nextPrayerRow: {
    borderRadius: RADIUS.md,
    marginHorizontal: 6,
    marginVertical: 3,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.md,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  prayerIconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
  },
  prayerKeySub: {
    fontSize: 11,
    marginTop: 1,
  },
  prayerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  nextBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  nextBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: FONT.weightBold,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: FONT.weightBlack,
    letterSpacing: 0.5,
  },

  /* Footer Note */
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  footerNoteText: {
    flex: 1,
    fontSize: FONT.sizeXs,
    lineHeight: 18,
  },
});
