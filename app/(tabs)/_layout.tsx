import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, TAB_ICON } from '@/components/styles';
import { useAuth } from '@/context/auth';

export default function TabLayout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // App is open for both guests and authenticated jemaah!
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TAB_ICON.activeColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderLight,
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
