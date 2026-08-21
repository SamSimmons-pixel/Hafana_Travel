import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '@/components/styles';
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';

interface PhonePromptModalProps {
  visible: boolean;
  canDismiss?: boolean;
  onDismiss?: () => void;
  onSuccess?: () => void;
}

export const PhonePromptModal: React.FC<PhonePromptModalProps> = ({
  visible,
  canDismiss = true,
  onDismiss,
  onSuccess,
}) => {
  const { user, updatePhone } = useAuth();
  const { colors } = useAppTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!visible || !user) return null;

  const handleSubmit = async () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Nomor telepon minimal 8 digit angka.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await updatePhone(cleanPhone);
    setSubmitting(false);

    if (res.error) {
      setErrorMsg(typeof res.error === 'string' ? res.error : 'Gagal menyimpan nomor telepon.');
    } else {
      Alert.alert('Sukses', 'Nomor telepon berhasil disimpan.');
      setPhoneNumber('');
      if (onSuccess) onSuccess();
      if (onDismiss) onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (canDismiss && onDismiss) {
          onDismiss();
        }
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* Close button only if dismissible */}
          {canDismiss && onDismiss && (
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onDismiss}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <MaterialCommunityIcons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          )}

          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="phone-plus" size={30} color={COLORS.primary} />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {canDismiss ? 'Lengkapi Nomor Telepon' : 'Wajib Mengisi Nomor Telepon'}
          </Text>

          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {canDismiss
              ? 'Masukkan nomor WhatsApp / HP Anda agar pembimbing rombongan dapat menghubungi Anda.'
              : 'Fitur ini memerlukan nomor telepon / WhatsApp yang aktif untuk keperluan rombongan.'}
          </Text>

          <View style={[styles.inputWrap, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Contoh: 081234567890"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text.replace(/[^0-9]/g, ''));
                if (errorMsg) setErrorMsg('');
              }}
              autoFocus
            />
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Simpan Nomor Telepon</Text>
            )}
          </TouchableOpacity>

          {canDismiss && onDismiss && (
            <TouchableOpacity style={styles.skipBtn} onPress={onDismiss}>
              <Text style={[styles.skipBtnText, { color: colors.textMuted }]}>Nanti Saja</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.card,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e6f7fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT.sizeLg,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xs,
  },
  inputWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT.sizeMd,
    fontWeight: '600',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: FONT.sizeXs,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: 6,
    ...SHADOW.card,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: FONT.sizeBase,
    fontWeight: '700',
  },
  skipBtn: {
    marginTop: SPACING.md,
    paddingVertical: 4,
  },
  skipBtnText: {
    fontSize: FONT.sizeSm,
    fontWeight: '600',
  },
});

