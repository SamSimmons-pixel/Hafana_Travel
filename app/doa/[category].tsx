/**
 * Doa & Dzikir — Category List Screen (Reusable)
 * app/doa/[category].tsx
 *
 * Shared by ALL 8 categories. Receives category ID from route param.
 * Shows real-time search + list of items with chevron.
 * Floating accessibility button same as main screen.
 */

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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
import { DOA_CATEGORIES, DoaItem } from '@/data/doaData';

export default function DoaCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const { isDarkMode, colors } = useAppTheme();
  const [query, setQuery] = useState('');

  // Find the matching category
  const cat = DOA_CATEGORIES.find((c) => c.id === category);

  // Real-time case-insensitive filter on title
  const filteredItems = useMemo<DoaItem[]>(() => {
    if (!cat) return [];
    if (!query.trim()) return cat.items;
    const q = query.toLowerCase();
    return cat.items.filter((item) => item.title.toLowerCase().includes(q));
  }, [cat, query]);

  const handleItemPress = (item: DoaItem) => {
    router.push({
      pathname: '/doa/detail' as any,
      params: {
        id: item.id,
        categoryId: category,
      },
    });
  };

  if (!cat) {
    return (
      <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
        <View style={layoutStyles.centered}>
          <Text style={{ color: colors.textMuted, marginTop: 40 }}>
            Kategori tidak ditemukan.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.surface }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />

      {/* ── APP BAR ── */}
      <View style={[s.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.appBarTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {cat.label}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={s.searchWrapper}>
        <View style={[s.searchBar, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <TextInput
            style={[s.searchInput, { color: colors.textPrimary }]}
            placeholder="Cari doa ..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          <MaterialCommunityIcons name="magnify" size={20} color={colors.primary} />
        </View>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={[s.divider, { backgroundColor: colors.border }]} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.listItem}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
          >
            <Text style={[s.itemTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {item.title}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ padding: SPACING.xl, alignItems: 'center' }}>
            <Text style={{ color: colors.textMuted, fontSize: FONT.sizeSm }}>
              Tidak ditemukan hasil untuk "{query}".
            </Text>
          </View>
        }
      />
      
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
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: { padding: SPACING.xs },
  appBarTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    flex: 1,
    textAlign: 'center',
  },

  searchWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
    paddingVertical: 0,
  },

  listContent: {
    paddingBottom: 80,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  itemTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightMedium,
    lineHeight: 20,
    marginRight: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: SPACING.xl,
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
