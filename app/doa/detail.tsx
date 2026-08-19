/**
 * Doa & Dzikir — Detail Screen
 * app/doa/detail.tsx
 *
 * Implements full specification for Doa Detail & Fiqh Haji:
 *  - AppBar: Back arrow (blue), Title = single-line with ellipsis, white/surface background
 *  - Type A & Fiqh Artikel: Ribbon badge (#1, #2, #3), Section Headings, Explanatory Bodies,
 *    Primary & Extra Arabic text blocks, Latin transliteration, Translation in smart quotes
 *  - Multi-section transitions, repeat notes, and dark/light mode support
 */

import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
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
  layoutStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';
import { DOA_CATEGORIES, DoaItem, DoaSection } from '@/data/doaData';

// ── Smart quotes helper ────────────────────────────────────────────────────────
function formatSmartQuotes(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith('“') && trimmed.endsWith('”'))
  ) {
    return trimmed;
  }
  return `“${trimmed}”`;
}

export default function DoaDetailScreen() {
  const { id, categoryId } = useLocalSearchParams<{ id: string; categoryId: string }>();
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  // Find the item from data
  const item = useMemo<DoaItem | null>(() => {
    for (const cat of DOA_CATEGORIES) {
      const found = cat.items.find((i) => i.id === id);
      if (found) return found;
    }
    return null;
  }, [id]);

  const cat = useMemo(() => {
    return DOA_CATEGORIES.find((c) => c.id === categoryId);
  }, [categoryId]);

  if (!item) {
    return (
      <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
        <View style={layoutStyles.centered}>
          <Text style={{ color: colors.textMuted, marginTop: 40 }}>
            Konten tidak ditemukan.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Normalize sections from item.sections or legacy item fields
  const sections: DoaSection[] = useMemo(() => {
    if (item.sections && item.sections.length > 0) {
      return item.sections;
    }
    if (item.arabic || item.latin || item.translation) {
      return [
        {
          order: 1,
          arabicText: item.arabic,
          latinText: item.latin,
          translation: item.translation,
        },
      ];
    }
    return [];
  }, [item]);

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} accessibilityLabel="Kembali">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── SCROLLABLE CONTENT BODY ── */}
      <ScrollView
        contentContainerStyle={[s.scrollContent, { backgroundColor: colors.bg }]}
        showsVerticalScrollIndicator={false}
      >
        {sections.length > 0 ? (
          /* ── STRUCTURED SECTIONS CARD (Doa & Fiqh Artikel) ── */
          <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Top item heading / subLabel if explicitly defined on item */}
            {item.heading && sections[0]?.heading !== item.heading ? (
              <Text style={[s.typeBHeading, { color: colors.textPrimary }]}>
                {item.heading}
              </Text>
            ) : null}
            {item.subLabel ? (
              <Text style={[s.typeBSubLabel, { color: colors.textMuted }]}>
                {item.subLabel}
              </Text>
            ) : null}

            {sections.map((section, idx) => {
              const isLast = idx === sections.length - 1;
              const prevSection = idx > 0 ? sections[idx - 1] : null;
              const hasPrevTransition = !!prevSection?.transitionLabel;
              const hasLatin = !!(section.latinText && section.latinText.trim().length > 0);
              const hasTranslation = !!(section.translation && section.translation.trim().length > 0);
              const hasExtraLatin = !!(section.extraLatin && section.extraLatin.trim().length > 0);
              const hasExtraTranslation = !!(section.extraTranslation && section.extraTranslation.trim().length > 0);

              return (
                <View key={`sec-${section.order}-${idx}`}>
                  {/* Divider before section if not first */}
                  {idx > 0 && !hasPrevTransition ? (
                    <View style={[s.sectionDivider, { backgroundColor: colors.border }]} />
                  ) : null}

                  {/* Transition Label between sections (e.g. "Kemudian membaca:") */}
                  {hasPrevTransition ? (
                    <>
                      <View style={[s.sectionDivider, { backgroundColor: colors.border }]} />
                      <View style={s.transitionBox}>
                        <Text style={[s.transitionLabelText, { color: colors.primary }]}>
                          {prevSection.transitionLabel}
                        </Text>
                      </View>
                    </>
                  ) : null}

                  {/* Section Content Area */}
                  <View style={s.sectionBlock}>
                    {/* 1. Badge nomor urut #1, #2, #3 — hide if preceded by transition label */}
                    {!hasPrevTransition ? (
                      <View style={s.badgeContainer}>
                        <View style={s.ribbonBadge}>
                          <Text style={s.ribbonBadgeText}>#{section.order}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Section Heading (e.g. "Rukun Haji dan Umroh", "1. Berihram", "Roml") */}
                    {section.heading ? (
                      <Text style={[s.sectionHeading, { color: colors.textPrimary }]}>
                        {section.heading}
                      </Text>
                    ) : null}

                    {/* Section Body Text (paragraphs, lists, notes) */}
                    {section.body ? (
                      <FormattedBody text={section.body} colors={colors} />
                    ) : null}

                    {/* Inline repeat note above Arabic if specified (e.g. "(3x)") */}
                    {section.repeatNote ? (
                      <View style={s.repeatNoteBox}>
                        <Text style={[s.repeatNoteText, { color: colors.primary }]}>
                          {section.repeatNote}
                        </Text>
                      </View>
                    ) : null}

                    {/* 2. Teks Arab Utama — Arabic serif besar, center-aligned, line-height lega */}
                    {section.arabicText ? (
                      <Text style={[s.arabicText, { color: colors.textPrimary }]}>
                        {section.arabicText}
                      </Text>
                    ) : null}

                    {/* 3. Baris pemisah "-" kecil abu-abu (HANYA jika ada transliterasi Latin) */}
                    {hasLatin ? (
                      <View style={s.separatorBox}>
                        <Text style={[s.dashSeparator, { color: colors.textMuted }]}>-</Text>
                      </View>
                    ) : null}

                    {/* 4. Teks transliterasi Latin (cara baca) */}
                    {hasLatin ? (
                      <Text style={[s.latinText, { color: colors.textPrimary }]}>
                        {section.latinText}
                      </Text>
                    ) : null}

                    {/* 5. Teks terjemahan Indonesia — dibungkus tanda kutip pintar " " */}
                    {hasTranslation ? (
                      <Text style={[s.translationText, { color: colors.textPrimary }]}>
                        {formatSmartQuotes(section.translation!)}
                      </Text>
                    ) : null}

                    {/* ── EXTRA ARABIC BLOCK (for sections with 2nd prayer e.g. Thowaf #1, #3, #12) ── */}
                    {section.extraArabic ? (
                      <View style={s.extraBlock}>
                        <Text style={[s.arabicText, { color: colors.textPrimary }]}>
                          {section.extraArabic}
                        </Text>

                        {hasExtraLatin ? (
                          <View style={s.separatorBox}>
                            <Text style={[s.dashSeparator, { color: colors.textMuted }]}>-</Text>
                          </View>
                        ) : null}

                        {hasExtraLatin ? (
                          <Text style={[s.latinText, { color: colors.textPrimary }]}>
                            {section.extraLatin}
                          </Text>
                        ) : null}

                        {hasExtraTranslation ? (
                          <Text style={[s.translationText, { color: colors.textPrimary }]}>
                            {formatSmartQuotes(section.extraTranslation!)}
                          </Text>
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}

            {/* Optional note at the bottom of the card */}
            {item.note ? (
              <View style={[s.noteBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
                <Text style={[s.noteText, { color: colors.textSecondary }]}>
                  {item.note}
                </Text>
              </View>
            ) : null}
          </View>
        ) : item.content ? (
          /* ── ARTICLE FALLBACK (Markdown format) ── */
          <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ArticleBody content={item.content} colors={colors} />
          </View>
        ) : (
          /* ── UNVERIFIED / EMPTY NOTE ── */
          <View style={[s.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="book-clock-outline" size={48} color={colors.primary} />
            <Text style={[s.emptyTitle, { color: colors.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[s.emptyNote, { color: colors.textSecondary }]}>
              {item.note || 'Konten bacaan sedang dalam proses verifikasi dengan sumber fiqh shahih.'}
            </Text>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Formatted Body Text (renders paragraphs, lists, and closing notes) ────────
function FormattedBody({ text, colors }: { text: string; colors: any }) {
  const paragraphs = text.split('\n\n').filter((p) => p.trim() !== '');

  return (
    <View style={s.bodyContainer}>
      {paragraphs.map((para, i) => {
        const isClosingNote =
          para.includes('Rukun umroh sampai disini') ||
          para.includes('Wajib umroh sampai disini') ||
          para.startsWith('Catatan:');

        return (
          <Text
            key={i}
            style={[
              s.sectionBodyText,
              { color: isClosingNote ? colors.primary : colors.textPrimary },
              isClosingNote && s.closingNoteText,
            ]}
          >
            {renderBold(para, colors)}
          </Text>
        );
      })}
    </View>
  );
}

// ── Article renderer for legacy markdown articles ─────────────────────────────
function ArticleBody({ content, colors }: { content: string; colors: any }) {
  const paragraphs = content.split('\n').filter((p) => p.trim() !== '');

  return (
    <View style={s.articleContainer}>
      {paragraphs.map((para, i) => {
        const isHeading = para.startsWith('**') && para.endsWith('**');
        const isBullet  = para.startsWith('•') || para.startsWith('*') || /^\d+\./.test(para.trimStart());

        if (isHeading) {
          const headingText = para.replace(/\*\*/g, '');
          return (
            <Text key={i} style={[s.articleHeading, { color: colors.primary }]}>
              {headingText}
            </Text>
          );
        }

        return (
          <Text key={i} style={[isBullet ? s.articleBullet : s.articleBody, { color: colors.textPrimary }]}>
            {renderBold(para, colors)}
          </Text>
        );
      })}
    </View>
  );
}

/** Render **bold** markers as bold text spans */
function renderBold(text: string, colors: any): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={{ fontWeight: '700', color: colors.textPrimary }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // AppBar
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
    flex: 1,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    textAlign: 'center',
    paddingHorizontal: SPACING.xs,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 40,
  },

  // Main Card
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    ...SHADOW.card,
  },

  // Badge Container & Ribbon Badge
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  ribbonBadge: {
    backgroundColor: '#29B6F6', // Vibrant cyan-blue flag/ribbon
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 0,
    alignSelf: 'flex-start',
    ...SHADOW.card,
  },
  ribbonBadgeText: {
    color: '#ffffff',
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBlack,
    letterSpacing: 0.5,
  },

  // Section Heading
  sectionHeading: {
    fontSize: 17,
    fontWeight: FONT.weightBold,
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },

  // Section Body
  bodyContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionBodyText: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: FONT.weightRegular,
  },
  closingNoteText: {
    fontStyle: 'italic',
    fontWeight: FONT.weightMedium,
    marginTop: 2,
  },

  // Repeat note (e.g. "(3x)")
  repeatNoteBox: {
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  repeatNoteText: {
    fontSize: FONT.sizeMd,
    fontWeight: FONT.weightBold,
    letterSpacing: 0.5,
  },

  // Arabic Text
  arabicText: {
    fontFamily: Platform.select({
      ios: 'Geeza Pro',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 28,
    lineHeight: 52,
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },

  // Separator '-'
  separatorBox: {
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  dashSeparator: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    lineHeight: 18,
  },

  // Latin Text
  latinText: {
    fontSize: FONT.sizeBase,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: FONT.weightRegular,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },

  // Translation Text
  translationText: {
    fontSize: FONT.sizeBase,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: FONT.weightRegular,
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },

  // Extra block for 2nd Arabic in same section
  extraBlock: {
    marginTop: SPACING.md,
    paddingTop: SPACING.xs,
  },

  // Section divider
  sectionDivider: {
    height: 1,
    width: '100%',
    marginVertical: SPACING.lg,
  },

  // Transition label
  transitionBox: {
    marginVertical: SPACING.sm,
    alignItems: 'center',
  },
  transitionLabelText: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
    textAlign: 'center',
  },

  // Type B specifics
  typeBHeading: {
    fontSize: FONT.sizeLg + 1,
    fontWeight: FONT.weightBlack,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: 4,
    lineHeight: 26,
  },
  typeBSubLabel: {
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightMedium,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },

  sectionBlock: {
    marginBottom: SPACING.xs,
  },

  // Note Box at bottom of card
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginTop: SPACING.lg,
  },
  noteText: {
    flex: 1,
    fontSize: FONT.sizeXs + 1,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // Empty / Pending card
  emptyCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    ...SHADOW.card,
  },
  emptyTitle: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    textAlign: 'center',
  },
  emptyNote: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Article styles
  articleContainer: {
    gap: SPACING.sm,
  },
  articleHeading: {
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  articleBody: {
    fontSize: FONT.sizeBase,
    lineHeight: 24,
  },
  articleBullet: {
    fontSize: FONT.sizeBase,
    lineHeight: 24,
    paddingLeft: SPACING.sm,
  },
});
