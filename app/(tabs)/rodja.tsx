/**
 * Rodja TV Screen — app/(tabs)/rodja.tsx
 * Hafana Umrah Travel — Live Streaming Kajian & Khutbah Rodja TV
 *
 * Stream Source: https://rodjatv.com/rodjatv/live.m3u8 (HLS MPEG-URL)
 * - Quota saving: Only plays when screen is focused (stops downloads on unfocus).
 * - Live-edge sync: Resuming after pause always syncs straight to the latest real-time seconds.
 * - Minimal in-video controls: Only shows Play/Pause toggle with no scrubber/timeline or native chrome.
 * - Persistent PhonePromptModal enforces phone number input before accessing if logged in.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

import { COLORS, FONT, RADIUS, SPACING, SHADOW, layoutStyles } from '@/components/styles';
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';
import { PhonePromptModal } from '@/components/PhonePromptModal';
import RodjaLogoSvg from '@/components/RodjaLogoSvg';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((width * 9) / 16);

const HLS_STREAM_URL = 'https://rodjatv.com/rodjatv/live.m3u8';

const VIDEO_PLAYER_HTML = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Rodja TV Live</title>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; user-select:none; -webkit-user-select:none; }
    body, html { width:100%; height:100%; background:#050a14; overflow:hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #container { width:100%; height:100%; display:flex; justify-content:center; align-items:center; position:relative; background:#000; cursor:pointer; }
    video { width:100%; height:100%; object-fit:contain; background:#000; pointer-events:none; }
    
    /* Top Badges */
    .top-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 20;
      pointer-events: none;
    }
    .live-badge {
      background: rgba(220, 38, 38, 0.92);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.5px;
    }
    .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
    
    .sync-badge {
      background: rgba(15, 23, 42, 0.75);
      color: #38bdf8;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    /* Center Control Overlay */
    #center-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 30;
      transition: opacity 0.25s ease;
      gap: 10px;
    }
    #center-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .ctrl-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #0284c7;
      color: #ffffff;
      border: 3px solid rgba(255, 255, 255, 0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      pointer-events: auto;
      transition: transform 0.15s ease;
    }
    .ctrl-btn:active {
      transform: scale(0.92);
    }
    .ctrl-btn svg {
      width: 30px;
      height: 30px;
      fill: #ffffff;
    }

    .status-text {
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: rgba(0, 0, 0, 0.6);
      padding: 4px 12px;
      border-radius: 999px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }
  </style>
</head>
<body>
  <div id="container" onclick="handleTap()">
    <div class="top-overlay">
      <div class="live-badge">
        <div class="live-dot"></div>
        LIVE STREAM
      </div>
      <div id="sync-info" class="sync-badge">Siaran Terkini</div>
    </div>

    <!-- Video Element without default controls/timeline -->
    <video id="video" playsinline webkit-playsinline autoplay>
      <source src="${HLS_STREAM_URL}" type="application/vnd.apple.mpegurl" />
    </video>

    <!-- Center Play/Pause Overlay -->
    <div id="center-overlay">
      <div class="ctrl-btn" id="ctrl-btn" onclick="togglePlay(event)">
        <!-- Play Icon -->
        <svg id="icon-play" viewBox="0 0 24 24" style="display:none; margin-left:3px;"><path d="M8 5v14l11-7z"/></svg>
        <!-- Pause Icon -->
        <svg id="icon-pause" viewBox="0 0 24 24" style="display:block;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </div>
      <div class="status-text" id="status-label">SIARAN BERJALAN</div>
    </div>
  </div>

  <script>
    const video = document.getElementById('video');
    const overlay = document.getElementById('center-overlay');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const statusLabel = document.getElementById('status-label');
    const src = '${HLS_STREAM_URL}';

    let hls = null;
    let hideTimer = null;
    let isPlaying = false;

    // Ensure audio is unmuted and at full volume
    function ensureUnmuted() {
      video.muted = false;
      video.volume = 1.0;
    }

    function initPlayer() {
      ensureUnmuted();

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          liveSyncDurationCount: 3,
        });
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          ensureUnmuted();
          resumeToLiveEdge();
        });

        hls.on(Hls.Events.ERROR, function(event, data) {
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', function() {
          ensureUnmuted();
          resumeToLiveEdge();
        });
      }
    }

    // Always seek to the freshest live edge when resuming
    function resumeToLiveEdge() {
      ensureUnmuted();

      if (hls) {
        hls.startLoad();
        if (hls.liveSyncPosition && Number.isFinite(hls.liveSyncPosition)) {
          video.currentTime = hls.liveSyncPosition;
        } else if (video.buffered && video.buffered.length > 0) {
          video.currentTime = video.buffered.end(video.buffered.length - 1);
        }
      } else if (video.seekable && video.seekable.length > 0) {
        video.currentTime = video.seekable.end(video.seekable.length - 1);
      }

      ensureUnmuted();
      video.play().then(() => {
        ensureUnmuted();
        setPlayingState(true);
      }).catch(err => {
        console.log('Play err:', err);
        setPlayingState(false);
      });
    }

    function pauseStream() {
      video.pause();
      if (hls) {
        hls.stopLoad(); // Stop downloading further video chunks while paused to save quota!
      }
      setPlayingState(false);
    }

    function setPlayingState(playing) {
      isPlaying = playing;
      if (playing) {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        statusLabel.textContent = 'JEDA SIARAN';
        scheduleHideOverlay();
      } else {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        statusLabel.textContent = 'LANJUTKAN SIARAN LIVE';
        overlay.classList.remove('hidden');
        clearTimeout(hideTimer);
      }
    }

    function togglePlay(e) {
      if (e) e.stopPropagation();
      ensureUnmuted();
      if (isPlaying) {
        pauseStream();
      } else {
        resumeToLiveEdge();
      }
    }

    function handleTap() {
      ensureUnmuted();
      if (!isPlaying) {
        resumeToLiveEdge();
        return;
      }

      if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        scheduleHideOverlay();
      } else {
        overlay.classList.add('hidden');
      }
    }

    function scheduleHideOverlay() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (isPlaying) {
          overlay.classList.add('hidden');
        }
      }, 2500);
    }

    video.addEventListener('play', () => {
      ensureUnmuted();
      setPlayingState(true);
    });
    video.addEventListener('playing', () => {
      ensureUnmuted();
    });
    video.addEventListener('pause', () => setPlayingState(false));

    // Audio unlock listeners on first user gesture
    function unlockAudioOnce() {
      ensureUnmuted();
      window.removeEventListener('click', unlockAudioOnce);
      window.removeEventListener('touchstart', unlockAudioOnce);
    }
    window.addEventListener('click', unlockAudioOnce, { passive: true });
    window.addEventListener('touchstart', unlockAudioOnce, { passive: true });

    document.addEventListener('DOMContentLoaded', initPlayer);

  </script>
</body>
</html>
`;

export default function RodjaScreen() {
  const { user } = useAuth();
  const { isDarkMode, colors } = useAppTheme();
  const isFocused = useIsFocused();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // If user is logged in but has no phone number, show persistent modal
  const needsPhone = Boolean(user && (!user.no_hp || user.no_hp.trim() === ''));

  // When tab loses focus, stop / reset video player to prevent background data consumption
  useEffect(() => {
    if (!isFocused) {
      setLoading(true);
      setIsFullscreen(false);
    }
  }, [isFocused]);

  const handleReload = () => {
    setLoading(true);
    setKey((prev) => prev + 1);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    webViewRef.current?.injectJavaScript(`
      if (document.getElementById('video')) {
        document.getElementById('video').muted = ${nextMuted};
      }
      true;
    `);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleOpenBrowser = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://rodja.tv');
    } catch {
      Alert.alert('Info', 'Tidak dapat membuka browser.');
    }
  };

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar
        hidden={isFullscreen}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      {/* Persistent Phone Modal if missing */}
      <PhonePromptModal
        visible={needsPhone}
        canDismiss={false}
      />

      {/* ── FULLSCREEN VIDEO MODE ── */}
      {isFullscreen && (
        <View style={s.fullscreenOverlay}>
          {isFocused ? (
            <WebView
              key={`fs-${key}`}
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: VIDEO_PLAYER_HTML, baseUrl: 'https://rodjatv.com' }}
              style={{ flex: 1, backgroundColor: '#000000' }}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              mixedContentMode="always"
            />
          ) : null}

          {/* Floating Controls in Fullscreen */}
          <View style={s.fullscreenControlBar}>
            <TouchableOpacity
              style={s.fullscreenFloatingBtn}
              onPress={toggleMute}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={isMuted ? 'volume-off' : 'volume-high'}
                size={22}
                color="#ffffff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.fullscreenFloatingBtn, { backgroundColor: '#ef4444' }]}
              onPress={toggleFullscreen}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="fullscreen-exit" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Top Bar */}
      <View style={[s.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <RodjaLogoSvg size={38} />
          <View>
            <Text style={[s.topBarTitle, { color: colors.textPrimary }]}>Rodja TV Live</Text>
            <Text style={[s.topBarSub, { color: colors.textMuted }]}>Menebar Cahaya Sunnah</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Mute Button */}
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: isMuted ? '#fee2e2' : colors.primaryLight }]}
            onPress={toggleMute}
            activeOpacity={0.7}
            accessibilityLabel={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            <MaterialCommunityIcons
              name={isMuted ? 'volume-off' : 'volume-high'}
              size={18}
              color={isMuted ? '#ef4444' : colors.primary}
            />
          </TouchableOpacity>

          {/* Fullscreen Button */}
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: colors.primaryLight }]}
            onPress={toggleFullscreen}
            activeOpacity={0.7}
            accessibilityLabel="Layar Penuh"
          >
            <MaterialCommunityIcons name="fullscreen" size={18} color={colors.primary} />
          </TouchableOpacity>

          {/* Reload Stream Button */}
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleReload}
            activeOpacity={0.7}
            accessibilityLabel="Muat Ulang Siaran"
          >
            <MaterialCommunityIcons name="reload" size={18} color={colors.primary} />
          </TouchableOpacity>

          {/* Browser Link */}
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleOpenBrowser}
            activeOpacity={0.7}
            accessibilityLabel="Buka di Browser"
          >
            <MaterialCommunityIcons name="open-in-new" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── VIDEO PLAYER BOX (Only active when screen is focused to save quota) ── */}
        <View style={[s.videoWrapper, { height: VIDEO_HEIGHT, backgroundColor: '#000000' }]}>
          {isFocused && !isFullscreen ? (
            <WebView
              key={key}
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: VIDEO_PLAYER_HTML, baseUrl: 'https://rodjatv.com' }}
              style={{ flex: 1, backgroundColor: '#000000' }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo={false}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              mixedContentMode="always"
              renderLoading={() => (
                <View style={s.loadingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={s.loadingText}>Memuat Siaran Langsung...</Text>
                </View>
              )}
            />
          ) : !isFullscreen ? (
            <View style={s.unfocusedPlaceholder}>
              <MaterialCommunityIcons name="play-circle-outline" size={48} color="#94a3b8" />
              <Text style={s.unfocusedText}>Siaran dijeda untuk menghemat kuota</Text>
            </View>
          ) : null}

          {isFocused && !isFullscreen && loading && (
            <View style={s.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={s.loadingText}>Menghubungkan ke Rodja TV Stream...</Text>
            </View>
          )}
        </View>

        {/* ── PLAYER QUICK CONTROL ROW ── */}
        <View style={[s.quickControlRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[s.quickActionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={toggleMute}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={isMuted ? 'volume-off' : 'volume-high'}
              size={18}
              color={isMuted ? '#ef4444' : colors.primary}
            />
            <Text style={[s.quickActionText, { color: isMuted ? '#ef4444' : colors.primary }]}>
              {isMuted ? 'Suara Mati' : 'Suara Nyala'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.quickActionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={toggleFullscreen}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="fullscreen" size={18} color={colors.primary} />
            <Text style={[s.quickActionText, { color: colors.primary }]}>Layar Penuh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.quickActionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleReload}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="refresh" size={18} color={colors.primary} />
            <Text style={[s.quickActionText, { color: colors.primary }]}>Sinkronkan</Text>
          </TouchableOpacity>
        </View>


        {/* ── CHANNEL INFO CARD ── */}
        <View style={[s.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={s.infoCardHeader}>
            <View style={s.badgeLive}>
              <View style={s.liveDot} />
              <Text style={s.badgeLiveText}>SIARAN LANGSUNG</Text>
            </View>
            <Text style={[s.sourceText, { color: colors.textMuted }]}>
              HLS: rodjatv.com
            </Text>
          </View>

          <Text style={[s.channelTitle, { color: colors.textPrimary }]}>
            Rodja TV — Saluran Televisi Dakwah Islam
          </Text>

          <Text style={[s.channelDesc, { color: colors.textSecondary }]}>
            Menyajikan siaran kajian Islam ilmiah, tilawah Al-Qur'an, khutbah Jum'at, bimbingan manasik, dan tanya jawab syariah bersama para asatidzah ahlussunnah wal jama'ah secara nonstop 24 jam.
          </Text>

          <View style={[s.featuresGrid, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <View style={s.featureItem}>
              <MaterialCommunityIcons name="broadcast" size={20} color={colors.primary} />
              <Text style={[s.featureLabel, { color: colors.textPrimary }]}>24 Jam Nonstop</Text>
            </View>
            <View style={s.featureItem}>
              <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
              <Text style={[s.featureLabel, { color: colors.textPrimary }]}>Kajian Sunnah</Text>
            </View>
            <View style={s.featureItem}>
              <MaterialCommunityIcons name="volume-high" size={20} color={colors.primary} />
              <Text style={[s.featureLabel, { color: colors.textPrimary }]}>Audio Jernih</Text>
            </View>
          </View>
        </View>

        {/* ── ACTION BUTTON ── */}
        <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.md }}>
          <TouchableOpacity
            style={[s.browserBtn, { backgroundColor: colors.primary }]}
            onPress={handleOpenBrowser}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="web" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={s.browserBtnText}>Kunjungi Portal Resmi Rodja.tv</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  topBarTitle: {
    fontSize: FONT.sizeMd,
    fontWeight: '800',
  },
  topBarSub: {
    fontSize: FONT.sizeXs,
    fontWeight: '500',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    width: '100%',
    position: 'relative',
  },
  unfocusedPlaceholder: {
    flex: 1,
    backgroundColor: '#0a0f1d',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  unfocusedText: {
    color: '#94a3b8',
    fontSize: FONT.sizeXs,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    zIndex: 10,
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: FONT.sizeXs,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    ...SHADOW.card,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    gap: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  badgeLiveText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '500',
  },
  channelTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: '800',
    marginBottom: 6,
  },
  channelDesc: {
    fontSize: FONT.sizeSm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  // Fullscreen Overlay
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 9999,
  },
  fullscreenControlBar: {
    position: 'absolute',
    top: 40,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10000,
  },
  fullscreenFloatingBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  // Quick Control Row
  quickControlRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  quickActionText: {
    fontSize: FONT.sizeXs,
    fontWeight: '700',
  },
  featureLabel: {
    fontSize: FONT.sizeXs,
    fontWeight: '700',
  },
  browserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    ...SHADOW.button,
  },
  browserBtnText: {
    color: '#ffffff',
    fontSize: FONT.sizeBase,
    fontWeight: '700',
  },
});




