import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, TAB_ICON } from '@/components/styles';
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';

function RodjaTabButton({ onPress, accessibilityState, colors }: any) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={s.rodjaButtonContainer}
    >
      <View
        style={[
          s.rodjaCircle,
          {
            borderColor: focused ? colors.primary : colors.surface,
            backgroundColor: '#0a192f',
          },
          focused && {
            shadowColor: colors.primary,
            shadowOpacity: 0.45,
            borderWidth: 3.5,
          },
        ]}
      >
        <Image
          source={require('@/assets/images/rodja-logo.png')}
          style={s.rodjaLogo}
          resizeMode="cover"
        />
      </View>
      <Text
        style={[
          s.rodjaText,
          { color: focused ? colors.primary : colors.textMuted },
        ]}
      >
        Rodja TV
      </Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { loading } = useAuth();
  const { colors } = useAppTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // App is open for both guests and authenticated jemaah!
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          elevation: 8,
          shadowOpacity: 0.08,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={TAB_ICON.size} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rodja"
        options={{
          title: 'Rodja TV',
          tabBarButton: (props) => <RodjaTabButton {...props} colors={colors} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={TAB_ICON.size} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  rodjaButtonContainer: {
    top: -14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    flex: 1,
  },
  rodjaCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  rodjaLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  liveDotIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  rodjaText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});



