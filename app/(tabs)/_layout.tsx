import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import RodjaLogoSvg from '@/components/RodjaLogoSvg';
import { TAB_ICON } from '@/components/styles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/auth';
import { useAppTheme } from '@/context/theme';


function RodjaTabButton({ onPress, accessibilityState, colors }: any) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[s.rodjaButtonContainer, { backgroundColor: 'transparent' }]}
    >
      <View
        style={[
          s.rodjaCircle,
          {
            borderColor: focused ? colors.primary : colors.surface,
            backgroundColor: focused ? colors.primary : colors.surface,
          },
          focused && {
            shadowColor: colors.primary,
            shadowOpacity: 0.45,
            borderWidth: 3.5,
          },
        ]}
      >
        <RodjaLogoSvg size={44} />
      </View>
      <Text
        style={[
          s.rodjaText,
          { color: focused ? colors.primary : colors.textMuted },
        ]}
      >
        Live Rodja TV
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
          tabBarItemStyle: { backgroundColor: 'transparent' },
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
    backgroundColor: 'transparent',
  },
  rodjaCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  rodjaLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  rodjaText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});



