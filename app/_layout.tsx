import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack , Redirect} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProfileProvider } from '@/context/profileContext';



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);

  if (isLoggedIn === null) {
    return null; 
  }

  return (
    <ProfileProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        {isLoggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />}
        <StatusBar style="auto" />
      </ThemeProvider>
    </ProfileProvider>
  );
}
