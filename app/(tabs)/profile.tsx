/**
 * Profile Screen — app/(tabs)/profile.tsx
 * Hafana Umrah Travel — Jemaah Profile & Verification Data
 *
 * Displays:
 *  - Nama Jemaah (with Copy button)
 *  - Nomor Visa (with Copy button)
 *  - Tanggal Lahir (with Copy button)
 *  - Nomor Paspor (with Copy button)
 *  - Nomor HP / WhatsApp (with Copy button)
 *  - Group Rombongan Keberangkatan
 *
 * If guest (unauthenticated): Shows verification prompt card with "Masuk / Verifikasi Akun" CTA button.
 * If user has no phone number: Persistent PhonePromptModal blocks profile view until filled.
 */

import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles, textStyles,
} from '@/components/styles';
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';
import { PhonePromptModal } from '@/components/PhonePromptModal';

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isDarkMode, colors } = useAppTheme();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);

  const handleCopy = async (key: string, text: string | null | undefined, label: string) => {
    if (!text || text === '-') {
      Alert.alert('Info', `${label} belum diisi.`);
      return;
    }

    await Clipboard.setStringAsync(text);
    setCopiedKey(key);

    if (Platform.OS === 'android') {
      ToastAndroid.show(`${label} berhasil disalin!`, ToastAndroid.SHORT);
    }

    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleSignOut = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  // If user is logged in but has no phone number, show persistent modal
  const needsPhone = Boolean(user && (!user.no_hp || user.no_hp.trim() === ''));

  return (
    <SafeAreaView style={[layoutStyles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* Persistent Phone Modal if missing */}
      <PhonePromptModal
        visible={needsPhone || showEditPhoneModal}
        canDismiss={!needsPhone}
        onDismiss={() => setShowEditPhoneModal(false)}
        onSuccess={() => setShowEditPhoneModal(false)}
      />

      {/* ── TOP BAR ── */}
      <View style={[s.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[s.topBarTitle, { color: colors.textPrimary }]}>Profil Jemaah</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {user ? (
          /* ── LOGGED IN JEMAAH VIEW ── */
          <>
            {/* Header Profile Card */}
            <View style={[s.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
              <View style={[s.avatarCircle, { backgroundColor: colors.primary }]}>
                <Text style={s.avatarText}>
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'JM'}
                </Text>
              </View>
              <Text style={[s.userName, { color: colors.textPrimary }]}>{user.name}</Text>
              <View style={[s.verifiedBadge, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons name="check-decagram" size={16} color={colors.primary} />
                <Text style={[s.verifiedText, { color: colors.primary }]}>Jemaah Terverifikasi</Text>
              </View>
            </View>

            {/* Information Grid Card */}
            <View style={[s.infoCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={[s.cardHeading, { color: colors.textPrimary, marginBottom: 0 }]}>Data Dokumen Jemaah</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>📋 Ketuk ikon untuk salin</Text>
              </View>

              {/* Nama Jemaah */}
              <InfoItemWithCopy
                itemKey="name"
                icon="account"
                label="Nama Lengkap Jemaah"
                value={user.name}
                isCopied={copiedKey === 'name'}
                onCopy={() => handleCopy('name', user.name, 'Nama Lengkap')}
                colors={colors}
              />
              <Divider color={colors.border} />

              {/* Nomor Visa */}
              <InfoItemWithCopy
                itemKey="visa"
                icon="card-account-details-outline"
                label="Nomor Visa"
                value={user.nomor_visa || '-'}
                isCopied={copiedKey === 'visa'}
                onCopy={() => handleCopy('visa', user.nomor_visa, 'Nomor Visa')}
                highlight
                colors={colors}
              />
              <Divider color={colors.border} />

              {/* Tanggal Lahir */}
              <InfoItemWithCopy
                itemKey="dob"
                icon="calendar"
                label="Tanggal Lahir"
                value={formatDate(user.tanggal_lahir)}
                copyRawValue={user.tanggal_lahir}
                isCopied={copiedKey === 'dob'}
                onCopy={() => handleCopy('dob', user.tanggal_lahir, 'Tanggal Lahir')}
                colors={colors}
              />
              <Divider color={colors.border} />

              {/* Nomor Paspor */}
              <InfoItemWithCopy
                itemKey="paspor"
                icon="passport"
                label="Nomor Paspor"
                value={user.nomor_paspor || '-'}
                isCopied={copiedKey === 'paspor'}
                onCopy={() => handleCopy('paspor', user.nomor_paspor, 'Nomor Paspor')}
                colors={colors}
              />
              <Divider color={colors.border} />

              {/* Nomor HP / WhatsApp */}
              <InfoItemWithCopy
                itemKey="phone"
                icon="whatsapp"
                label="Nomor HP / WhatsApp"
                value={user.no_hp || '-'}
                isCopied={copiedKey === 'phone'}
                onCopy={() => handleCopy('phone', user.no_hp, 'Nomor HP')}
                onEdit={() => setShowEditPhoneModal(true)}
                colors={colors}
              />
              <Divider color={colors.border} />

              {/* Group Rombongan Keberangkatan */}
              <View style={s.infoRow}>
                <View style={[s.infoIconBox, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
                </View>
                <View style={s.infoContent}>
                  <Text style={[s.infoLabel, { color: colors.textSecondary }]}>Group Rombongan Keberangkatan</Text>
                  <View style={[s.groupBadgeBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                    <Text style={[s.groupBadgeText, { color: colors.primary }]}>
                      {user.group?.nama_group || 'Belum Ditempatkan dalam Group'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={[s.logoutBtn, { backgroundColor: colors.surface, borderColor: COLORS.danger, borderWidth: 1 }]}
              onPress={handleSignOut}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={s.logoutBtnText}>Keluar / Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* ── GUEST / UNAUTHENTICATED VIEW ── */
          <View style={[s.guestCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
            <View style={[s.guestIconCircle, { backgroundColor: colors.primaryLight }]}>
              <MaterialCommunityIcons name="shield-account-outline" size={48} color={colors.primary} />
            </View>

            <Text style={[s.guestTitle, { color: colors.textPrimary }]}>Verifikasi Data Jemaah</Text>
            <Text style={[s.guestSub, { color: colors.textSecondary }]}>
              Anda dapat menjelajahi aplikasi Hafana Travel secara bebas. Untuk melihat data visa, paspor, nomor telepon, dan rombongan keberangkatan Anda, silakan masuk.
            </Text>

            <View style={[s.guestBenefits, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
              <View style={s.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} />
                <Text style={[s.benefitText, { color: colors.textPrimary }]}>Cek Nomor Visa & Nomor Paspor Jemaah</Text>
              </View>
              <View style={s.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} />
                <Text style={[s.benefitText, { color: colors.textPrimary }]}>Salin Data Profil Langsung per Kolom</Text>
              </View>
              <View style={s.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} />
                <Text style={[s.benefitText, { color: colors.textPrimary }]}>Lihat Info Group Rombongan Keberangkatan</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[s.loginBtn, { backgroundColor: colors.primary }]}
              onPress={handleLoginPress}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="login" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={s.loginBtnText}>Masuk / Verifikasi Akun</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-component for info rows with individual copy buttons ──
function InfoItemWithCopy({
  itemKey,
  icon,
  label,
  value,
  copyRawValue,
  highlight = false,
  isCopied = false,
  onCopy,
  onEdit,
  colors,
}: {
  itemKey: string;
  icon: string;
  label: string;
  value: string;
  copyRawValue?: string;
  highlight?: boolean;
  isCopied?: boolean;
  onCopy: () => void;
  onEdit?: () => void;
  colors?: any;
}) {
  const pColor = colors?.primary || COLORS.primary;
  const pLight = colors?.primaryLight || COLORS.primaryLight;
  const tPrimary = colors?.textPrimary || COLORS.textPrimary;
  const tSecondary = colors?.textSecondary || COLORS.textSecondary;

  return (
    <View style={s.infoRow}>
      <View style={[s.infoIconBox, { backgroundColor: pLight }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={pColor} />
      </View>
      <View style={s.infoContent}>
        <Text style={[s.infoLabel, { color: tSecondary }]}>{label}</Text>
        <Text style={[s.infoValue, { color: tPrimary }, highlight && s.infoValueHighlight]}>
          {value}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {onEdit && (
          <TouchableOpacity
            style={[s.copyBtn, { backgroundColor: pLight, borderColor: pColor }]}
            onPress={onEdit}
            activeOpacity={0.7}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <MaterialCommunityIcons name="pencil" size={15} color={pColor} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            s.copyBtn,
            { backgroundColor: isCopied ? '#d1fae5' : pLight, borderColor: isCopied ? '#10b981' : colors.border },
          ]}
          onPress={onCopy}
          activeOpacity={0.7}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <MaterialCommunityIcons
            name={isCopied ? 'check' : 'content-copy'}
            size={15}
            color={isCopied ? '#059669' : pColor}
          />
          {isCopied && (
            <Text style={{ fontSize: 10, color: '#059669', fontWeight: '700', marginLeft: 3 }}>
              Disalin
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Divider({ color }: { color?: string }) {
  return <View style={[s.divider, color ? { backgroundColor: color } : null]} />;
}


// ── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  topBar: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  topBarTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeXl,
    fontWeight: FONT.weightBlack,
  },

  container: {
    padding: SPACING.xl,
    gap: SPACING.lg,
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.button,
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 26,
    fontWeight: FONT.weightBlack,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: FONT.weightBlack,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    gap: 4,
  },
  verifiedText: {
    color: COLORS.surface,
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightBold,
  },

  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOW.card,
  },
  cardHeading: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeLg,
    fontWeight: FONT.weightBlack,
    marginBottom: SPACING.lg,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: FONT.sizeXs,
    fontWeight: FONT.weightMedium,
    marginBottom: 2,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
  },
  infoValueHighlight: {
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.5,
  },
  groupBadgeBox: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#b3e0f7',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  groupBadgeText: {
    color: COLORS.primaryDark,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightBold,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
    marginLeft: 54,
  },

  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },


  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  logoutBtnText: {
    color: COLORS.danger,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
  },

  // Guest card styles
  guestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.card,
  },
  guestIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: '#b3e0f7',
  },
  guestTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: FONT.weightBlack,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  guestSub: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  guestBenefits: {
    width: '100%',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  benefitText: {
    color: COLORS.textPrimary,
    fontSize: FONT.sizeSm,
    fontWeight: FONT.weightMedium,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    width: '100%',
    ...SHADOW.button,
  },
  loginBtnText: {
    color: COLORS.surface,
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBlack,
  },
});
