/**
 * YoutubePlayerWrapper.native.tsx
 * Native (iOS / Android) — wraps the real react-native-youtube-iframe.
 * Metro picks this file when bundling for native platforms.
 */

import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

interface Props {
  videoId: string;
  play: boolean;
  height: number;
  onChangeState: (state: string) => void;
}

export default function YoutubePlayerWrapper({ videoId, play, height, onChangeState }: Props) {
  return (
    <YoutubePlayer
      height={height}
      play={play}
      videoId={videoId}
      onChangeState={onChangeState}
    />
  );
}
