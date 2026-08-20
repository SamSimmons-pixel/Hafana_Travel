/**
 * Artikel List Screen — app/articles/index.tsx
 * Full vertical list of articles with pull-to-refresh & pagination.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useAppTheme } from '@/context/theme';
import { Article, fetchArticles, formatIndonesianDate } from '@/services/api';

export default function ArticleListScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  const [articles, setArticles]       = useState<Article[]>([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const [error, setError]             = useState(false);

  const loadArticles = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(false);

    try {
      const res = await fetchArticles(pageNum, 10);
      if (pageNum === 1) {
        setArticles(res.data);
      } else {
        setArticles((prev) => [...prev, ...res.data]);
      }
      setPage(res.meta.current_page);
      setHasMore(res.meta.has_more);
    } catch {
      setError(true);
      if (pageNum === 1) setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadArticles(1);
  }, [loadArticles]);

  const handleRefresh = () => {
    loadArticles(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadArticles(page + 1);
    }
  };

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]}>Artikel & Informasi</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── CONTENT LIST ── */}
      {loading ? (
        <View style={s.listContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[s.skeletonCard, { backgroundColor: colors.surface, borderColor: colors.border }]} />
          ))}
        </View>
      ) : error ? (
        <View style={emptyStyles.container}>
          <MaterialCommunityIcons name="alert-circle-outline" size={52} color={colors.textMuted} />
          <Text style={[emptyStyles.title, { color: colors.textPrimary, marginTop: SPACING.md }]}>
            Gagal Memuat Artikel
          </Text>
          <Text style={[emptyStyles.subtitle, { color: colors.textSecondary }]}>
            Terjadi masalah saat mengambil data dari server.
          </Text>
          <TouchableOpacity
            style={[s.retryBtn, { backgroundColor: colors.primary }]}
            onPress={() => loadArticles(1)}
            activeOpacity={0.85}
          >
            <Text style={s.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.listContainer}
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
          renderItem={({ item }) => (
            <TouchableOpacity
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
              <MaterialCommunityIcons name="newspaper-variant-outline" size={52} color={colors.textMuted} />
              <Text style={[emptyStyles.title, { color: colors.textPrimary, marginTop: SPACING.md }]}>
                Belum Ada Artikel
              </Text>
              <Text style={[emptyStyles.subtitle, { color: colors.textSecondary }]}>
                Artikel dan berita terbaru akan muncul di sini.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  appBarTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
  },
  listContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
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
    width: 84,
    height: 84,
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
  skeletonCard: {
    height: 96,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    opacity: 0.6,
  },
  retryBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
  },
  retryBtnText: {
    color: '#ffffff',
    fontWeight: FONT.weightBold,
    fontSize: FONT.sizeSm,
  },
});
