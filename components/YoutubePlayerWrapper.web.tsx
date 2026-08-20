/**
 * YoutubePlayerWrapper.web.tsx
 * Web — stub that renders a "watch on YouTube" fallback.
 * Metro picks this file when bundling for web.
 * react-native-youtube-iframe is NEVER imported here.
 */

import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FONT, RADIUS, SPACING } from '@/components/styles';

interface Props {
  videoId: string;
  play: boolean;
  height: number;
  onChangeState: (state: string) => void;
}

export default function YoutubePlayerWrapper({ videoId }: Props) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <View style={s.container}>
      <MaterialCommunityIcons name="youtube" size={40} color="#FF0000" />
      <Text style={s.text}>Pemutar video hanya tersedia di aplikasi mobile.</Text>
      <TouchableOpacity
        style={s.btn}
        onPress={() => Linking.openURL(url).catch(() => {})}
      >
        <MaterialCommunityIcons name="open-in-new" size={16} color="#fff" />
        <Text style={s.btnText}>Buka di YouTube</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#dde8f0',
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  text: {
    fontSize: FONT.sizeSm,
    textAlign: 'center',
    marginTop: SPACING.xs,
    color: '#6b7f91',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#254091',
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
  },
  btnText: {
    color: '#fff',
    fontSize: FONT.sizeBase,
    fontWeight: '700',
  },
});
