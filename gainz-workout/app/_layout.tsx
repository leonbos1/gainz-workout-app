import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Text } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

import { Workout } from '@/models/Workout';
import { Exercise } from '@/models/Exercise';
import { MuscleGroup } from '@/models/MuscleGroup';
import { Set } from '@/models/Set';
import { Batch } from '@/models/Batch';

import { createTables } from '@/database/database';

import * as SQLite from 'expo-sqlite';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const setupDatabase = async () => {
    try {
      await createTables();
    }
    catch (error) {
      // console.error('Failed to set up database:', error);
    }
  }

  const debugDb = async () => {
    try {
    }
    catch (error) {
      console.error('Failed to debug database:', error);
    }
  }

  useEffect(() => {
    if (loaded) {
      setupDatabase();
      debugDb();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
