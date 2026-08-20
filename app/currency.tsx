/**
 * Currency Converter Screen — app/currency.tsx
 * Hafana Travel — Multi-Currency Real-time Converter to IDR (Rupiah)
 * Supports: SAR (Saudi Riyal), USD (US Dollar), EUR (Euro), MYR (Malaysian Ringgit), SGD (Singapore Dollar)
 */

// 🎨 EDIT YOUR DESIRED PAGE & SECTION COLORS HERE (Lines 7-9):
export const SCREEN_BG_COLOR = '#6c7994ff'; // ← Whole page background color (edit here!)
export const DARK_SECTION_BG = '#50596dff'; // ← Card section background color (edit here!)
export const DARK_SECTION_TEXT = '#ffffff'; // ← Text color for dark sections (edit here!)

import {
  COLORS, FONT, RADIUS,
  SHADOW,
  SPACING,
  cardStyles, layoutStyles,
} from '@/components/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface CurrencyConfig {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  defaultFallbackRate: number; // 1 Foreign Currency = X IDR
  defaultAmount: string;
  presets: { val: number; label: string; desc: string }[];
}

const defaultAmount = '0';

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  SAR: {
    code: 'SAR',
    name: 'Riyal Saudi',
    flag: '🇸🇦',
    symbol: '﷼',
    defaultFallbackRate: 4250,
    defaultAmount: defaultAmount,
    presets: [
      { val: 10, label: '10 SAR', desc: 'Minuman / Cukur' },
      { val: 50, label: '50 SAR', desc: 'Makan / Taxi' },
      { val: 100, label: '100 SAR', desc: 'Kurma / Oleh-oleh' },
      { val: 500, label: '500 SAR', desc: 'Sajadah / Abaya' },
      { val: 1000, label: '1.000 SAR', desc: 'Uang Saku Utama' },
    ],
  },
  USD: {
    code: 'USD',
    name: 'Dolar AS',
    flag: '🇺🇸',
    symbol: '$',
    defaultFallbackRate: 16200,
    defaultAmount: defaultAmount,
    presets: [
      { val: 5, label: '$5 USD', desc: 'Kopi / Snack' },
      { val: 20, label: '$20 USD', desc: 'Makan Siang' },
      { val: 50, label: '$50 USD', desc: 'Belanja' },
      { val: 100, label: '$100 USD', desc: 'Pecahan Utama' },
      { val: 500, label: '$500 USD', desc: 'Uang Saku' },
    ],
  },
  EUR: {
    code: 'EUR',
    name: 'Euro Europe',
    flag: '🇪🇺',
    symbol: '€',
    defaultFallbackRate: 17500,
    defaultAmount: defaultAmount,
    presets: [
      { val: 5, label: '€5 EUR', desc: 'Snack / Tiket' },
      { val: 20, label: '€20 EUR', desc: 'Makan Siang' },
      { val: 50, label: '€50 EUR', desc: 'Belanja' },
      { val: 100, label: '€100 EUR', desc: 'Pecahan Utama' },
      { val: 500, label: '€500 EUR', desc: 'Uang Saku' },
    ],
  },
  MYR: {
    code: 'MYR',
    name: 'Ringgit Malaysia',
    flag: '🇲🇾',
    symbol: 'RM',
    defaultFallbackRate: 3650,
    defaultAmount: defaultAmount,
    presets: [
      { val: 10, label: 'RM 10', desc: 'Roti Canai / Teh' },
      { val: 50, label: 'RM 50', desc: 'Makan / Grab' },
      { val: 100, label: 'RM 100', desc: 'Belanja Souvenir' },
      { val: 500, label: 'RM 500', desc: 'Transit KLIA' },
      { val: 1000, label: 'RM 1.000', desc: 'Uang Saku' },
    ],
  },
  SGD: {
    code: 'SGD',
    name: 'Dolar Singapura',
    flag: '🇸🇬',
    symbol: 'S$',
    defaultFallbackRate: 12100,
    defaultAmount: defaultAmount,
    presets: [
      { val: 5, label: 'S$5', desc: 'MRT / Snack' },
      { val: 20, label: 'S$20', desc: 'Makan Food Court' },
      { val: 50, label: 'S$50', desc: 'Belanja Changi' },
      { val: 100, label: 'S$100', desc: 'Pecahan Utama' },
      { val: 500, label: 'S$500', desc: 'Uang Saku Transit' },
    ],
  },
};

export default function CurrencyScreen() {
  const router = useRouter();

  // Active Selected Currency Code
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('SAR');

  const currConfig = CURRENCY_CONFIGS[selectedCurrencyCode] || CURRENCY_CONFIGS.SAR;

  // Rate states
  const [rateToIdr, setRateToIdr] = useState<number>(currConfig.defaultFallbackRate);
  const [loadingRate, setLoadingRate] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLive, setIsLive] = useState<boolean>(false);

  // Mode: 'FOREIGN_TO_IDR' or 'IDR_TO_FOREIGN'
  const [mode, setMode] = useState<'FOREIGN_TO_IDR' | 'IDR_TO_FOREIGN'>('FOREIGN_TO_IDR');

  // Input value string
  const [amountStr, setAmountStr] = useState<string>(currConfig.defaultAmount);

  // Fetch real-time exchange rates for selected currency
  const fetchExchangeRate = async (code: string = selectedCurrencyCode) => {
    setLoadingRate(true);
    const targetConfig = CURRENCY_CONFIGS[code] || CURRENCY_CONFIGS.SAR;
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${code}`);
      const data = await res.json();
      if (data && data.rates && data.rates.IDR) {
        const rate = data.rates.IDR;
        setRateToIdr(rate);
        setIsLive(true);
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      } else {
        throw new Error('Rate data not found');
      }
    } catch {
      setIsLive(false);
      setRateToIdr(targetConfig.defaultFallbackRate);
      setLastUpdated('Estimasi Bank Indonesia');
    } finally {
      setLoadingRate(false);
    }
  };

  // Switch currency selection
  const handleCurrencySelect = (code: string) => {
    if (code === selectedCurrencyCode) return;
    setSelectedCurrencyCode(code);
    const newConfig = CURRENCY_CONFIGS[code] || CURRENCY_CONFIGS.SAR;
    setAmountStr(newConfig.defaultAmount);
    setMode('FOREIGN_TO_IDR');
    fetchExchangeRate(code);
  };

  useEffect(() => {
    fetchExchangeRate(selectedCurrencyCode);
  }, []);

  // Calculate conversion
  const rawNum = parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0;

  let convertedValue = 0;
  if (mode === 'FOREIGN_TO_IDR') {
    convertedValue = rawNum * rateToIdr;
  } else {
    convertedValue = rateToIdr > 0 ? rawNum / rateToIdr : 0;
  }

  // Toggle direction (Foreign ↔ IDR)
  const handleSwap = () => {
    if (mode === 'FOREIGN_TO_IDR') {
      setMode('IDR_TO_FOREIGN');
      setAmountStr('500000'); // default Rp 500.000
    } else {
      setMode('FOREIGN_TO_IDR');
      setAmountStr(currConfig.defaultAmount);
    }
  };

  // Handle Preset Click
  const handlePresetSelect = (val: number) => {
    if (mode === 'FOREIGN_TO_IDR') {
      setAmountStr(val.toString());
    } else {
      const equivalentIdr = Math.round(val * rateToIdr);
      setAmountStr(equivalentIdr.toString());
    }
  };

  // Bank Indonesia Buy & Sell Rate estimates (Spread ±1%)
  const spread = Math.round(rateToIdr * 0.01);
  const buyRate = Math.round(rateToIdr - spread);
  const sellRate = Math.round(rateToIdr + spread);

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: SCREEN_BG_COLOR }]}>
      <StatusBar barStyle="light-content" backgroundColor={SCREEN_BG_COLOR} />

      {/* ── HEADER BAR ── */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Konversi Mata Uang</Text>
        <TouchableOpacity onPress={() => fetchExchangeRate(selectedCurrencyCode)} style={s.refreshBtn}>
          {loadingRate ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <MaterialCommunityIcons name="refresh" size={22} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={layoutStyles.scrollContent}>

        {/* ── CURRENCY TAB SELECTOR ── */}
        <View style={s.currencyTabSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.currencyTabList}>
            {Object.values(CURRENCY_CONFIGS).map((item) => {
              const isSelected = item.code === selectedCurrencyCode;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[s.currencyTab, isSelected && s.currencyTabActive]}
                  onPress={() => handleCurrencySelect(item.code)}
                  activeOpacity={0.8}
                >
                  <Text style={s.currencyTabFlag}>{item.flag}</Text>
                  <Text style={[s.currencyTabCode, isSelected && s.currencyTabCodeActive]}>
                    {item.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── RATE STATUS BANNER ── */}
        <View style={s.rateBanner}>
          <View style={layoutStyles.row}>
            <View style={[s.liveDot, { backgroundColor: isLive ? '#10b981' : '#f59e0b' }]} />
            <Text style={s.rateBannerTitle}>
              {isLive ? `Kurs Real-time Bank Indonesia / Market (${currConfig.code})` : `Kurs Estimasi Standard BI (${currConfig.code})`}
            </Text>
          </View>
          <Text style={s.rateBannerSub}>
            1 {currConfig.code} ({currConfig.name}) = <Text style={{ fontWeight: FONT.weightBlack, color: COLORS.primary }}>Rp {Math.round(rateToIdr).toLocaleString('id-ID')}</Text>
            {lastUpdated ? ` · Perbaruan ${lastUpdated}` : ''}
          </Text>
        </View>

        {/* ── CONVERTER CARD ── */}
        <View style={[cardStyles.padded, s.converterCard]}>

          {/* Primary Input */}
          <View style={s.inputBlock}>
            <View style={layoutStyles.spaceBetween}>
              <Text style={s.inputLabel}>
                {mode === 'FOREIGN_TO_IDR' ? `${currConfig.name} (${currConfig.code})` : 'Rupiah Indonesia (IDR)'}
              </Text>
              <Text style={s.currencyTag}>
                {mode === 'FOREIGN_TO_IDR' ? `${currConfig.flag} ${currConfig.code}` : '🇮🇩 IDR'}
              </Text>
            </View>
            <View style={s.inputFieldRow}>
              <Text style={s.currencySymbol}>
                {mode === 'FOREIGN_TO_IDR' ? currConfig.symbol : 'Rp'}
              </Text>
              <TextInput
                style={s.mainInput}
                value={amountStr}
                onChangeText={setAmountStr}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          {/* Swap Button */}
          <View style={s.swapRow}>
            <View style={s.dividerLine} />
            <TouchableOpacity style={s.swapBtn} onPress={handleSwap} activeOpacity={0.8}>
              <MaterialCommunityIcons name="swap-vertical" size={24} color={COLORS.surface} />
            </TouchableOpacity>
            <View style={s.dividerLine} />
          </View>

          {/* Converted Output */}
          <View style={s.outputBlock}>
            <View style={layoutStyles.spaceBetween}>
              <Text style={s.inputLabel}>
                {mode === 'FOREIGN_TO_IDR' ? 'Hasil Rupiah (IDR)' : `Hasil ${currConfig.name} (${currConfig.code})`}
              </Text>
              <Text style={s.currencyTag}>
                {mode === 'FOREIGN_TO_IDR' ? '🇮🇩 IDR' : `${currConfig.flag} ${currConfig.code}`}
              </Text>
            </View>
            <Text style={s.outputResult} numberOfLines={1}>
              {mode === 'FOREIGN_TO_IDR'
                ? `Rp ${Math.round(convertedValue).toLocaleString('id-ID')}`
                : `${currConfig.symbol} ${convertedValue.toFixed(2)} ${currConfig.code}`
              }
            </Text>
          </View>

        </View>

        {/* ── PRESET NOMINAL CHIPS ── */}
        <View style={s.presetSection}>
          <Text style={s.sectionTitle}>💡 Nominal Populer ({currConfig.code})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.presetList}>
            {currConfig.presets.map((p) => (
              <TouchableOpacity
                key={p.val}
                style={s.presetChip}
                onPress={() => handlePresetSelect(p.val)}
                activeOpacity={0.7}
              >
                <Text style={s.presetLabel}>{p.label}</Text>
                <Text style={s.presetDesc}>{p.desc}</Text>
                <Text style={s.presetValue}>
                  ≈ Rp {Math.round(p.val * rateToIdr).toLocaleString('id-ID')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── BANK INDONESIA RATE GUIDE ── */}
        <View style={[cardStyles.padded, s.biGuideCard]}>
          <View style={layoutStyles.row}>
            <MaterialCommunityIcons name="bank-outline" size={22} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
            <Text style={s.biGuideTitle}>Acuan Kurs Bank Indonesia ({currConfig.code})</Text>
          </View>

          <View style={s.biRateGrid}>
            <View style={s.biRateBox}>
              <Text style={s.biRateLabel}>Kurs Beli BI</Text>
              <Text style={s.biRateVal}>Rp {buyRate.toLocaleString('id-ID')}</Text>
              <Text style={s.biRateSub}>Money Changer beli {currConfig.code}</Text>
            </View>
            <View style={s.biRateBox}>
              <Text style={s.biRateLabel}>Kurs Tengah</Text>
              <Text style={[s.biRateVal, { color: COLORS.primary }]}>Rp {Math.round(rateToIdr).toLocaleString('id-ID')}</Text>
              <Text style={s.biRateSub}>Acuan Resmi BI</Text>
            </View>
            <View style={s.biRateBox}>
              <Text style={s.biRateLabel}>Kurs Jual BI</Text>
              <Text style={s.biRateVal}>Rp {sellRate.toLocaleString('id-ID')}</Text>
              <Text style={s.biRateSub}>Money Changer jual {currConfig.code}</Text>
            </View>
          </View>

          <View style={s.tipsBox}>
            <Text style={s.tipsTitle}>📌 Petunjuk Penukaran Mata Uang:</Text>
            <Text style={s.tipsText}>• Selalu periksa nilai penukaran di Money Changer resmi sebelum bertransaksi.</Text>
            <Text style={s.tipsText}>• Kartu ATM/Kredit berlogo Visa & Mastercard dapat digunakan untuk tarik tunai di luar negeri.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: SCREEN_BG_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
  },
  refreshBtn: {
    padding: SPACING.xs,
  },

  // Currency Tab Bar
  currencyTabSection: {
    backgroundColor: SCREEN_BG_COLOR,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  currencyTabList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  currencyTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_SECTION_BG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  currencyTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  currencyTabFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  currencyTabCode: {
    color: '#94a3b8',
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
  },
  currencyTabCodeActive: {
    color: '#ffffff',
  },

  // Rate Banner
  rateBanner: {
    backgroundColor: DARK_SECTION_BG,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  liveDot: {
    width: 8, height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  rateBannerTitle: {
    color: '#ffffff',
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
  },
  rateBannerSub: {
    color: '#94a3b8',
    fontSize: FONT.sizeSm,
    marginTop: 2,
  },

  // Converter Card
  converterCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  inputBlock: {
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightMedium,
  },
  currencyTag: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightBold,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  inputFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  currencySymbol: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: FONT.weightBlack,
    marginRight: SPACING.sm,
  },
  mainInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: FONT.weightBlack,
    paddingVertical: 4,
  },

  // Swap
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  swapBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    ...SHADOW.button,
  },

  outputBlock: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#b3e0f7',
  },
  outputResult: {
    color: COLORS.primaryDark,
    fontSize: 26,
    fontWeight: FONT.weightBlack,
    marginTop: SPACING.xs,
  },

  // Presets
  presetSection: {
    marginTop: SPACING.xl,
    backgroundColor: DARK_SECTION_BG,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
  },
  sectionTitle: {
    color: DARK_SECTION_TEXT,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  presetList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  presetChip: {
    backgroundColor: SCREEN_BG_COLOR,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  presetLabel: {
    color: COLORS.primary,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBlack,
  },
  presetDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FONT.sizeXs,
    marginVertical: 2,
  },
  presetValue: {
    color: DARK_SECTION_TEXT,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
    marginTop: SPACING.xs,
  },

  // Bank Indonesia Guide Card
  biGuideCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: DARK_SECTION_BG,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  biGuideTitle: {
    color: DARK_SECTION_TEXT,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
  },
  biRateGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  biRateBox: {
    flex: 1,
    backgroundColor: SCREEN_BG_COLOR,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  biRateLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightMedium,
  },
  biRateVal: {
    color: DARK_SECTION_TEXT,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBlack,
    marginVertical: 2,
  },
  biRateSub: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 9,
    textAlign: 'center',
  },

  tipsBox: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  tipsTitle: {
    color: DARK_SECTION_TEXT,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
    marginBottom: 2,
  },
  tipsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FONT.sizeXs,
    lineHeight: 16,
  },
});
