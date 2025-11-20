import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongItem } from '@/components/song-item';
import { usePlaylistReducer, Song } from '@/hooks/usePlaylistReducer';

const PLAYLIST_STORAGE_KEY = 'playlist_data';
const PLAYLIST_HISTORY_KEY = 'playlist_history';

export default function CreateScreen() {
  const { state, addSong, removeSong, clearPlaylist, setSongs, undo, redo, canUndo, canRedo } =
    usePlaylistReducer();
  const [songInput, setSongInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const countOpacity = useSharedValue(0);

  useEffect(() => {
    const animateCount = async () => {
      countOpacity.value = withTiming(1, { duration: 300 });
    };
    animateCount();
  }, [state.songs.length, countOpacity]);

  // Load playlist from AsyncStorage on mount
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const saved = await AsyncStorage.getItem(PLAYLIST_STORAGE_KEY);
        if (saved) {
          const songs: Song[] = JSON.parse(saved);
          setSongs(songs);
        }
      } catch (e) {
        console.error('Failed to load playlist:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlaylist();
  }, [setSongs]);

  // Save playlist to AsyncStorage whenever it changes
  useEffect(() => {
    const savePlaylist = async () => {
      try {
        await AsyncStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(state.songs));
      } catch (e) {
        console.error('Failed to save playlist:', e);
      }
    };

    if (!isLoading) {
      savePlaylist();
    }
  }, [state.songs, isLoading]);

  const handleAddSong = useCallback(() => {
    if (songInput.trim()) {
      addSong(songInput);
      setSongInput('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [songInput, addSong]);

  const handleRemoveSong = useCallback(
    (id: string) => {
      removeSong(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [removeSong]
  );

  const handleClear = useCallback(() => {
    if (state.songs.length > 0) {
      clearPlaylist();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [state.songs.length, clearPlaylist]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
      Haptics.selectionAsync();
    }
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
      Haptics.selectionAsync();
    }
  }, [canRedo, redo]);

  const countAnimStyle = useAnimatedStyle(() => ({
    opacity: countOpacity.value,
  }));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading playlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.safe}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>My Playlist</Text>
              <Animated.Text style={[styles.songCount, countAnimStyle]}>
                {state.songs.length} songs
              </Animated.Text>
            </View>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <TextInput
              value={songInput}
              onChangeText={setSongInput}
              placeholder="Add a song..."
              placeholderTextColor="#888"
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleAddSong}
            />
            <Pressable
              onPress={handleAddSong}
              style={[styles.addButton, { opacity: songInput.trim() ? 1 : 0.5 }]}
            >
              <IconSymbol name="plus" size={24} color="black" />
            </Pressable>
          </View>

          {/* Undo/Redo Section */}
          <View style={styles.historySection}>
            <Pressable
              onPress={handleUndo}
              disabled={!canUndo}
              style={[styles.historyButton, { opacity: canUndo ? 1 : 0.4 }]}
            >
              <IconSymbol name="arrow.uturn.left" size={18} color="white" />
              <Text style={styles.historyText}>Undo</Text>
            </Pressable>
            <Pressable
              onPress={handleRedo}
              disabled={!canRedo}
              style={[styles.historyButton, { opacity: canRedo ? 1 : 0.4 }]}
            >
              <IconSymbol name="arrow.uturn.right" size={18} color="white" />
              <Text style={styles.historyText}>Redo</Text>
            </Pressable>
          </View>

          {/* Songs List */}
          {state.songs.length > 0 ? (
            <FlatList
              data={state.songs}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <SongItem song={item} onRemove={handleRemoveSong} index={index} />
              )}
              scrollEnabled={false}
              style={styles.list}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No songs yet</Text>
              <Text style={styles.emptySubtext}>Add your first song to get started!</Text>
            </View>
          )}

          {/* Clear Button */}
          {state.songs.length > 0 && (
            <Pressable onPress={handleClear} style={styles.clearButton}>
              <IconSymbol name="trash" size={18} color="white" />
              <Text style={styles.clearText}>Clear Playlist</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#121212' },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#BBB', fontSize: 16 },
  header: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  songCount: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  inputSection: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#1DB954',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historySection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    gap: 6,
  },
  historyText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  list: {
    flex: 1,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  clearText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
});