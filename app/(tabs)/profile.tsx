/**
 * Profile Screen — app/(tabs)/profile.tsx
 * Hafana Umrah Travel — Jemaah Profile & Verification Data
 *
 * Displays:
 *  - Nama Jemaah
 *  - Nomor Visa
 *  - Tanggal Lahir
 *  - Nomor Paspor
 *  - Group Rombongan Keberangkatan
 *
 * If guest (unauthenticated): Shows verification prompt card with "Masuk / Verifikasi Visa" CTA button.
 */

import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  COLORS, FONT, RADIUS, SPACING, SHADOW,
  layoutStyles, textStyles,
} from '@/components/styles';
import { useAuth } from '@/context/auth';

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

  return (
    <SafeAreaView style={layoutStyles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── TOP BAR ── */}
      <View style={s.topBar}>
        <Text style={s.topBarTitle}>Profil Jemaah</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {user ? (
          /* ── LOGGED IN JEMAAH VIEW ── */
          <>
            {/* Header Profile Card */}
            <View style={s.profileCard}>
              <View style={s.avatarCircle}>
                <Text style={s.avatarText}>
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'JM'}
                </Text>
              </View>
              <Text style={s.userName}>{user.name}</Text>
              <View style={s.verifiedBadge}>
                <MaterialCommunityIcons name="check-decagram" size={16} color={COLORS.surface} />
                <Text style={s.verifiedText}>Jemaah Terverifikasi</Text>
              </View>
            </View>

            {/* Information Grid Card */}
            <View style={s.infoCard}>
              <Text style={s.cardHeading}>Data Dokumen Jemaah</Text>

              {/* Nama Jemaah */}
              <InfoItem
                icon="account"
                label="Nama Jemaah"
                value={user.name}
              />
              <Divider />

              {/* Nomor Visa */}
              <InfoItem
                icon="card-account-details-outline"
                label="Nomor Visa (Username Login)"
                value={user.nomor_visa || '-'}
                highlight
              />
              <Divider />

              {/* Tanggal Lahir */}
              <InfoItem
                icon="calendar"
                label="Tanggal Lahir"
                value={formatDate(user.tanggal_lahir)}
              />
              <Divider />

              {/* Nomor Paspor */}
              <InfoItem
                icon="passport"
                label="Nomor Paspor"
                value={user.nomor_paspor || '-'}
              />
              <Divider />

              {/* Group Rombongan Keberangkatan */}
              <InfoItem
                icon="account-group"
                label="Group Rombongan Keberangkatan"
                value={user.group?.nama_group || 'Belum Ditempatkan dalam Group'}
                badge
              />
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={s.logoutBtn}
              onPress={handleSignOut}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={s.logoutBtnText}>Keluar / Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* ── GUEST / UNAUTHENTICATED VIEW ── */
          <View style={s.guestCard}>
            <View style={s.guestIconCircle}>
              <MaterialCommunityIcons name="shield-account-outline" size={48} color={COLORS.primary} />
            </View>

            <Text style={s.guestTitle}>Verifikasi Data Jemaah</Text>
            <Text style={s.guestSub}>
              Anda dapat menjelajahi aplikasi Hafana Travel secara bebas. Untuk melihat data visa, paspor, dan rombongan keberangkatan Anda, silakan masuk.
            </Text>

            <View style={s.guestBenefits}>
              <View style={s.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primary} />
                <Text style={s.benefitText}>Cek Nomor Visa & Nomor Paspor Jemaah</Text>
              </View>
              <View style={s.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primary} />
                <Text style={s.benefitText}>Lihat Info Group Rombongan Keberangkatan</Text>
              </View>
              <View style={s.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primary} />
                <Text style={s.benefitText}>Akses Terintegrasi dengan Admin Hafana Travel</Text>
              </View>
            </View>

            <TouchableOpacity
              style={s.loginBtn}
              onPress={handleLoginPress}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="login" size={20} color={COLORS.surface} style={{ marginRight: 8 }} />
              <Text style={s.loginBtnText}>Masuk / Verifikasi Visa</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-component for info rows ──
function InfoItem({
  icon,
  label,
  value,
  highlight = false,
  badge = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
  badge?: boolean;
}) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIconBox}>
        <MaterialCommunityIcons name={icon as any} size={20} color={COLORS.primary} />
      </View>
      <View style={s.infoContent}>
        <Text style={s.infoLabel}>{label}</Text>
        {badge ? (
          <View style={s.groupBadgeBox}>
            <Text style={s.groupBadgeText}>{value}</Text>
          </View>
        ) : (
          <Text style={[s.infoValue, highlight && s.infoValueHighlight]}>
            {value}
          </Text>
        )}
      </View>
    </View>
  );
}

function Divider() {
  return <View style={s.divider} />;
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
