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
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles, emptyStyles,
} from '@/components/styles';
import { apiRequest, getStorageUrl } from '@/services/api';
import ImageViewerModal, { GalleryItemData } from '@/components/ImageViewerModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = SPACING.lg;
const GRID_GAP = 8;
const COLUMN_COUNT = 3;
const ITEM_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

interface ApiGaleriItem {
  id: number;
  type: 'galeri' | 'testimoni';
  gambar: string;
  caption: string | null;
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

  // Tab State: 'galeri' | 'testimoni'
  const [activeTab, setActiveTab] = useState<'galeri' | 'testimoni'>('galeri');

  // Data & Pagination States
  const [items, setItems]               = useState<ApiGaleriItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(false);

  // Fullscreen Viewer State
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex]     = useState(0);

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
    []
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
    <SafeAreaView style={layoutStyles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── APP BAR (Back Arrow only, blue) ── */}
      <View style={s.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* ── HEADER TITLE & SUBTITLE ── */}
      <View style={s.headerContainer}>
        <Text style={s.headerTitle}>Galeri dan Testimoni</Text>
        <Text style={s.headerSub}>
          Berikut testimoni dan foto-foto perjalanan jamaah selama umrah
        </Text>
      </View>

      {/* ── TAB SWITCHER (Text-only state-based) ── */}
      <View style={s.tabRow}>
        <TouchableOpacity
          style={s.tabItem}
          onPress={() => handleTabChange('galeri')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, activeTab === 'galeri' && s.tabTextActive]}>
            Galeri
          </Text>
          {activeTab === 'galeri' ? <View style={s.tabUnderline} /> : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={s.tabItem}
          onPress={() => handleTabChange('testimoni')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, activeTab === 'testimoni' && s.tabTextActive]}>
            Testimoni
          </Text>
          {activeTab === 'testimoni' ? <View style={s.tabUnderline} /> : null}
        </TouchableOpacity>
      </View>

      {/* ── GRID CONTENT ── */}
      {loading ? (
        <SkeletonGrid />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={3}
          key={activeTab} // Force re-render grid layout on tab switch
          contentContainerStyle={s.gridContainer}
          columnWrapperStyle={s.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
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
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={emptyStyles.container}>
              <MaterialCommunityIcons
                name={activeTab === 'galeri' ? 'image-multiple-outline' : 'message-image-outline'}
                size={52}
                color={COLORS.textMuted}
              />
              <Text style={[emptyStyles.title, { marginTop: SPACING.md }]}>
                {activeTab === 'galeri' ? 'Belum Ada Foto Galeri' : 'Belum Ada Testimoni'}
              </Text>
              <Text style={emptyStyles.subtitle}>
                {activeTab === 'galeri'
                  ? 'Foto perjalanan jamaah akan ditampilkan di sini'
                  : 'Testimoni jamaah umrah akan ditampilkan di sini'}
              </Text>
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
