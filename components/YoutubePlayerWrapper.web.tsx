/**
 * YoutubePlayerWrapper.web.tsx
 * Web — embeds YouTube iframe player for web environments.
 * react-native-youtube-iframe is NEVER imported here.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  videoId: string;
  play: boolean;
  height: number;
  onChangeState: (state: string) => void;
}

export default function YoutubePlayerWrapper({ videoId, play, height }: Props) {
  return (
    <View style={[s.container, { height }]}>
      {/* @ts-ignore */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${play ? 1 : 0}&enablejsapi=1&rel=0`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 12,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
});

