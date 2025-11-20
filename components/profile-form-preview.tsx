import React, { useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

type Props = {
  username?: string;
  email?: string;
  genre?: string;
};

// Genre to color mapping
const genreColors: { [key: string]: string } = {
  Pop: '#FF1493',
  Rock: '#DC143C',
  Jazz: '#8B4513',
  Classical: '#FFD700',
  'Hip-Hop': '#FF6347',
  Electronic: '#00CED1',
  'R&B': '#8B008B',
  Country: '#FF8C00',
};

// Genre to placeholder image URL
const genreImageUrls: { [key: string]: string } = {
  Pop: 'https://via.placeholder.com/120/FF1493/FFFFFF?text=Pop',
  Rock: 'https://via.placeholder.com/120/DC143C/FFFFFF?text=Rock',
  Jazz: 'https://via.placeholder.com/120/8B4513/FFFFFF?text=Jazz',
  Classical: 'https://via.placeholder.com/120/FFD700/000000?text=Classical',
  'Hip-Hop': 'https://via.placeholder.com/120/FF6347/FFFFFF?text=HipHop',
  Electronic: 'https://via.placeholder.com/120/00CED1/FFFFFF?text=Electronic',
  'R&B': 'https://via.placeholder.com/120/8B008B/FFFFFF?text=RnB',
  Country: 'https://via.placeholder.com/120/FF8C00/FFFFFF?text=Country',
};

function ProfileFormPreviewComponent({ username, email, genre }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Animate in when data is present
    if (username || email || genre) {
      opacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 });
    }
  }, [username, email, genre, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Get color and image for current genre
  const backgroundColor = useMemo(() => {
    return genre && genreColors[genre] ? genreColors[genre] : '#1E1E1E';
  }, [genre]);

  const genreImage = useMemo(() => {
    return genre && genreImageUrls[genre] ? genreImageUrls[genre] : '';
  }, [genre]);

  // Only show preview if at least one field has data
  if (!username && !email && !genre) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.previewCard}>
        {/* Genre Image */}
        {genreImage ? (
          <Image
            source={{ uri: genreImage }}
            style={[styles.genreImage, { backgroundColor }]}
          />
        ) : (
          <View style={[styles.genreImagePlaceholder, { backgroundColor }]}>
            <Text style={styles.genrePlaceholderText}>♪</Text>
          </View>
        )}

        {/* Profile Info */}
        <View style={styles.info}>
          <Text style={styles.previewLabel}>Profile Preview</Text>

          {username ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Username:</Text>
              <Text style={styles.infoValue}>{username}</Text>
            </View>
          ) : null}

          {email ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {email}
              </Text>
            </View>
          ) : null}

          {genre ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Favorite:</Text>
              <View
                style={[
                  styles.genreTag,
                  { backgroundColor: backgroundColor + '30' },
                ]}
              >
                <Text style={[styles.genreTagText, { color: backgroundColor }]}>
                  {genre}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}

export const ProfileFormPreview = React.memo(ProfileFormPreviewComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  previewCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  genreImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  genreImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genrePlaceholderText: {
    fontSize: 40,
    color: 'white',
  },
  info: {
    flex: 1,
  },
  previewLabel: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoRow: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  genreTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  genreTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ProfileFormPreview;
