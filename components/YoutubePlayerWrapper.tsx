/**
 * YoutubePlayerWrapper.tsx
 *
 * This file exists ONLY for TypeScript's type resolution.
 * Metro bundler will always prefer:
 *   - YoutubePlayerWrapper.native.tsx  → iOS / Android
 *   - YoutubePlayerWrapper.web.tsx     → Web
 * and will NEVER load this file at runtime.
 */

import React from 'react';
import { View } from 'react-native';

interface Props {
  videoId: string;
  play: boolean;
  height: number;
  onChangeState: (state: string) => void;
}

// Fallback stub — never actually rendered.
export default function YoutubePlayerWrapper(_props: Props) {
  return <View />;
}
