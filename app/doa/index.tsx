/**
 * Doa & Dzikir — Main Menu Screen
 * app/doa/index.tsx
 *
 * 2-column grid of 8 categories. Reuses globalStyles theme.
 * Floating accessibility button pinned to left edge.
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles,
} from '@/components/styles';
import { DOA_CATEGORIES } from '@/data/doaData';

export default function DoaMenuScreen() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/doa/${categoryId}` as any);
  };

  return (
    <SafeAreaView style={layoutStyles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── APP BAR ── */}
      <View style={s.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={s.appBarTitle}>Doa-doa</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── GRID ── */}
      <ScrollView
        contentContainerStyle={s.grid}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.gridRow}>
          {DOA_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={s.card}
              onPress={() => handleCategoryPress(cat.id)}
              activeOpacity={0.8}
            >
              <View style={s.iconCircle}>
                {renderCategoryIcon(cat.id, cat.icon)}
              </View>
              <Text style={s.cardLabel} numberOfLines={2}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
}

function renderCategoryIcon(catId: string, iconName: string) {
  switch (catId) {
    case 'haji':
      return <FontAwesome5 name="kaaba" size={28} color={COLORS.primary} />;
    case 'shalat':
      return <MaterialCommunityIcons name="clock-time-four-outline" size={30} color={COLORS.primary} />;
    case 'shalat-jenazah':
      return <MaterialCommunityIcons name="grave-stone" size={30} color={COLORS.primary} />;
    default:
      return <MaterialCommunityIcons name={iconName as any} size={30} color={COLORS.primary} />;
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
    backgroundColor: COLORS.bg,
  },
  backBtn: { padding: SPACING.xs },
  appBarTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    textAlign: 'center',
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOW.card,
    marginBottom: SPACING.xs,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
    textAlign: 'center',
    lineHeight: 18,
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
