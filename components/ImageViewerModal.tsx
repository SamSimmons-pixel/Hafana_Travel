/**
 * Reusable Fullscreen Image Viewer Modal — components/ImageViewerModal.tsx
 *
 * Fullscreen modal with horizontal paging (swipe left/right),
 * index counter, caption display, and close button.
 * Used for both Galeri and Testimoni tabs.
 */

import React, { useRef, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SPACING } from '@/components/styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface GalleryItemData {
  id: string | number;
  imageUrl: string;
  caption?: string | null;
}

interface ImageViewerModalProps {
  visible: boolean;
  items: GalleryItemData[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageViewerModal({
  visible,
  items,
  initialIndex,
  onClose,
}: ImageViewerModalProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  };

  if (!visible || items.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={s.container}>
        {/* ── TOP BAR ── */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <MaterialCommunityIcons name="close" size={26} color="#ffffff" />
          </TouchableOpacity>
          <Text style={s.counter}>
            {currentIndex + 1} / {items.length}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ── IMAGE SWIPER ── */}
        <FlatList
          ref={flatListRef}
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex >= 0 && initialIndex < items.length ? initialIndex : 0}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onMomentumScrollEnd={handleScroll}
          renderItem={({ item }) => (
            <View style={s.slide}>
              <Image
                source={{ uri: item.imageUrl }}
                style={s.image}
                resizeMode="contain"
              />
            </View>
          )}
        />

        {/* ── CAPTION FOOTER ── */}
        {items[currentIndex]?.caption ? (
          <View style={s.captionBox}>
            <Text style={s.captionText}>
              {items[currentIndex].caption}
            </Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: 48,
    paddingBottom: SPACING.md,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  closeBtn: {
    padding: 6,
  },
  counter: {
    color: '#ffffff',
    fontSize: FONT.sizeBase,
    fontWeight: FONT.weightBold,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 180,
  },
  captionBox: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  captionText: {
    color: '#ffffff',
    fontSize: FONT.sizeSm,
    textAlign: 'center',
  },
});
