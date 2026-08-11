/**
 * Doa & Dzikir — Detail Screen
 * app/doa/detail.tsx
 *
 * Two render modes depending on item.type:
 *  - "doa"     → Arabic text + Latin + Indonesian translation
 *  - "article" → Rich text article (for Fiqh Haji and informational items)
 *
 * Floating accessibility button included.
 */

import React, { useMemo } from 'react';
import {
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
  layoutStyles, textStyles,
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';
import { DOA_CATEGORIES } from '@/data/doaData';

export default function DoaDetailScreen() {
  const { id, categoryId } = useLocalSearchParams<{ id: string; categoryId: string }>();
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();

  // Find the item from data
  const item = useMemo(() => {
    for (const cat of DOA_CATEGORIES) {
      const found = cat.items.find((i) => i.id === id);
      if (found) return found;
    }
    return null;
  }, [id]);

  const cat = DOA_CATEGORIES.find((c) => c.id === categoryId);

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

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {cat?.label ?? 'Detail'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── TITLE ── */}
        <Text style={[s.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>

        {item.type === 'doa' ? (
          /* ── DOA MODE ── */
          <>
            {/* Arabic Text Card */}
            <View style={[s.arabicCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[s.arabicText, { color: colors.textPrimary }]}>{item.arabic}</Text>
            </View>

            {/* Divider label */}
            <View style={s.sectionLabel}>
              <View style={[s.labelLine, { backgroundColor: colors.border }]} />
              <Text style={[s.labelText, { color: colors.textMuted }]}>Latin</Text>
              <View style={[s.labelLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Latin */}
            <View style={[s.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[s.latinText, { color: colors.textPrimary }]}>{item.latin}</Text>
            </View>

            {/* Divider label */}
            <View style={s.sectionLabel}>
              <View style={[s.labelLine, { backgroundColor: colors.border }]} />
              <Text style={[s.labelText, { color: colors.textMuted }]}>Terjemahan</Text>
              <View style={[s.labelLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Translation */}
            <View style={[s.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[s.translationText, { color: colors.textSecondary }]}>{item.translation}</Text>
            </View>
          </>
        ) : (
          /* ── ARTICLE MODE (Fiqh Haji, info) ── */
          <ArticleBody content={item.content ?? ''} colors={colors} />
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

// ── Article renderer — simple paragraph splitter + bold via ** markers ────────
function ArticleBody({ content, colors }: { content: string; colors: any }) {
  const paragraphs = content.split('\n').filter((p) => p.trim() !== '');

  return (
    <View style={a.container}>
      {paragraphs.map((para, i) => {
        const isHeading = para.startsWith('**') && para.endsWith('**');
        const isBullet  = para.startsWith('•') || para.startsWith('*') || /^\d+\./.test(para.trimStart());

        if (isHeading) {
          const text = para.replace(/\*\*/g, '');
          return (
            <Text key={i} style={[a.heading, { color: colors.textPrimary }]}>
              {text}
            </Text>
          );
        }

        return (
          <Text key={i} style={[isBullet ? a.bullet : a.body, { color: colors.textSecondary }]}>
            {renderBold(para)}
          </Text>
        );
      })}
    </View>
  );
}

/** Render **bold** markers as bold text spans */
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={{ fontWeight: '700', color: COLORS.textPrimary }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn:     { padding: SPACING.xs },
  appBarTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    flex: 1,
    textAlign: 'center',
  },

  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: 40,
  },

  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: FONT.weightBlack,
    marginBottom: SPACING.xl,
    lineHeight: 26,
  },

  arabicCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOW.card,
  },
  arabicText: {
    color: COLORS.surface,
    fontSize: 28,
    lineHeight: 52,
    textAlign: 'right',
    fontWeight: FONT.weightBold,
  },

  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  labelLine: { flex: 1, height: 1, backgroundColor: COLORS.borderLight },
  labelText: {
    color: COLORS.textMuted,
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightBold,
    letterSpacing: 0.8,
  },

  contentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOW.card,
  },
  latinText: {
    color: COLORS.primary,
    fontSize: FONT.sizeMd,
    lineHeight: 22,
    fontStyle: 'italic',
    fontWeight: FONT.weightMedium,
  },
  translationText: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
    lineHeight: 24,
  },

  // Floating accessibility button — left edge
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

const a = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.sm,
    ...SHADOW.card,
  },
  heading: {
    color: COLORS.primary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  body: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
    lineHeight: 24,
  },
  bullet: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
    lineHeight: 24,
    paddingLeft: SPACING.sm,
  },
});
