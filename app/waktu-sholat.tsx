/**
 * Waktu Sholat (Saudi) Screen — app/waktu-sholat.tsx
 * Hafana Umrah Travel
 *
 * Prayer times widget (IslamicFinder) + real-time Saudi clock (zeitverschiebung)
 * embedded via a single react-native-webview call with a custom themed HTML page.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';

// ── Widget URLs ────────────────────────────────────────────────────────────────

const PRAYER_URL =
  'https://www.islamicfinder.org/id/prayer-widget/46527572/shafi/4/0.5/18.5/10';

const CLOCK_URL =
  'https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=en&size=small&timezone=Asia%2FRiyadh&show=hour_minute';

// ── Themed HTML page that wraps BOTH widgets ───────────────────────────────────
// Primary brand color is #254091 (from theme.ts)

const buildHtml = (isDark: boolean) => {
  const bg        = isDark ? '#1e293b' : '#ffffff';
  const surface   = isDark ? '#0f172a' : '#f2f6fa';
  const primary   = '#254091';
  const text      = isDark ? '#f8fafc' : '#1a2a3a';
  const subtext   = isDark ? '#94a3b8' : '#6b7f91';
  const border    = isDark ? '#334155' : '#dde8f0';
  const accent    = isDark ? '#1b2535' : '#eef3fb';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      width: 100%;
      background: ${bg};
      font-family: 'Inter', -apple-system, sans-serif;
      color: ${text};
      overflow-x: hidden;
      padding-bottom: 16px;
    }

    /* ── Real-time Clock Card ── */
    .clock-card {
      background: linear-gradient(135deg, ${primary} 0%, #172757 100%);
      border-radius: 16px;
      margin: 12px 12px 0;
      padding: 16px;
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
    .clock-card::after {
      content: '';
      position: absolute;
      bottom: -20px; left: 40px;
      width: 80px; height: 80px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .clock-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.65);
      margin-bottom: 4px;
    }
    .clock-city {
      font-size: 15px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .clock-embed {
      background: transparent;
      border: none;
      width: 100%;
      height: 90px;
      display: block;
      filter: ${isDark ? 'invert(1) hue-rotate(180deg) saturate(0.8)' : 'invert(1) brightness(2)'};
    }

    /* ── Divider ── */
    .divider {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 12px 0;
    }
    .divider-line { flex: 1; height: 1px; background: ${border}; }
    .divider-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: ${subtext};
      white-space: nowrap;
    }

    /* ── Prayer Widget Card ── */
    .prayer-card {
      background: ${bg};
      border-radius: 16px;
      margin: 10px 12px 0;
      overflow: hidden;
      border: 1px solid ${border};
    }
    .prayer-header {
      background: ${accent};
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid ${border};
    }
    .mosque-icon { font-size: 16px; }
    .prayer-header-text {
      font-size: 12px;
      font-weight: 700;
      color: ${primary};
      letter-spacing: 0.3px;
    }
    .prayer-method {
      margin-left: auto;
      font-size: 10px;
      color: ${subtext};
      font-weight: 600;
      background: ${border};
      padding: 2px 8px;
      border-radius: 20px;
    }
    .prayer-embed {
      width: 100%;
      height: 358px;
      border: none;
      display: block;
    }

    /* ── Source note ── */
    .source-note {
      font-size: 10px;
      color: ${subtext};
      text-align: center;
      padding: 8px 12px 0;
      letter-spacing: 0.2px;
    }
  </style>
</head>
<body>

  <!-- Real-time Saudi Clock -->
  <div class="clock-card">
    <div class="clock-label">Waktu Saat Ini</div>
    <div class="clock-city">🇸🇦 Makkah · Arab Saudi (AST/UTC+3)</div>
    <iframe
      class="clock-embed"
      src="${CLOCK_URL}"
      frameborder="0"
      scrolling="no"
      seamless
      title="Saudi Arabia Real-Time Clock"
    ></iframe>
  </div>

  <!-- Divider -->
  <div class="divider">
    <div class="divider-line"></div>
    <div class="divider-label">Jadwal Waktu Sholat</div>
    <div class="divider-line"></div>
  </div>

  <!-- Prayer Times Widget -->
  <div class="prayer-card">
    <div class="prayer-header">
      <span class="mosque-icon">🕌</span>
      <span class="prayer-header-text">Makkah Al-Mukarramah</span>
      <span class="prayer-method">Shafi'i</span>
    </div>
    <iframe
      id="iframe"
      class="prayer-embed"
      title="prayerWidget"
      scrolling="no"
      src="${PRAYER_URL}"
    ></iframe>
  </div>

  <div class="source-note">Sumber: IslamicFinder · zeitverschiebung.net</div>

</body>
</html>
`;
};

// ── Screen ────────────────────────────────────────────────────────────────────

export default function WaktuSholatScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(false);
  const [key, setKey]          = useState(0); // used to force WebView reload

  const openInBrowser = () =>
    Linking.openURL('https://www.islamicfinder.org/id/prayer-times/?city=mecca&country=Saudi+Arabia&state=').catch(() => {});

  const WEBVIEW_HEIGHT = 570; // clock (~140) + prayer widget (~358) + chrome (~72)

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
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]}>Waktu Sholat (Saudi)</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── FULL-HEIGHT BODY ── */}
      <View style={[s.body, { backgroundColor: colors.bg }]}>
        {/* Combined themed WebView */}
        <View style={[s.webviewCard, { backgroundColor: colors.surface }]}>

          {/* Loading overlay */}
          {loading && !error && (
            <View style={[s.overlay, { backgroundColor: colors.surface }]}>
              <View style={[s.loaderIconBox, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons name="clock-time-four-outline" size={36} color={colors.primary} />
              </View>
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: SPACING.md }} />
              <Text style={[s.loaderTitle, { color: colors.textPrimary }]}>Memuat Waktu Sholat</Text>
              <Text style={[s.loaderSub, { color: colors.textSecondary }]}>
                Menghubungkan ke server IslamicFinder…
              </Text>
            </View>
          )}

          {/* Error overlay */}
          {error && (
            <View style={[s.overlay, { backgroundColor: colors.surface }]}>
              <MaterialCommunityIcons name="wifi-off" size={52} color={colors.textMuted} />
              <Text style={[s.errorTitle, { color: colors.textPrimary }]}>Gagal Memuat</Text>
              <Text style={[s.errorSub, { color: colors.textSecondary }]}>
                Periksa koneksi internet lalu coba lagi.
              </Text>
              <TouchableOpacity
                style={[s.retryBtn, { backgroundColor: colors.primary }]}
                onPress={() => { setError(false); setLoading(true); setKey(k => k + 1); }}
              >
                <MaterialCommunityIcons name="refresh" size={16} color="#fff" />
                <Text style={s.retryBtnText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* WebView — native only */}
          {!error && Platform.OS !== 'web' && (
            <WebView
              key={key}
              style={[s.webview, loading ? s.invisible : null]}
              originWhitelist={['*']}
              source={{ html: buildHtml(isDarkMode), baseUrl: 'https://www.islamicfinder.org' }}
              scrollEnabled={false}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              onLoadEnd={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}

          {/* Web browser fallback */}
          {!error && Platform.OS === 'web' && (
            <div style={{ padding: '12px' }}>
              <iframe
                title="Saudi Clock"
                src={CLOCK_URL}
                style={{ width: '100%', height: 90, border: 'none', display: 'block', marginBottom: 12 }}
                scrolling="no"
              />
              <iframe
                title="Prayer Widget"
                src={PRAYER_URL}
                style={{ width: '100%', height: 358, border: 'none', display: 'block' }}
                scrolling="no"
              />
            </div>
          )}
        </View>

        {/* ── INFO FOOTER ── */}
        <View style={[s.infoRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.primary} />
          <Text style={[s.infoText, { color: colors.textSecondary }]}>
            Data dari <Text style={{ fontWeight: '700', color: colors.textPrimary }}>IslamicFinder</Text>
            {' '}· Metode <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Shafi'i</Text>
          </Text>
          <TouchableOpacity onPress={openInBrowser}>
            <MaterialCommunityIcons name="open-in-new" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
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
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
  },

  body: {
    flex: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },

  webviewCard: {
    flex: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.card,
  },

  webview: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  invisible: {
    opacity: 0,
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },

  // Loader & Error share this overlay
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    zIndex: 10,
    padding: SPACING.xxl,
  },
  loaderIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    marginTop: SPACING.xs,
  },
  loaderSub: {
    fontSize: FONT.sizeMd,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    marginTop: SPACING.sm,
  },
  errorSub: {
    fontSize: FONT.sizeMd,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: 10,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.xs,
    ...SHADOW.button,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: FONT.weightBold,
    fontSize: FONT.sizeBase,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: FONT.sizeXs,
    lineHeight: 18,
  },
});
