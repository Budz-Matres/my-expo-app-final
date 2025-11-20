import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ProfilePreview } from '@/components/profile-preview';
import { useProfile } from '@/context/profileContext';

const GENRES = ['Pop', 'Hip-Hop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Indie', 'R&B', 'Country', 'Reggae'];

const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileSettings() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [genre, setGenre] = useState<string | undefined>(undefined);

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [genreError, setGenreError] = useState('');

  // Load saved profile on mount
  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setEmail(profile.email);
      setGenre(profile.genre);
    }
  }, [profile]);

  // shared values for shake animation
  const usernameShake = useSharedValue(0);
  const emailShake = useSharedValue(0);
  const genreShake = useSharedValue(0);

  const shakeStyle = (val: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX: withSequence(
            withTiming(-8 * val.value, { duration: 40 }),
            withTiming(8 * val.value, { duration: 40 }),
            withTiming(-6 * val.value, { duration: 40 }),
            withTiming(6 * val.value, { duration: 40 }),
            withTiming(0, { duration: 40 })
          ),
        },
      ],
    }));

  const usernameAnimStyle = shakeStyle(usernameShake);
  const emailAnimStyle = shakeStyle(emailShake);
  const genreAnimStyle = shakeStyle(genreShake);

  const triggerShake = (val: Animated.SharedValue<number>) => {
    val.value = 1;
    // after animation set back to 0 so next time can trigger
    setTimeout(() => (val.value = 0), 300);
  };

  const validate = () => {
    let ok = true;
    setUsernameError('');
    setEmailError('');
    setGenreError('');

    if (!usernameRegex.test(username)) {
      setUsernameError('Username must be 3-20 chars: letters, numbers, underscores.');
      triggerShake(usernameShake);
      ok = false;
    }

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      triggerShake(emailShake);
      ok = false;
    }

    if (!genre || GENRES.indexOf(genre) === -1) {
      setGenreError('Please choose a genre.');
      triggerShake(genreShake);
      ok = false;
    }

    if (!ok) {
      Haptics.selectionAsync();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Save profile to context/AsyncStorage
      setProfile({ username, email, genre });
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Profile Settings</Text>

        <Animated.View style={[styles.field, usernameAnimStyle as any]}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={(t) => setUsername(t)}
            placeholder="username"
            placeholderTextColor="#888"
            style={styles.input}
            returnKeyType="next"
            autoCapitalize="none"
          />
          {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}
        </Animated.View>

        <Animated.View style={[styles.field, emailAnimStyle as any]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(t) => setEmail(t)}
            placeholder="you@example.com"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType={Platform.OS === 'web' ? 'email-address' : 'email-address'}
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
        </Animated.View>

        <Animated.View style={[styles.field, genreAnimStyle as any]}>
          <Text style={styles.label}>Favorite Genre</Text>
          <View style={styles.genreList}>
            {GENRES.map((g) => {
              const selected = g === genre;
              return (
                <Pressable
                  key={g}
                  onPress={() => setGenre(g)}
                  style={[styles.genreItem, selected ? styles.genreSelected : null]}
                >
                  <Text style={[styles.genreText, selected ? { color: 'black' } : { color: 'white' }]}>{g}</Text>
                </Pressable>
              );
            })}
          </View>
          {genreError ? <Text style={styles.error}>{genreError}</Text> : null}
        </Animated.View>

        <ProfilePreview username={username} email={email} genre={genre} />

        <Pressable style={styles.saveButton} onPress={validate}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#121212' },
  container: { padding: 16 },
  title: { color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  field: { marginBottom: 12 },
  label: { color: '#BBB', marginBottom: 6 },
  input: {
    height: 44,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: 'white',
  },
  genreList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    marginRight: 8,
    marginBottom: 8,
  },
  genreSelected: { backgroundColor: '#1DB954' },
  genreText: { color: 'white', fontWeight: '600' },
  error: { color: '#FF6B6B', marginTop: 6 },
  saveButton: {
    marginTop: 18,
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: 'black', fontWeight: '700' },
});
