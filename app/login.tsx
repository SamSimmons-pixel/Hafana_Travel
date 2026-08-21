/**
 * Login Screen — app/login.tsx
 * Hafana Umrah Travel — Verification & Authentication
 *
 * Allows Jemaah to verify Nama Lengkap & Tanggal Lahir (via DatePicker)
 * Autocomplete dropdown helps jemaah pick their registered name and group.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';
import { apiRequest, getStorageUrl } from '@/services/api';
import { NameSearchResult } from '@/types/auth';
import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  cardStyles, inputStyles, buttonStyles, textStyles,
} from '@/components/styles';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { isDarkMode, colors } = useAppTheme();

  const [name, setName]                               = useState('');
  const [tanggal_lahir, setTanggalLahir]             = useState('');
  const [selectedDate, setSelectedDate]               = useState<Date>(new Date(1995, 0, 1));
  const [showDatePicker, setShowDatePicker]           = useState(false);
  const [loading, setLoading]                        = useState(false);
  const [errorMessage, setErrorMessage]              = useState<string | null>(null);
  const [appLogo, setAppLogo]                        = useState<string | null>(null);

  // Autocomplete dropdown
  const [suggestions, setSuggestions]                 = useState<NameSearchResult[]>([]);
  const [searchingNames, setSearchingNames]           = useState(false);
  const [showDropdown, setShowDropdown]               = useState(false);

  // Fetch system logo from backend settings
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ data: { app_logo: string | null } }>('/settings');
        if (res?.data?.app_logo) {
          setAppLogo(getStorageUrl(res.data.app_logo));
        }
      } catch {
        // Fallback to default Hafana icon
      }
    })();
  }, []);

  // Search registered names on typing
  const handleNameChange = (val: string) => {
    const upper = val.toUpperCase();
    setName(upper);
    if (errorMessage) setErrorMessage(null);

    if (upper.trim().length >= 2) {
      setSearchingNames(true);
      setShowDropdown(true);
      apiRequest<NameSearchResult[]>(`/users/search-names?query=${encodeURIComponent(upper.trim())}`)
        .then((res) => {
          setSuggestions(Array.isArray(res) ? res : []);
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setSearchingNames(false);
        });
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectName = (item: NameSearchResult) => {
    setName(item.name.toUpperCase());
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      setTanggalLahir(`${yyyy}-${mm}-${dd}`);
      if (errorMessage) setErrorMessage(null);
    }
  };

  const handleLogin = async () => {
    setErrorMessage(null);
    setShowDropdown(false);

    if (!name.trim() || !tanggal_lahir.trim()) {
      const msg = 'Silakan masukkan Nama Lengkap dan pilih Tanggal Lahir.';
      setErrorMessage(msg);
      Alert.alert('Perhatian', msg);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(name.trim().toUpperCase(), tanggal_lahir.trim());
      if (error) {
        const notFoundMsg = typeof error === 'string'
          ? error
          : 'Akun tidak ditemukan atau group tidak aktif. Periksa kembali nama & tanggal lahir Anda.';
        setErrorMessage(notFoundMsg);
        Alert.alert('Login Gagal', notFoundMsg);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const notFoundMsg = err.message || 'Akun tidak ditemukan. Periksa kembali data Anda.';
      setErrorMessage(notFoundMsg);
      Alert.alert('Login Gagal', notFoundMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestBrowse = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.primary }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Blue Band ── */}
        <View style={[s.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={s.skipHeaderBtn} onPress={handleGuestBrowse} activeOpacity={0.8}>
            <MaterialCommunityIcons name="arrow-left" size={16} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={s.skipHeaderBtnText}>Jelajahi App</Text>
          </TouchableOpacity>

          <View style={s.logoCircle}>
            {appLogo ? (
              <Image source={{ uri: appLogo }} style={s.logoImage} resizeMode="contain" />
            ) : (
              <View style={s.logoFallback}>
                <Text style={s.logoText}>HF</Text>
              </View>
            )}
          </View>
          <Text style={s.brandTitle}>Hafana Travel</Text>
          <Text style={s.brandSub}>Spesialis Umrah & Haji</Text>
        </View>

        {/* ── Card ── */}
        <View style={[cardStyles.padded, s.card, { backgroundColor: colors.surface }]}>
          <Text style={[textStyles.heading, { marginBottom: SPACING.xs, color: colors.textPrimary }]}>Verifikasi Data Jemaah</Text>
          <Text style={[textStyles.muted, { marginBottom: SPACING.lg, lineHeight: 18, color: colors.textSecondary }]}>
            Masukkan Nama Lengkap dan Tanggal Lahir untuk memverifikasi data jemaah & rombongan Anda.
          </Text>

          {errorMessage ? (
            <View style={[s.errorBanner, { backgroundColor: isDarkMode ? '#451a1a' : '#fef2f2', borderColor: '#f87171' }]}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" style={{ marginRight: SPACING.xs }} />
              <Text style={s.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Input Nama Lengkap (Uppercase + Autocomplete) */}
          <View style={{ marginBottom: SPACING.md, zIndex: 10 }}>
            <Text style={[inputStyles.label, { color: colors.textSecondary }]}>Nama Lengkap Jemaah (Kapital)</Text>
            <View style={[inputStyles.wrapper, { backgroundColor: colors.bg, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="account" size={18} color={colors.textMuted} style={{ marginRight: SPACING.sm }} />
              <TextInput
                style={[inputStyles.field, { color: colors.textPrimary, textTransform: 'uppercase' }]}
                value={name}
                onChangeText={handleNameChange}
                placeholder="CONTOH: AHMAD SYAHPUTRA"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {searchingNames && (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 6 }} />
              )}
            </View>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <View style={[s.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={`${item.name}-${index}`}
                    style={[
                      s.dropdownItem,
                      { borderBottomColor: colors.border },
                      index === suggestions.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => handleSelectName(item)}
                  >
                    <MaterialCommunityIcons name="account-check" size={18} color={COLORS.primary} style={{ marginRight: 8, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[s.dropdownName, { color: colors.textPrimary }]}>{item.name}</Text>
                      {item.group_name ? (
                        <Text style={[s.dropdownGroup, { color: colors.textMuted }]}>
                          👥 {item.group_name}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Tanggal Lahir (Calendar Picker) */}
          <View style={{ marginBottom: SPACING.xl }}>
            <Text style={[inputStyles.label, { color: colors.textSecondary }]}>Tanggal Lahir</Text>
            <TouchableOpacity
              style={[inputStyles.wrapper, { backgroundColor: colors.bg, borderColor: colors.border }]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="calendar" size={18} color={colors.textMuted} style={{ marginRight: SPACING.sm }} />
              <Text
                style={[
                  inputStyles.field,
                  { color: tanggal_lahir ? colors.textPrimary : colors.textMuted, paddingVertical: 12 },
                ]}
              >
                {tanggal_lahir ? tanggal_lahir : 'Pilih Tanggal Lahir (Kalender)'}
              </Text>
              <MaterialCommunityIcons name="calendar-cursor" size={18} color={COLORS.primary} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                onChange={handleDateChange}
              />
            )}

            {Platform.OS === 'ios' && showDatePicker && (
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginTop: 6, padding: 6 }}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Selesai</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[buttonStyles.primary, { backgroundColor: colors.primary }, loading && buttonStyles.disabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#ffffff" />
              : <Text style={buttonStyles.primaryText}>Verifikasi & Masuk</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={s.guestBrowseBtn}
            onPress={handleGuestBrowse}
            activeOpacity={0.8}
          >
            <Text style={[s.guestBrowseBtnText, { color: colors.primary }]}>Masuk sebagai Tamu (Nanti Saja)</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.footer, { backgroundColor: colors.surface, color: colors.textMuted }]}>
          © 2026 Hafana Travel. All rights reserved.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: SPACING.xxl,
    position: 'relative',
  },
  skipHeaderBtn: {
    position: 'absolute',
    top: 48,
    left: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  skipHeaderBtnText: {
    color: '#ffffff',
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightSemi,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.card,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  logoFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: FONT.weightBlack,
    color: COLORS.primaryDark,
  },
  brandTitle: {
    fontSize: FONT.sizeXxl,
    fontWeight: FONT.weightBlack,
    color: '#ffffff',
    marginBottom: 2,
  },
  brandSub: {
    fontSize: FONT.sizeSm,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: FONT.weightMedium,
  },
  card: {
    marginHorizontal: SPACING.lg,
    marginTop: -20,
    borderRadius: RADIUS.lg,
    ...SHADOW.strong,
    marginBottom: SPACING.xl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  errorBannerText: {
    color: '#ef4444',
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightMedium,
    flex: 1,
    lineHeight: 18,
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dropdownName: {
    fontSize: FONT.sizeSm,
    fontWeight: '700',
  },
  dropdownGroup: {
    fontSize: FONT.sizeXs,
    marginTop: 2,
  },
  guestBrowseBtn: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  guestBrowseBtnText: {
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightSemi,
  },
  footer: {
    textAlign: 'center',
    fontSize: FONT.sizeXs,
    paddingVertical: SPACING.lg,
    marginTop: 'auto',
  },
});


