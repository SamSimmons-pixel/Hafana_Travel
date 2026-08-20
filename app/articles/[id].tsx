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

/** Render Markdown / Rich Text / HTML Body */
function ArticleContentBody({ content, colors }: { content: string; colors: any }) {
  if (!content) return null;

  // Split content by both Markdown (![alt](url)) and HTML (<img ...>) image tags
  const imageRegex = /(!\[[^\]]*\]\s*\(\s*[^\s)]+\s*\)|<img\b[^>]*\/?>)/gi;
  const parts = content.split(imageRegex);

  return (
    <View style={s.bodyContainer}>
      {parts.map((part, index) => {
        const trimmed = part ? part.trim() : '';
        if (!trimmed) return null;

        // 1. Check if this part is a Markdown image (![alt](url))
        const mdImgMatch = trimmed.match(/^!\[([^\]]*)\]\s*\(\s*([^\s)]+)\s*\)$/i);
        if (mdImgMatch) {
          const altText = mdImgMatch[1];
          const rawUrl = mdImgMatch[2];
          const resolvedUri = getStorageUrl(rawUrl) || rawUrl;

          return (
            <View key={index} style={s.inlineImageBox}>
              <Image
                source={{ uri: resolvedUri }}
                style={s.inlineImage}
                resizeMode="contain"
              />
              {altText && altText.trim() !== 'Gambar' ? (
                <Text style={[s.imageCaption, { color: colors.textSecondary }]}>
                  {altText}
                </Text>
              ) : null}
            </View>
          );
        }

        // 2. Check if this part is an HTML image (<img src="..." alt="..." />)
        const htmlImgMatch = trimmed.match(/^<img\b[^>]*src=["']([^"']+)["'][^>]*\/?>/i);
        if (htmlImgMatch) {
          const rawUrl = htmlImgMatch[1];
          const altMatch = trimmed.match(/alt=["']([^"']*)["']/i);
          const altText = altMatch ? altMatch[1] : '';
          const resolvedUri = getStorageUrl(rawUrl) || rawUrl;

          return (
            <View key={index} style={s.inlineImageBox}>
              <Image
                source={{ uri: resolvedUri }}
                style={s.inlineImage}
                resizeMode="contain"
              />
              {altText && altText.trim() !== 'Gambar' ? (
                <Text style={[s.imageCaption, { color: colors.textSecondary }]}>
                  {altText}
                </Text>
              ) : null}
            </View>
          );
        }

        // 3. Process text blocks (either HTML or Markdown)
        // Normalize HTML block tags into clean paragraph splits if HTML is present
        let normalizedText = trimmed;
        const hasHtml = /<\/?(p|div|h[1-6]|blockquote|li|ul|ol|br)[^>]*>/i.test(normalizedText);

        if (hasHtml) {
          // Replace <br> with newline
          normalizedText = normalizedText.replace(/<br\s*\/?>/gi, '\n');
          // Replace block closing tags with double newlines
          normalizedText = normalizedText.replace(/<\/(p|div|h[1-6]|blockquote|li)>/gi, '\n\n');
          // Remove remaining opening block tags
          normalizedText = normalizedText.replace(/<(p|div|ul|ol)[^>]*>/gi, '');
        }

        const subBlocks = normalizedText.split(/\n\s*\n/);
        return (
          <React.Fragment key={index}>
            {subBlocks.map((subBlock, subIdx) => {
              const subTrimmed = subBlock.trim();
              if (!subTrimmed) return null;

              // Check for HTML headings <h2>, <h3>, <h4> or Markdown #
              const hMatch = subTrimmed.match(/^<h([1-6])[^>]*>([\s\S]*)/i);
              if (hMatch) {
                const headingContent = hMatch[2].replace(/<\/h[1-6]>/gi, '');
                return (
                  <Text key={subIdx} style={[s.headingText, { color: colors.textPrimary }]}>
                    {formatFormattedText(headingContent)}
                  </Text>
                );
              }

              if (subTrimmed.startsWith('#')) {
                const headingText = subTrimmed.replace(/^#+\s*/, '');
                return (
                  <Text key={subIdx} style={[s.headingText, { color: colors.textPrimary }]}>
                    {formatFormattedText(headingText)}
                  </Text>
                );
              }

              // Check for HTML <blockquote> or Markdown >
              if (/^<blockquote[^>]*>/i.test(subTrimmed)) {
                const quoteText = subTrimmed.replace(/<\/?blockquote[^>]*>/gi, '');
                return (
                  <View key={subIdx} style={[s.quoteBox, { backgroundColor: colors.surfaceAlt || colors.bg, borderColor: colors.primary }]}>
                    <Text style={[s.quoteText, { color: colors.textPrimary }]}>
                      {formatFormattedText(quoteText)}
                    </Text>
                  </View>
                );
              }

              if (subTrimmed.startsWith('>')) {
                const quoteText = subTrimmed.replace(/^>\s*/, '').replace(/^['"]|['"]$/g, '');
                return (
                  <View key={subIdx} style={[s.quoteBox, { backgroundColor: colors.surfaceAlt || colors.bg, borderColor: colors.primary }]}>
                    <Text style={[s.quoteText, { color: colors.textPrimary }]}>
                      {formatFormattedText(quoteText)}
                    </Text>
                  </View>
                );
              }

              // Check for HTML <li> or Markdown bullet/numbered list
              if (/<li[^>]*>/i.test(subTrimmed) || /^[\*\-\d\.]\s+/.test(subTrimmed)) {
                const lines = subTrimmed.split('\n');
                return (
                  <View key={subIdx} style={s.listContainer}>
                    {lines.map((line, lIdx) => {
                      const clean = line.replace(/<\/?li[^>]*>/gi, '').replace(/^[\*\-\d\.]\s+/, '').trim();
                      if (!clean) return null;
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
                <Text key={subIdx} style={[s.paragraphText, { color: colors.textPrimary }]}>
                  {formatFormattedText(subTrimmed)}
                </Text>
              );
            })}
          </React.Fragment>
        );
      })}
    </View>
  );
}

/** Decode HTML Entities like &nbsp;, &amp;, &quot;, &lt;, &gt;, &#39; */
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** Helper to render bold, italic, underline, font-size in both Markdown and HTML */
function formatFormattedText(text: string) {
  if (!text) return null;

  // Clean raw entities
  const decoded = decodeHtmlEntities(text);

  // Match Markdown bold/italic as well as HTML tags: <b>, <strong>, <i>, <em>, <u>, <s>, <strike>, <font ...>
  const regex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|<(?:b|strong|i|em|u|s|strike|font\b[^>]*)>[\s\S]*?<\/(?:b|strong|i|em|u|s|strike|font)>)/gi;
  const parts = decoded.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // 1. HTML <b> or <strong>
    const strongMatch = part.match(/^<(?:b|strong)>([\s\S]*?)<\/(?:b|strong)>$/i);
    if (strongMatch) {
      return (
        <Text key={idx} style={{ fontWeight: FONT.weightBold }}>
          {formatFormattedText(strongMatch[1])}
        </Text>
      );
    }

    // 2. HTML <i> or <em>
    const emMatch = part.match(/^<(?:i|em)>([\s\S]*?)<\/(?:i|em)>$/i);
    if (emMatch) {
      return (
        <Text key={idx} style={{ fontStyle: 'italic' }}>
          {formatFormattedText(emMatch[1])}
        </Text>
      );
    }

    // 3. HTML <u>
    const uMatch = part.match(/^<u>([\s\S]*?)<\/u>$/i);
    if (uMatch) {
      return (
        <Text key={idx} style={{ textDecorationLine: 'underline' }}>
          {formatFormattedText(uMatch[1])}
        </Text>
      );
    }

    // 4. HTML <s> or <strike>
    const sMatch = part.match(/^<(?:s|strike)>([\s\S]*?)<\/(?:s|strike)>$/i);
    if (sMatch) {
      return (
        <Text key={idx} style={{ textDecorationLine: 'line-through' }}>
          {formatFormattedText(sMatch[1])}
        </Text>
      );
    }

    // 5. HTML <font size="...">
    const fontMatch = part.match(/^<font\b[^>]*size=["']?(\d+)["']?[^>]*>([\s\S]*?)<\/font>$/i);
    if (fontMatch) {
      const sizeVal = parseInt(fontMatch[1], 10);
      let fontSize: number = FONT.sizeBase;
      if (sizeVal === 1) fontSize = 11;
      else if (sizeVal === 2) fontSize = 13;
      else if (sizeVal === 3) fontSize = 15;
      else if (sizeVal === 5) fontSize = 18;
      else if (sizeVal === 7) fontSize = 22;

      return (
        <Text key={idx} style={{ fontSize, lineHeight: fontSize * 1.5 }}>
          {formatFormattedText(fontMatch[2])}
        </Text>
      );
    }

    // 6. Markdown ***bold italic***
    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      return (
        <Text key={idx} style={{ fontWeight: FONT.weightBold, fontStyle: 'italic' }}>
          {part.slice(3, -3)}
        </Text>
      );
    }

    // 7. Markdown **bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <Text key={idx} style={{ fontWeight: FONT.weightBold }}>
          {part.slice(2, -2)}
        </Text>
      );
    }

    // 8. Markdown *italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <Text key={idx} style={{ fontStyle: 'italic' }}>
          {part.slice(1, -1)}
        </Text>
      );
    }

    // Strip any residual unknown html tags
    const cleanPlain = part.replace(/<[^>]+>/g, '');
    return <Text key={idx}>{cleanPlain}</Text>;
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
    alignItems: 'center',
  },
  inlineImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: 380,
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
