/**
 * Galeri & Testimoni Screen — app/gallery/index.tsx
 * Hafana Umrah Travel
 *
 * Single screen with 2 state-based tabs: "Galeri" and "Testimoni".
 * 3-column grid, infinite scroll pagination, skeleton loader, empty state,
 * and reusable fullscreen image viewer modal.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
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
import * as WebBrowser from 'expo-web-browser';
import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles, emptyStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';
import { apiRequest, fetchYouTubePlaylist, getStorageUrl } from '@/services/api';
import ImageViewerModal, { GalleryItemData } from '@/components/ImageViewerModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = SPACING.lg;
const GRID_GAP = 8;
const COLUMN_COUNT = 3;
const ITEM_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

interface ApiGaleriItem {
  id: number;
  type: 'galeri' | 'testimoni';
  judul: string;
  gambar: string;
  caption?: string;
  urutan: number;
}

interface ApiPaginatedResponse {
  status: string;
  data: ApiGaleriItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    has_more: boolean;
  };
}

export default function GalleryScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  // Tab State: 'galeri' | 'testimoni'
  const [activeTab, setActiveTab] = useState<'galeri' | 'testimoni'>('galeri');

  // Data & Pagination States
  const [items, setItems]               = useState<ApiGaleriItem[]>([]);
  const [ytVideos, setYtVideos]         = useState<TestimoniVideo[]>(FALLBACK_TESTIMONI_VIDEOS);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(false);

  // Fullscreen Viewer State
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex]     = useState(0);

  // Fetch dynamic YouTube playlist videos
  const loadDynamicYouTubeVideos = useCallback(async () => {
    try {
      const data = await fetchYouTubePlaylist(PLAYLIST_ID);
      if (Array.isArray(data) && data.length > 0) {
        setYtVideos(data);
      }
    } catch {
      // Keep fallback real videos
    }
  }, []);

  // Fetch data function
  const fetchItems = useCallback(
    async (tab: 'galeri' | 'testimoni', pageNum: number, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        if (tab === 'testimoni') {
          loadDynamicYouTubeVideos();
        }

        const res = await apiRequest<ApiPaginatedResponse>(
          `/galeri?type=${tab}&page=${pageNum}&per_page=30`
        );

        if (pageNum === 1) {
          setItems(res.data);
        } else {
          setItems((prev) => [...prev, ...res.data]);
        }

        setPage(res.meta.current_page);
        setHasMore(res.meta.has_more);
      } catch {
        if (pageNum === 1) setItems([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [loadDynamicYouTubeVideos]
  );

  // Re-fetch when activeTab changes
  useEffect(() => {
    fetchItems(activeTab, 1);
  }, [activeTab, fetchItems]);

  const handleTabChange = (tab: 'galeri' | 'testimoni') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    fetchItems(activeTab, 1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchItems(activeTab, page + 1);
    }
  };

  const handleItemPress = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  // Convert items for Fullscreen Modal
  const modalItems: GalleryItemData[] = items.map((item) => ({
    id: item.id,
    imageUrl: getStorageUrl(item.gambar) || '',
    caption: item.caption,
  }));

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── APP BAR (Back Arrow only, blue) ── */}
      <View style={[s.appBar, { backgroundColor: colors.bg }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── HEADER TITLE & SUBTITLE ── */}
      <View style={s.headerContainer}>
        <Text style={[s.headerTitle, { color: colors.textPrimary }]}>Galeri dan Testimoni</Text>
        <Text style={[s.headerSub, { color: colors.textSecondary }]}>
          Berikut testimoni dan foto-foto perjalanan jamaah selama umrah
        </Text>
      </View>

      {/* ── TAB SWITCHER (Text-only state-based) ── */}
      <View style={[s.tabRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={s.tabItem}
          onPress={() => handleTabChange('galeri')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, { color: activeTab === 'galeri' ? colors.textPrimary : colors.textMuted, fontWeight: activeTab === 'galeri' ? '700' : '400' }]}>
            Galeri
          </Text>
          {activeTab === 'galeri' ? <View style={[s.tabUnderline, { backgroundColor: colors.primary }]} /> : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={s.tabItem}
          onPress={() => handleTabChange('testimoni')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, { color: activeTab === 'testimoni' ? colors.textPrimary : colors.textMuted, fontWeight: activeTab === 'testimoni' ? '700' : '400' }]}>
            Testimoni
          </Text>
          {activeTab === 'testimoni' ? <View style={[s.tabUnderline, { backgroundColor: colors.primary }]} /> : null}
        </TouchableOpacity>
      </View>

      {/* ── CONTENT (GALERI vs TESTIMONI) ── */}
      {loading ? (
        <SkeletonGrid />
      ) : activeTab === 'galeri' ? (
        /* ── GALERI TAB (3-Column Photo Grid) ── */
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={3}
          key="galeri-grid"
          contentContainerStyle={s.gridContainer}
          columnWrapperStyle={s.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={s.gridCard}
              onPress={() => handleItemPress(index)}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: getStorageUrl(item.gambar)! }}
                style={s.gridImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: SPACING.md, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={emptyStyles.container}>
              <MaterialCommunityIcons
                name="image-multiple-outline"
                size={52}
                color={colors.textMuted}
              />
              <Text style={[emptyStyles.title, { marginTop: SPACING.md, color: colors.textPrimary }]}>
                Belum Ada Foto Galeri
              </Text>
              <Text style={[emptyStyles.subtitle, { color: colors.textSecondary }]}>
                Foto perjalanan jamaah akan ditampilkan di sini
              </Text>
            </View>
          }
        />
      ) : (
        /* ── TESTIMONI TAB (3-Column Compact Video & Photo Grid) ── */
        <FlatList
          data={ytVideos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          key="testimoni-grid"
          contentContainerStyle={s.gridContainer}
          columnWrapperStyle={s.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={{ marginBottom: SPACING.sm }}>
              {/* Compact YouTube Header Banner */}
              <TouchableOpacity
                style={[yt.compactHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={openYouTubePlaylist}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="youtube" size={26} color="#ff0000" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[yt.compactTitle, { color: colors.textPrimary }]}>Playlist Testimoni YouTube</Text>
                  <Text style={[yt.compactSub, { color: colors.textSecondary }]}>Tap video untuk menonton langsung</Text>
                </View>
                <MaterialCommunityIcons name="open-in-new" size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <Text style={[s.sectionSubtitle, { color: colors.textPrimary, marginTop: SPACING.sm }]}>
                Video Testimoni ({ytVideos.length})
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <VideoGridCard video={item} />
          )}
          ListFooterComponent={
            <View style={{ marginTop: SPACING.md }}>
              {/* Photo Testimonials section if available from API */}
              {items.length > 0 && (
                <View style={{ marginBottom: SPACING.lg }}>
                  <Text style={[s.sectionSubtitle, { color: colors.textPrimary, marginBottom: SPACING.sm }]}>
                    Foto Testimoni ({items.length})
                  </Text>
                  <View style={s.photoGrid}>
                    {items.map((photo, index) => (
                      <TouchableOpacity
                        key={photo.id}
                        style={s.gridCard}
                        onPress={() => handleItemPress(index)}
                        activeOpacity={0.85}
                      >
                        <Image
                          source={{ uri: getStorageUrl(photo.gambar)! }}
                          style={s.gridImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          }
        />
      )}

      {/* ── FULLSCREEN IMAGE VIEWER MODAL ── */}
      <ImageViewerModal
        visible={viewerVisible}
        items={modalItems}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </SafeAreaView>
  );
}

const PLAYLIST_ID = 'PLFHRRlk0D7jsc9j-8ikXXXNrLLIeBO9V_';
const YOUTUBE_PLAYLIST_URL = `https://youtube.com/playlist?list=${PLAYLIST_ID}&si=iFOc6wO-dQWr5qqU`;

export interface TestimoniVideo {
  id: string;
  videoId: string;
  title: string;
  duration: string;
  tag: string;
  thumbnail: string;
}

// Verified live video IDs extracted directly from Hafana's YouTube Playlist
const FALLBACK_TESTIMONI_VIDEOS: TestimoniVideo[] = [
  { id: '1',  videoId: '-7LY9-xcLH8', title: 'Testimoni Jamaah Hafana #1', duration: '03:45', tag: 'Sunnah', thumbnail: 'https://i.ytimg.com/vi/-7LY9-xcLH8/hqdefault.jpg' },
  { id: '2',  videoId: '0k8jn9Tn8Cs', title: 'Testimoni Jamaah Hafana #2', duration: '04:12', tag: 'Kesan', thumbnail: 'https://i.ytimg.com/vi/0k8jn9Tn8Cs/hqdefault.jpg' },
  { id: '3',  videoId: 'Ehwp8PAZN_w', title: 'Testimoni Jamaah Hafana #3', duration: '05:01', tag: 'Hotel', thumbnail: 'https://i.ytimg.com/vi/Ehwp8PAZN_w/hqdefault.jpg' },
  { id: '4',  videoId: 'ijV3Mvre3TA', title: 'Testimoni Jamaah Hafana #4', duration: '03:30', tag: 'Ramadhan', thumbnail: 'https://i.ytimg.com/vi/ijV3Mvre3TA/hqdefault.jpg' },
  { id: '5',  videoId: 'KL9GCd0hUbU', title: 'Testimoni Jamaah Hafana #5', duration: '04:20', tag: 'VIP', thumbnail: 'https://i.ytimg.com/vi/KL9GCd0hUbU/hqdefault.jpg' },
  { id: '6',  videoId: 'Jpc2ZT3GgyE', title: 'Testimoni Jamaah Hafana #6', duration: '02:55', tag: 'Lansia', thumbnail: 'https://i.ytimg.com/vi/Jpc2ZT3GgyE/hqdefault.jpg' },
  { id: '7',  videoId: 'ydaM2ZIco9o', title: 'Testimoni Jamaah Hafana #7', duration: '04:10', tag: 'Syawal', thumbnail: 'https://i.ytimg.com/vi/ydaM2ZIco9o/hqdefault.jpg' },
  { id: '8',  videoId: 'A-m1UeCtf0k', title: 'Testimoni Jamaah Hafana #8', duration: '05:15', tag: 'Akhir Tahun', thumbnail: 'https://i.ytimg.com/vi/A-m1UeCtf0k/hqdefault.jpg' },
  { id: '9',  videoId: 'Gkq4xPSn-rQ', title: 'Testimoni Jamaah Hafana #9', duration: '03:50', tag: 'Madinah', thumbnail: 'https://i.ytimg.com/vi/Gkq4xPSn-rQ/hqdefault.jpg' },
  { id: '10', videoId: 'k1Td3SZo7dw', title: 'Testimoni Jamaah Hafana #10', duration: '04:05', tag: 'Makkah', thumbnail: 'https://i.ytimg.com/vi/k1Td3SZo7dw/hqdefault.jpg' },
  { id: '11', videoId: 'mz5tFN4HT7k', title: 'Testimoni Jamaah Hafana #11', duration: '04:45', tag: 'Manasik', thumbnail: 'https://i.ytimg.com/vi/mz5tFN4HT7k/hqdefault.jpg' },
  { id: '12', videoId: 'LcL1El5CZFA', title: 'Testimoni Jamaah Hafana #12', duration: '03:10', tag: 'Kesan', thumbnail: 'https://i.ytimg.com/vi/LcL1El5CZFA/hqdefault.jpg' },
];

async function openYouTubeVideo(videoId: string) {
  const url = `https://www.youtube.com/watch?v=${videoId}&list=${PLAYLIST_ID}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  } catch {
    await WebBrowser.openBrowserAsync(url);
  }
}

async function openYouTubePlaylist() {
  try {
    const supported = await Linking.canOpenURL(YOUTUBE_PLAYLIST_URL);
    if (supported) {
      await Linking.openURL(YOUTUBE_PLAYLIST_URL);
    } else {
      await WebBrowser.openBrowserAsync(YOUTUBE_PLAYLIST_URL);
    }
  } catch {
    await WebBrowser.openBrowserAsync(YOUTUBE_PLAYLIST_URL);
  }
}

function VideoGridCard({ video }: { video: TestimoniVideo }) {
  const [thumbUri, setThumbUri] = useState(
    video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
  );

  useEffect(() => {
    setThumbUri(video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`);
  }, [video.thumbnail, video.videoId]);

  return (
    <TouchableOpacity
      style={s.gridCard}
      onPress={() => openYouTubeVideo(video.videoId)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: thumbUri }}
        style={s.gridImage}
        resizeMode="cover"
        onError={() => {
          if (thumbUri.includes('hqdefault')) {
            setThumbUri(`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`);
          } else if (thumbUri.includes('mqdefault')) {
            setThumbUri(`https://i.ytimg.com/vi/${video.videoId}/default.jpg`);
          }
        }}
      />
      <View style={s.videoOverlay}>
        <View style={s.miniPlayCircle}>
          <MaterialCommunityIcons name="play" size={18} color="#ffffff" style={{ marginLeft: 2 }} />
        </View>
        {video.duration ? (
          <View style={s.miniDurationBadge}>
            <Text style={s.miniDurationText}>{video.duration}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

/** Skeleton Placeholder Grid while loading */
function SkeletonGrid() {
  const skeletons = Array.from({ length: 9 });
  return (
    <View style={s.gridContainer}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
        {skeletons.map((_, i) => (
          <View key={i} style={s.skeletonItem} />
        ))}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  appBar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  backBtn: {
    padding: SPACING.xs,
    alignSelf: 'flex-start',
  },

  headerContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: FONT.weightBlack,
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  headerSub: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeSm,
    lineHeight: 18,
  },

  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.xl,
    marginBottom: SPACING.md,
  },
  tabItem: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightRegular,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: FONT.weightBlack,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
  },

  gridContainer: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },

  gridCard: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceAlt,
    ...SHADOW.card,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },

  skeletonItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: RADIUS.md,
    backgroundColor: '#e2e8f0',
  },

  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPlayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  miniDurationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  miniDurationText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: FONT.weightBold,
  },

  testimoniListContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  sectionSubtitle: {
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.xs,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },

  // Floating accessibility button — pinned to left edge
  floatingBtn: {
    position: 'absolute',
    left: 0,
    top: '50%',
    zIndex: 99,
  },
  floatingBtnInner: {
    backgroundColor: 'rgba(180,190,200,0.75)',
    paddingVertical: 12,
    paddingLeft: 8,
    paddingRight: 6,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});

const yt = StyleSheet.create({
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.xs,
    ...SHADOW.card,
  },
  compactTitle: {
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
  },
  compactSub: {
    fontSize: FONT.sizeXs,
  },
  morePlaylistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    ...SHADOW.button,
  },
  morePlaylistText: {
    color: '#ff0000',
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
    flex: 1,
  },
});
