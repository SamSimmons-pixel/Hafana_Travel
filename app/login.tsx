/**
 * Login Screen — app/login.tsx
 * Hafana Umrah Travel — Verification & Authentication
 *
 * Allows Jemaah to verify Visa & Birthdate to access profile & group info.
 * Includes a "Masuk sebagai Tamu" option so unauthenticated users can freely browse the app.
 */

import { useEffect, useState } from 'react';
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
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';
import { apiRequest, getStorageUrl } from '@/services/api';
import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  cardStyles, inputStyles, buttonStyles, textStyles,
} from '@/components/styles';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { isDarkMode, colors } = useAppTheme();

  const [nomor_visa, setNomorVisa]       = useState('');
  const [tanggal_lahir, setTanggalLahir] = useState('');
  const [loading, setLoading]            = useState(false);
  const [errorMessage, setErrorMessage]  = useState<string | null>(null);
  const [appLogo, setAppLogo]            = useState<string | null>(null);

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

  const handleLogin = async () => {
    setErrorMessage(null);
    if (!nomor_visa.trim() || !tanggal_lahir.trim()) {
      const msg = 'Silakan masukkan Nomor Visa dan Tanggal Lahir.';
      setErrorMessage(msg);
      Alert.alert('Perhatian', msg);
      return;
    }
    setLoading(true);
    try {
      const { error } = await signIn(nomor_visa.trim(), tanggal_lahir.trim());
      if (error) {
        const notFoundMsg = 'Akun tidak ditemukan. Nomor Visa atau Tanggal Lahir tidak terdaftar.';
        setErrorMessage(notFoundMsg);
        Alert.alert('Akun Tidak Ditemukan', notFoundMsg);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const notFoundMsg = err.message || 'Akun tidak ditemukan. Periksa kembali data Anda.';
      setErrorMessage(notFoundMsg);
      Alert.alert('Akun Tidak Ditemukan', notFoundMsg);
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
          {/* Back/Close button for guest browse */}
          <TouchableOpacity style={s.skipHeaderBtn} onPress={handleGuestBrowse} activeOpacity={0.8}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={s.skipHeaderBtnText}>Jelajahi App</Text>
          </TouchableOpacity>

          {/* System Logo from Backend / Fallback */}
          <View style={s.logoCircle}>
            {appLogo ? (
              <Image
                source={{ uri: appLogo }}
                style={s.logoImage}
                resizeMode="contain"
              />
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
            Masukkan Nomor Visa dan Tanggal Lahir untuk memverifikasi dokumen dan rombongan Anda.
          </Text>

          {/* Notifikasi Akun Tidak Ditemukan / Error Banner */}
          {errorMessage ? (
            <View style={[s.errorBanner, { backgroundColor: isDarkMode ? '#451a1a' : '#fef2f2', borderColor: '#f87171' }]}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" style={{ marginRight: SPACING.xs }} />
              <Text style={s.errorBannerText}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Nomor Visa */}
          <View style={{ marginBottom: SPACING.lg }}>
            <Text style={[inputStyles.label, { color: colors.textSecondary }]}>Nomor Visa</Text>
            <View style={[inputStyles.wrapper, { backgroundColor: colors.bg, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="card-account-details" size={18} color={colors.textMuted} style={{ marginRight: SPACING.sm }} />
              <TextInput
                style={[inputStyles.field, { color: colors.textPrimary }]}
                value={nomor_visa}
                onChangeText={(val) => {
                  setNomorVisa(val);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Contoh: 6169281080"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Tanggal Lahir */}
          <View style={{ marginBottom: SPACING.xl }}>
            <Text style={[inputStyles.label, { color: colors.textSecondary }]}>Tanggal Lahir</Text>
            <View style={[inputStyles.wrapper, { backgroundColor: colors.bg, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="calendar" size={18} color={colors.textMuted} style={{ marginRight: SPACING.sm }} />
              <TextInput
                style={[inputStyles.field, { color: colors.textPrimary }]}
                value={tanggal_lahir}
                onChangeText={(val) => {
                  setTanggalLahir(val);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="YYYY-MM-DD  (cth: 1995-02-10)"
                placeholderTextColor={colors.textMuted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
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

          {/* Guest Browse Button */}
          <TouchableOpacity
            style={s.guestBrowseBtn}
            onPress={handleGuestBrowse}
            activeOpacity={0.8}
          >
            <Text style={[s.guestBrowseBtnText, { color: colors.primary }]}>Masuk sebagai Tamu (Nanti Saja)</Text>
          </TouchableOpacity>

          {/* Demo Hint */}
          <View style={s.demoBox}>
            <Text style={[textStyles.tiny, { marginBottom: SPACING.sm, fontWeight: FONT.weightSemi, color: colors.textSecondary }]}>💡 Contoh Jemaah Admin Panel:</Text>
            {[
              { label: 'Abdul Latif Ramadhani', visa: '6169281080', dob: '1995-02-10' },
              { label: 'Aisyah Nurul Sari', visa: '6169281119', dob: '1993-01-01' },
            ].map((acc) => (
              <TouchableOpacity
                key={acc.visa}
                style={[s.demoChip, { backgroundColor: isDarkMode ? colors.surfaceAlt : COLORS.primaryLight, borderColor: isDarkMode ? colors.border : '#b3e0f7' }]}
                onPress={() => {
                  setNomorVisa(acc.visa);
                  setTanggalLahir(acc.dob);
                  setErrorMessage(null);
                }}
              >
                <Text style={[s.demoChipText, { color: colors.textPrimary }]}>
                  {acc.label} · Visa: <Text style={{ fontWeight: FONT.weightBold }}>{acc.visa}</Text>
                  {' '}· Lahir: <Text style={{ fontWeight: FONT.weightBold }}>{acc.dob}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  skipHeaderBtnText: {
    color: COLORS.surface,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: 20,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  logoImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  logoFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: FONT.sizeXl,
    fontWeight: FONT.weightBlack,
    letterSpacing: 1,
  },
  brandTitle: { color: COLORS.surface, fontSize: FONT.sizeXxl, fontWeight: FONT.weightBlack, letterSpacing: 0.5 },
  brandSub:   { color: 'rgba(255,255,255,0.8)', fontSize: FONT.sizeMd, marginTop: SPACING.xs },

  card: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xxl,
    shadowOpacity: 0,
    elevation: 0,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  errorBannerText: {
    flex: 1,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightMedium,
    color: '#ef4444',
    lineHeight: 18,
  },

  guestBrowseBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
  },
  guestBrowseBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightSemi,
  },

  demoBox: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  demoChip: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm + 2,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#b3e0f7',
  },
  demoChipText: { color: COLORS.textPrimary, fontSize: FONT.sizeSm },

  footer: {
    backgroundColor: COLORS.bg,
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONT.sizeXs,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
  },
});
