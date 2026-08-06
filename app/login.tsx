/**
 * Login Screen — app/login.tsx
 * Hafana Umrah Travel — Authentication
 *
 * Styles sourced from @/components/styles — edit theme.ts to retheme.
 */

import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  cardStyles, inputStyles, buttonStyles, textStyles,
} from '@/components/styles';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [nomor_visa, setNomorVisa]       = useState('');
  const [tanggal_lahir, setTanggalLahir] = useState('');
  const [loading, setLoading]            = useState(false);

  const handleLogin = async () => {
    if (!nomor_visa || !tanggal_lahir) {
      Alert.alert('Perhatian', 'Silakan masukkan Nomor Visa dan Tanggal Lahir.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await signIn(nomor_visa.trim(), tanggal_lahir.trim());
      if (error) {
        Alert.alert('Login Gagal', error || 'Nomor Visa atau Tanggal Lahir tidak sesuai.');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: COLORS.primary }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Blue Band ── */}
        <View style={s.header}>
          <View style={s.logoCircle}>
            <Text style={s.logoEmoji}>🕌</Text>
          </View>
          <Text style={s.brandTitle}>Hafana Travel</Text>
          <Text style={s.brandSub}>Spesialis Umrah & Haji</Text>
        </View>

        {/* ── Card ── */}
        <View style={[cardStyles.padded, s.card]}>
          <Text style={[textStyles.heading, { marginBottom: SPACING.xs }]}>Masuk ke Akun Anda</Text>
          <Text style={[textStyles.muted, { marginBottom: SPACING.xxl, lineHeight: 18 }]}>
            Masukkan Nomor Visa dan Tanggal Lahir yang terdaftar.
          </Text>

          {/* Nomor Visa */}
          <View style={{ marginBottom: SPACING.lg }}>
            <Text style={inputStyles.label}>Nomor Visa</Text>
            <View style={inputStyles.wrapper}>
              <MaterialCommunityIcons name="card-account-details" size={18} color={COLORS.textMuted} style={{ marginRight: SPACING.sm }} />
              <TextInput
                style={inputStyles.field}
                value={nomor_visa}
                onChangeText={setNomorVisa}
                placeholder="Masukkan Nomor Visa"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Tanggal Lahir */}
          <View style={{ marginBottom: SPACING.xl }}>
            <Text style={inputStyles.label}>Tanggal Lahir</Text>
            <View style={inputStyles.wrapper}>
              <MaterialCommunityIcons name="calendar" size={18} color={COLORS.textMuted} style={{ marginRight: SPACING.sm }} />
              <TextInput
                style={inputStyles.field}
                value={tanggal_lahir}
                onChangeText={setTanggalLahir}
                placeholder="YYYY-MM-DD  (cth: 1995-08-15)"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[buttonStyles.primary, loading && buttonStyles.disabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={COLORS.surface} />
              : <Text style={buttonStyles.primaryText}>Masuk</Text>
            }
          </TouchableOpacity>

          {/* Demo Hint */}
          <View style={s.demoBox}>
            <Text style={[textStyles.tiny, { marginBottom: SPACING.sm, fontWeight: FONT.weightSemi }]}>💡 Akun Demo:</Text>
            {[
              { label: 'Test User', visa: '1234567890', dob: '1995-08-15' },
              { label: 'Ahmad Syahputra', visa: 'V-123456', dob: '1998-05-20' },
            ].map((acc) => (
              <TouchableOpacity
                key={acc.visa}
                style={s.demoChip}
                onPress={() => { setNomorVisa(acc.visa); setTanggalLahir(acc.dob); }}
              >
                <Text style={s.demoChipText}>
                  {acc.label} · Visa: <Text style={{ fontWeight: FONT.weightBold }}>{acc.visa}</Text>
                  {' '}· Lahir: <Text style={{ fontWeight: FONT.weightBold }}>{acc.dob}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={s.footer}>© 2026 Hafana Travel. All rights reserved.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 40,
    paddingHorizontal: SPACING.xxl,
  },
  logoCircle: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoEmoji:  { fontSize: 36 },
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

  demoBox: {
    marginTop: SPACING.xxl,
    paddingTop: SPACING.lg,
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
