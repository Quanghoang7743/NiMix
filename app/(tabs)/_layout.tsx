import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PlayMusicFooter from '../music/playMusic/playMusicFooter';
import { View, StyleSheet } from 'react-native';
import { scale } from '../lib/reponsiveAuto';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabTint = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tabTint,
          headerShown: false,
          tabBarButton: HapticTab,

        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Tìm kiếm',
            tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Thư viện',
            tabBarIcon: ({ color }) => <MaterialIcons name="my-library-music" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            title: 'Premium',
            tabBarIcon: ({ color }) => <MaterialIcons name="diamond" size={24} color={color} />,
          }}
        />
      </Tabs>
      <View style={{ position: 'absolute', bottom: scale(50), width: "100%", alignItems: "center" }} pointerEvents="box-none">
        <PlayMusicFooter />
      </View>
    </View>
  );
}
