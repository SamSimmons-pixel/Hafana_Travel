/**
 * Doa & Dzikir — Main Menu Screen
 * app/doa/index.tsx
 *
 * 2-column grid of 8 categories. Reuses globalStyles theme.
 * Fully theme-responsive (Light/Dark mode).
 */

import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  FONT, RADIUS,
  SHADOW,
  SPACING,
  layoutStyles
} from '@/components/styles';
import { useAppTheme } from '@/context/theme';
import { DOA_CATEGORIES, DoaItem } from '@/data/doaData';

interface SearchResultItem extends DoaItem {
  categoryId: string;
  categoryLabel: string;
}

export default function DoaMenuScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();
  const [query, setQuery] = useState('');

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/doa/${categoryId}` as any);
  };

  // Flatten all items across all categories for global search
  const allItems = useMemo<SearchResultItem[]>(() => {
    const list: SearchResultItem[] = [];
    DOA_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        list.push({
          ...item,
          categoryId: cat.id,
          categoryLabel: cat.label,
        });
      });
    });
    return list;
  }, []);

  // Search filter across title, category, translation, latin, heading, and body
  const searchResults = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allItems.filter((item) => {
      if (item.title.toLowerCase().includes(q)) return true;
      if (item.categoryLabel.toLowerCase().includes(q)) return true;
      if (item.sections && item.sections.length > 0) {
        return item.sections.some((sec) => {
          if (sec.heading && sec.heading.toLowerCase().includes(q)) return true;
          if (sec.latinText && sec.latinText.toLowerCase().includes(q)) return true;
          if (sec.translation && sec.translation.toLowerCase().includes(q)) return true;
          if (sec.body && sec.body.toLowerCase().includes(q)) return true;
          if (sec.arabicText && sec.arabicText.includes(q)) return true;
          return false;
        });
      }
      if (item.latin && item.latin.toLowerCase().includes(q)) return true;
      if (item.translation && item.translation.toLowerCase().includes(q)) return true;
      if (item.arabic && item.arabic.includes(q)) return true;
      return false;
    });
  }, [allItems, query]);

  const handleSearchResultPress = (item: SearchResultItem) => {
    router.push({
      pathname: '/doa/detail' as any,
      params: {
        id: item.id,
        categoryId: item.categoryId,
      },
    });
  };

  const isSearching = query.trim().length > 0;

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} accessibilityLabel="Kembali">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]}>Doa & Dzikir</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── GLOBAL SEARCH BAR ── */}
      <View style={[s.searchWrapper, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[s.searchBar, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.primary} />
          <TextInput
            style={[s.searchInput, { color: colors.textPrimary }]}
            placeholder="Cari doa dari semua kategori..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── CONTENT AREA ── */}
      {isSearching ? (
        /* ── SEARCH RESULTS LIST ── */
        <FlatList
          data={searchResults}
          keyExtractor={(item) => `${item.categoryId}-${item.id}`}
          contentContainerStyle={[s.listContent, { backgroundColor: colors.bg }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={s.searchHeader}>
              <Text style={[s.searchHeaderText, { color: colors.textMuted }]}>
                Ditemukan {searchResults.length} doa untuk "{query}"
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={[s.divider, { backgroundColor: colors.border }]} />}
          renderItem={({ item }) => {
            // Find a subtitle/preview if available
            let snippet = '';
            if (item.sections && item.sections.length > 0) {
              const firstSec = item.sections[0];
              snippet = firstSec.translation || firstSec.latinText || firstSec.body || '';
            } else if (item.translation) {
              snippet = item.translation;
            }

            return (
              <TouchableOpacity
                style={[s.searchResultItem, { backgroundColor: colors.surface }]}
                onPress={() => handleSearchResultPress(item)}
                activeOpacity={0.7}
              >
                <View style={s.searchResultContent}>
                  <View style={s.categoryBadgeRow}>
                    <View style={[s.categoryChip, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[s.categoryChipText, { color: colors.primary }]}>
                        {item.categoryLabel}
                      </Text>
                    </View>
                  </View>
                  <Text style={[s.itemTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  {snippet ? (
                    <Text style={[s.snippetText, { color: colors.textMuted }]} numberOfLines={1}>
                      {snippet}
                    </Text>
                  ) : null}
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={colors.primary}
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <MaterialCommunityIcons name="text-search" size={48} color={colors.textMuted} />
              <Text style={[s.emptyText, { color: colors.textMuted }]}>
                Tidak ditemukan doa yang sesuai dengan "{query}".
              </Text>
            </View>
          }
        />
      ) : (
        /* ── 8 CATEGORIES GRID ── */
        <ScrollView
          contentContainerStyle={[s.grid, { backgroundColor: colors.bg }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.gridRow}>
            {DOA_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleCategoryPress(cat.id)}
                activeOpacity={0.8}
              >
                <View style={[s.iconCircle, { backgroundColor: colors.primaryLight }]}>
                  {renderCategoryIcon(cat.id, cat.icon, colors.primary)}
                </View>
                <Text style={[s.cardLabel, { color: colors.textPrimary }]} numberOfLines={2}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function renderCategoryIcon(catId: string, iconName: string, primaryColor: string) {
  switch (catId) {
    case 'haji':
      return <FontAwesome5 name="kaaba" size={28} color={primaryColor} />;
    case 'shalat':
      return <MaterialCommunityIcons name="clock-time-four-outline" size={30} color={primaryColor} />;
    case 'shalat-jenazah':
      return <MaterialCommunityIcons name="grave-stone" size={30} color={primaryColor} />;
    default:
      return <MaterialCommunityIcons name={iconName as any} size={30} color={primaryColor} />;
  }
}

const CARD_GAP = SPACING.md;
const CARD_SIZE = '47%';

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
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBold,
    textAlign: 'center',
    flex: 1,
  },

  searchWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT.sizeBase,
    paddingVertical: 0,
  },

  grid: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 80,
    paddingTop: SPACING.md,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    justifyContent: 'space-between',
  },

  card: {
    width: CARD_SIZE,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    ...SHADOW.card,
    marginBottom: SPACING.xs,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
    textAlign: 'center',
    lineHeight: 18,
  },

  searchHeader: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  searchHeaderText: {
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightSemi,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  listContent: {
    paddingBottom: 80,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  searchResultContent: {
    flex: 1,
    marginRight: SPACING.sm,
    gap: 4,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: FONT.weightBold,
  },
  itemTitle: {
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightSemi,
    lineHeight: 22,
  },
  snippetText: {
    fontSize: FONT.sizeXs,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginLeft: SPACING.xl,
  },
  emptyContainer: {
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
