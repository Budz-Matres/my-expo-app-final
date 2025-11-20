import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Song } from '@/hooks/usePlaylistReducer';
import * as Haptics from 'expo-haptics';

type Props = {
  song: Song;
  onRemove: (id: string) => void;
  index: number;
};

function SongItemComponent({ song, onRemove, index }: Props) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-100);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateX.value = withSpring(0, { damping: 10, mass: 1 });
  }, [opacity, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const handleRemove = () => {
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => onRemove(song.id), 150);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View style={[styles.songContainer, animatedStyle]}>
      <View style={styles.songContent}>
        <Text style={styles.songIndex}>{index + 1}</Text>
        <View style={styles.songInfo}>
          <Text style={styles.songName} numberOfLines={1}>
            {song.name}
          </Text>
          <Text style={styles.songTime}>
            {new Date(song.addedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
      <Pressable onPress={handleRemove} style={styles.removeButton}>
        <IconSymbol name="xmark" size={18} color="#FF6B6B" />
      </Pressable>
    </Animated.View>
  );
}

export const SongItem = React.memo(SongItemComponent);

const styles = StyleSheet.create({
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginVertical: 6,
  },
  songContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songIndex: {
    color: '#1DB954',
    fontWeight: '700',
    fontSize: 14,
    marginRight: 12,
    minWidth: 20,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  songTime: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
});
