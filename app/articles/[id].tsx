/**
 * Artikel Detail Screen — app/articles/[id].tsx
 * Shows full article content, hero image, author, date, and share button.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles, emptyStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';
import { Article, fetchArticleById, formatIndonesianDate, getStorageUrl } from '@/services/api';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const loadDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const data = await fetchArticleById(id);
      setArticle(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\nDipublikasikan oleh ${article.author} pada ${formatIndonesianDate(article.published_at)}\n\nBacalah artikel selengkapnya di aplikasi Hafana Travel!`,
      });
    } catch {
      // Ignored
    }
  };

  const heroImageUri = getStorageUrl(article?.thumbnail_url) || article?.thumbnail_url;

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {article?.title ?? 'Detail Artikel'}
        </Text>
        <TouchableOpacity onPress={handleShare} style={s.shareBtn} disabled={!article}>
          <MaterialCommunityIcons name="share-variant-outline" size={22} color={article ? colors.primary : colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* ── BODY CONTENT ── */}
      {loading ? (
        <View style={layoutStyles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error || !article ? (
        <View style={emptyStyles.container}>
          <MaterialCommunityIcons name="alert-circle-outline" size={52} color={colors.textMuted} />
          <Text style={[emptyStyles.title, { color: colors.textPrimary, marginTop: SPACING.md }]}>
            Artikel Tidak Ditemukan
          </Text>
          <Text style={[emptyStyles.subtitle, { color: colors.textSecondary }]}>
            Gagal mengambil isi artikel dari server.
          </Text>
          <TouchableOpacity
            style={[s.retryBtn, { backgroundColor: colors.primary }]}
            onPress={loadDetail}
            activeOpacity={0.85}
          >
            <Text style={s.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          {heroImageUri ? (
            <View style={s.heroBox}>
              <Image
                source={{ uri: heroImageUri }}
                style={s.heroImage}
                resizeMode="cover"
              />
            </View>
          ) : null}

          {/* Title & Metadata */}
          <View style={s.headerBox}>
            <Text style={[s.articleTitle, { color: colors.textPrimary }]}>
              {article.title}
            </Text>

            <View style={s.metaRow}>
              <View style={s.authorTag}>
                <MaterialCommunityIcons name="account-circle-outline" size={16} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[s.metaText, { color: colors.textSecondary }]}>
                  Posted by <Text style={{ fontWeight: FONT.weightBold, color: colors.textPrimary }}>{article.author}</Text>
                </Text>
              </View>
              <Text style={[s.metaDot, { color: colors.textMuted }]}>•</Text>
              <View style={s.authorTag}>
                <MaterialCommunityIcons name="calendar-outline" size={15} color={colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={[s.metaText, { color: colors.textMuted }]}>
                  {formatIndonesianDate(article.published_at)}
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={[s.divider, { backgroundColor: colors.border }]} />

          {/* Rich Content Renderer */}
          <ArticleContentBody content={article.content} colors={colors} />

          <View style={{ height: 60 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/** Render Markdown / Rich Text Body */
function ArticleContentBody({ content, colors }: { content: string; colors: any }) {
  if (!content) return null;

  const blocks = content.split('\n\n');

  return (
    <View style={s.bodyContainer}>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Inline Image (![alt](url))
        const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          const altText = imgMatch[1];
          const rawUrl = imgMatch[2];
          const resolvedUri = getStorageUrl(rawUrl) || rawUrl;

          return (
            <View key={index} style={s.inlineImageBox}>
              <Image
                source={{ uri: resolvedUri }}
                style={s.inlineImage}
                resizeMode="cover"
              />
              {altText ? (
                <Text style={[s.imageCaption, { color: colors.textSecondary }]}>
                  {altText}
                </Text>
              ) : null}
            </View>
          );
        }

        // Headings (### or ## or #)
        if (trimmed.startsWith('#')) {
          const headingText = trimmed.replace(/^#+\s*/, '');
          return (
            <Text key={index} style={[s.headingText, { color: colors.textPrimary }]}>
              {headingText}
            </Text>
          );
        }

        // Blockquotes (> quote)
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/, '').replace(/^['"]|['"]$/g, '');
          return (
            <View key={index} style={[s.quoteBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary }]}>
              <Text style={[s.quoteText, { color: colors.textPrimary }]}>{quoteText}</Text>
            </View>
          );
        }

        // Bullet lists (* item or - item or 1. item)
        if (/^[\*\-\d\.]\s+/.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <View key={index} style={s.listContainer}>
              {lines.map((line, lIdx) => {
                const clean = line.replace(/^[\*\-\d\.]\s+/, '');
                return (
                  <View key={lIdx} style={s.bulletRow}>
                    <Text style={[s.bulletDot, { color: colors.primary }]}>•</Text>
                    <Text style={[s.paragraphText, { color: colors.textPrimary, flex: 1 }]}>
                      {formatFormattedText(clean)}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        }

        // Normal paragraph
        return (
          <Text key={index} style={[s.paragraphText, { color: colors.textPrimary }]}>
            {formatFormattedText(trimmed)}
          </Text>
        );
      })}
    </View>
  );
}

/** Helper to render bold text inside paragraphs (**bold**) */
function formatFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={idx} style={{ fontWeight: FONT.weightBold }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
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
  shareBtn: {
    padding: SPACING.xs,
  },
  appBarTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  heroBox: {
    width: '100%',
    height: 220,
    backgroundColor: '#0f172a',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerBox: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: FONT.weightBlack,
    lineHeight: 30,
    letterSpacing: -0.3,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  authorTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: FONT.sizeSm,
  },
  metaDot: {
    marginHorizontal: 4,
    fontSize: FONT.sizeSm,
  },
  divider: {
    height: 1,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  bodyContainer: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  headingText: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    marginTop: SPACING.xs,
    lineHeight: 24,
  },
  paragraphText: {
    fontSize: FONT.sizeBase,
    lineHeight: 24,
  },
  quoteBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    marginVertical: SPACING.xs,
  },
  quoteText: {
    fontSize: FONT.sizeSm + 1,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  listContainer: {
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 18,
    lineHeight: 22,
    marginRight: 8,
  },
  inlineImageBox: {
    marginVertical: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  inlineImage: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.md,
  },
  imageCaption: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    marginTop: SPACING.xs,
    fontStyle: 'italic',
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
