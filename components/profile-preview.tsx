import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Props = {
  username?: string;
  email?: string;
  genre?: string;
};

function ProfilePreviewComponent({ username, email, genre }: Props) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    // fade in when any field is filled, fade out when none
    if (username || email || genre) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [username, email, genre, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: opacity.value < 0.5 ? 6 : 0 }],
  }));

  if (!username && !email && !genre) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={require('@/assets/images/MisterMatres.png')} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username}>{username ?? '—'}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
        {genre ? <Text style={styles.genre}>Fav genre: {genre}</Text> : null}
      </View>
    </Animated.View>
  );
}

export const ProfilePreview = React.memo(ProfilePreviewComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginVertical: 12,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  info: { flex: 1 },
  username: { color: 'white', fontSize: 16, fontWeight: '700' },
  email: { color: '#BBB', marginTop: 4 },
  genre: { color: '#9fdfb2', marginTop: 6, fontWeight: '600' },
});

export default ProfilePreview;
