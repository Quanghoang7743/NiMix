import React, { useEffect, type ReactNode } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from './context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGuard({ children }: { children: ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isHydrating, profile } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  useEffect(() => {
    if (segments.length) {
      setIsNavigationReady(true);
    }
  }, [segments]);

  useEffect(() => {
    if (isHydrating || !isNavigationReady || !segments.length) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const currentRoute = segments[1] ?? '';
    const isProtectedAuthRoute = inAuthGroup && ['settings'].includes(currentRoute);

    if ((!isAuthenticated || !profile) && (!inAuthGroup || isProtectedAuthRoute)) {
      router.replace('/homeAuth');
    }

    if (isAuthenticated && profile && inAuthGroup && !isProtectedAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [segments, isAuthenticated, profile, router, isNavigationReady, isHydrating]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthGuard>
      </ThemeProvider>
    </AuthProvider>
  );
}
