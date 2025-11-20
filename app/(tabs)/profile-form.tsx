import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProfileFormPreview } from '@/components/profile-form-preview';

const GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'R&B', 'Country'];
const FORM_CACHE_KEY = 'profile_form_cache';

// Validation regex patterns
const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileFormScreen() {
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [genre, setGenre] = useState<string | undefined>(undefined);

  // Validation state
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [genreError, setGenreError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Loading and UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Shake animations
  const usernameShake = useSharedValue(0);
  const emailShake = useSharedValue(0);
  const genreShake = useSharedValue(0);

  // Load cached form data on mount
  useEffect(() => {
    const loadCachedForm = async () => {
      try {
        const cached = await AsyncStorage.getItem(FORM_CACHE_KEY);
        if (cached) {
          const { username: u, email: e, genre: g } = JSON.parse(cached);
          setUsername(u || '');
          setEmail(e || '');
          setGenre(g || undefined);
        }
      } catch (err) {
        console.error('Failed to load cached form:', err);
      } finally {
        setIsLoading(false);
        setIsMounted(true);
      }
    };
    loadCachedForm();
  }, []);

  // Validate username in real-time
  useEffect(() => {
    if (!isMounted) return;
    
    if (username.length === 0) {
      setUsernameError('');
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
    } else if (!usernameRegex.test(username)) {
      setUsernameError('Only letters, numbers, and underscores allowed (3-20 chars)');
    } else {
      setUsernameError('');
    }
  }, [username, isMounted]);

  // Validate email in real-time
  useEffect(() => {
    if (!isMounted) return;

    if (email.length === 0) {
      setEmailError('');
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email (e.g., user@example.com)');
    } else {
      setEmailError('');
    }
  }, [email, isMounted]);

  // Validate genre in real-time
  useEffect(() => {
    if (!isMounted) return;

    if (!genre) {
      setGenreError('');
    } else if (!GENRES.includes(genre)) {
      setGenreError('Please select a valid genre');
    } else {
      setGenreError('');
    }
  }, [genre, isMounted]);

  // Shake animation helper
  const triggerShake = (shakeRef: Animated.SharedValue<number>) => {
    shakeRef.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  // Create animated styles
  const shakeStyle = (val: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [{ translateX: val.value }],
    }));

  const usernameAnimStyle = shakeStyle(usernameShake);
  const emailAnimStyle = shakeStyle(emailShake);
  const genreAnimStyle = shakeStyle(genreShake);

  // Handle form submission
  const handleSubmit = async () => {
    let hasErrors = false;

    // Validate all fields
    if (!usernameRegex.test(username)) {
      triggerShake(usernameShake);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      hasErrors = true;
    }

    if (!emailRegex.test(email)) {
      triggerShake(emailShake);
      if (!hasErrors) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      hasErrors = true;
    }

    if (!genre || !GENRES.includes(genre)) {
      triggerShake(genreShake);
      if (!hasErrors) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Success - show message and clear form
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSuccessMessage('Profile created successfully!');

    // Clear form and cache after delay
    setTimeout(async () => {
      try {
        await AsyncStorage.removeItem(FORM_CACHE_KEY);
      } catch (err) {
        console.error('Failed to clear cache:', err);
      }
      setUsername('');
      setEmail('');
      setGenre(undefined);
      setSuccessMessage('');
    }, 1500);
  };

  // Handle reset
  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem(FORM_CACHE_KEY);
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
    setUsername('');
    setEmail('');
    setGenre(undefined);
    setUsernameError('');
    setEmailError('');
    setGenreError('');
    setSuccessMessage('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Auto-save to cache when form changes
  useEffect(() => {
    if (!isMounted) return;

    const saveToCache = async () => {
      try {
        const data = { username, email, genre };
        await AsyncStorage.setItem(FORM_CACHE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Failed to cache form:', err);
      }
    };

    const timer = setTimeout(saveToCache, 500);
    return () => clearTimeout(timer);
  }, [username, email, genre, isMounted]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.safe}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>Customize your Spotify experience</Text>
          </View>

          {/* Success Message */}
          {successMessage ? (
            <View style={styles.successBanner}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#1DB954" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Username Field */}
          <Animated.View style={[styles.fieldContainer, usernameAnimStyle]}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              placeholderTextColor="#888"
              style={[styles.input, usernameError ? styles.inputError : null]}
              returnKeyType="next"
              autoCapitalize="none"
              maxLength={20}
            />
            {usernameError ? (
              <Animated.Text style={[styles.errorText, { opacity: useSharedValue(1) }]}>
                {usernameError}
              </Animated.Text>
            ) : null}
            <Text style={styles.inputHint}>{username.length}/20 characters</Text>
          </Animated.View>

          {/* Email Field */}
          <Animated.View style={[styles.fieldContainer, emailAnimStyle]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#888"
              style={[styles.input, emailError ? styles.inputError : null]}
              keyboardType={Platform.OS === 'web' ? 'email-address' : 'email-address'}
              autoCapitalize="none"
            />
            {emailError ? (
              <Animated.Text style={styles.errorText}>{emailError}</Animated.Text>
            ) : null}
          </Animated.View>

          {/* Genre Selection */}
          <Animated.View style={[styles.fieldContainer, genreAnimStyle]}>
            <Text style={styles.label}>Favorite Genre</Text>
            <View style={styles.genreGrid}>
              {GENRES.map((g) => {
                const isSelected = g === genre;
                return (
                  <Pressable
                    key={g}
                    onPress={() => setGenre(g)}
                    style={[
                      styles.genreButton,
                      isSelected ? styles.genreButtonSelected : null,
                      genreError && !isSelected ? styles.genreButtonError : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genreButtonText,
                        isSelected ? { color: 'black' } : { color: 'white' },
                      ]}
                    >
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {genreError ? (
              <Animated.Text style={styles.errorText}>{genreError}</Animated.Text>
            ) : null}
          </Animated.View>

          {/* Profile Preview */}
          <ProfileFormPreview username={username} email={email} genre={genre} />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <IconSymbol name="checkmark" size={20} color="black" />
              <Text style={styles.submitText}>Create Profile</Text>
            </Pressable>

            <Pressable
              onPress={handleReset}
              style={styles.resetButton}
            >
              <IconSymbol name="arrow.counterclockwise" size={18} color="#FF6B6B" />
              <Text style={styles.resetText}>Clear Form</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#121212' },
  container: { padding: 16, paddingBottom: 32 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#BBB', fontSize: 16 },

  header: { marginBottom: 24 },
  title: { color: 'white', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#888', fontSize: 14, marginTop: 4 },

  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E4620',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  successText: { color: '#1DB954', fontWeight: '600', fontSize: 14 },

  fieldContainer: { marginBottom: 20 },
  label: { color: '#BBB', fontSize: 14, fontWeight: '600', marginBottom: 8 },

  input: {
    height: 44,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: 'white',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: { borderColor: '#FF6B6B' },

  inputHint: { color: '#666', fontSize: 11, marginTop: 6 },

  errorText: { color: '#FF6B6B', fontSize: 12, marginTop: 6, fontWeight: '500' },

  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genreButtonSelected: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  genreButtonError: { borderColor: '#FF6B6B' },
  genreButtonText: { fontWeight: '600', fontSize: 13 },

  buttonContainer: { flexDirection: 'row', gap: 12, marginTop: 24 },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#1DB954',
    borderRadius: 8,
    gap: 8,
  },
  submitText: { color: 'black', fontWeight: '700', fontSize: 14 },

  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  resetText: { color: '#FF6B6B', fontWeight: '600', fontSize: 14 },
});
