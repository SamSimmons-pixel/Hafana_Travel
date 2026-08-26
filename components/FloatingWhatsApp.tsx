/**
 * Floating WhatsApp Widget — components/FloatingWhatsApp.tsx
 * Draggable Floating Button & Interactive WhatsApp Chat Popup
 */

import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Linking,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/theme';
import { FONT, RADIUS, SHADOW, SPACING } from '@/components/styles';
import { useAuth } from '@/context/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 54;
const DEFAULT_X = SCREEN_WIDTH - BUTTON_SIZE - 16;
const DEFAULT_Y = SCREEN_HEIGHT * 0.42; // slightly above middle

const WA_URL =
  'https://api.whatsapp.com/send?phone=6281222322360&text=Assalamualaikum%20dengan%20admin%20hafanatravel.com%20%3F%0Aboleh%20minta%20info%20lengkap%20tentang%20paket%20Umrahnya%3F';

export function FloatingWhatsApp() {
  const { user } = useAuth();
  const { isDarkMode, colors } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const pan = useRef(new Animated.ValueXY({ x: DEFAULT_X, y: DEFAULT_Y })).current;
  const currentPos = useRef({ x: DEFAULT_X, y: DEFAULT_Y });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        const newX = currentPos.current.x + gestureState.dx;
        const newY = currentPos.current.y + gestureState.dy;

        // Detect Tap (movement < 6px)
        const distance = Math.hypot(gestureState.dx, gestureState.dy);
        if (distance < 6) {
          setModalVisible(true);
          return;
        }

        // Clamp to screen bounds with padding
        const clampedX = Math.min(Math.max(newX, 10), SCREEN_WIDTH - BUTTON_SIZE - 10);
        const clampedY = Math.min(Math.max(newY, 60), SCREEN_HEIGHT - BUTTON_SIZE - 110);

        currentPos.current = { x: clampedX, y: clampedY };
        Animated.spring(pan, {
          toValue: { x: clampedX, y: clampedY },
          useNativeDriver: false,
          friction: 6,
          tension: 40,
        }).start();
      },
    })
  ).current;

  const handleOpenWhatsApp = () => {
    setModalVisible(false);
    Linking.openURL(WA_URL).catch(() => {});
  };

  return (
    <>
      {/* ── DRAGGABLE FLOATING BUTTON ── */}
      <Animated.View
        style={[
          s.floatingButtonContainer,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={s.floatingButton}>
          <MaterialCommunityIcons name="whatsapp" size={32} color="#ffffff" />
          <View style={s.onlineDot} />
        </View>
      </Animated.View>

      {/* ── INTERACTIVE POPUP CHAT BOX MODAL ── */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={s.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  s.popupBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Heading */}
                <View style={s.popupHeading}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.popupTitle}>Assalamualaikum {user?.name ?? 'Jemaah'}</Text>
                    <Text style={s.popupIntro}>
                      Ada yang bisa dibantu? Yuk ngobrol sekarang di{' '}
                      <Text style={{ fontWeight: '800' }}>WhatsApp</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={s.closeBtn}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons name="close" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>

                {/* Content Body */}
                <View style={s.popupBody}>
                  <Text style={[s.popupNotice, { color: colors.textMuted }]}>
                    Tunggu sebentar admin akan merespon segera
                  </Text>

                  {/* Consultation Item */}
                  <TouchableOpacity
                    style={[
                      s.consultationItem,
                      {
                        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={handleOpenWhatsApp}
                  >
                    {/* Avatar with Online status */}
                    <View style={s.avatarContainer}>
                      <View style={s.avatarCircle}>
                        <MaterialCommunityIcons name="whatsapp" size={26} color="#ffffff" />
                      </View>
                      <View style={s.avatarOnlineBadge} />
                    </View>

                    {/* Duty Text */}
                    <View style={s.consultationInfo}>
                      <Text style={[s.memberName, { color: colors.textPrimary }]}>
                        Konsultasi
                      </Text>
                      <Text style={[s.memberDuty, { color: colors.textSecondary }]}>
                        Chat dengan admin sekarang
                      </Text>
                    </View>

                    {/* Send / Action Arrow */}
                    <View style={s.sendActionIcon}>
                      <MaterialCommunityIcons name="send" size={16} color="#2db742" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  floatingButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#2db742',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  onlineDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  popupBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    ...SHADOW.card,
    shadowOpacity: 0.2,
    elevation: 12,
  },
  popupHeading: {
    backgroundColor: '#2db742',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  popupTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  popupIntro: {
    color: '#d9ebc6',
    fontSize: 12,
    lineHeight: 16,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  popupBody: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  popupNotice: {
    fontSize: 11,
    textAlign: 'center',
  },
  consultationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2db742',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOnlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  consultationInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FONT.sizeSm + 1,
    fontWeight: '700',
    marginBottom: 2,
  },
  memberDuty: {
    fontSize: 11,
  },
  sendActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(45, 183, 66, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
