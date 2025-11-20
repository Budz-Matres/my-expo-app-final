import {View, ScrollView, Image, Pressable, StyleSheet, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LibraryScreen() {
  const router = useRouter();

  const imageURL = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
    // 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1080&q=80'
  ];

    const titleList = Array.from({ length: imageURL.length }, (_, i) => `Playlist ${i + 1}`);
    const authorList = Array.from({ length: imageURL.length }, (_, i) => `Author ${String.fromCharCode(65 + (i % 26))}`);


  // Calculate square width
  const screenWidth = Dimensions.get('window').width;
  const spacing = 16;
  const numColumns = 3;
  const squareSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); 
    router.replace("/login");              
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212'}} edges={['top']} >
      
        <View style={styles.header}>
        <View style={styles.headerLeft}>
            <Pressable style={styles.profileIcon} onPress={handleLogout}>
            <Image
                source={require('@/assets/images/MisterMatres.png')}
                style={styles.profileImage}
            />
            </Pressable>
            <Text style={styles.headerTitle}>My Library</Text>
        </View>

        <Pressable onPress={() => router.push('/search')}>
            <IconSymbol name="magnifyingglass" size={28} color="white" />
        </Pressable>
        </View>

      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {imageURL.map((url, index) => (
            <View key={index} style={[styles.playlist, { width: squareSize }]}>
              <Pressable> 
                <Image source={{ uri: url }} style={[styles.image, { width: squareSize, height: squareSize }]} />
                <Text style={styles.title} numberOfLines={1}>
                    {titleList[index]}
                </Text>
                <Text style={styles.author} numberOfLines={1}>
                    {authorList[index]}
                </Text>
              </Pressable> 
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#121212',

    shadowColor: '#000', //iOS shadow
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5, //Android shadow
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingTop: 60, // same as header height
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  item: {
    height: 60,
    backgroundColor: '#333',
    marginBottom: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
    headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, 
    },

    headerTitle: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: 'white',
    },


  // scrollableContent
  container: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playlist: {
    marginBottom: 24,
  },
  image: {
    borderRadius: 8,
    backgroundColor: '#555', // placeholder background
  },
  title: {
    marginTop: 4,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },
  author: {
    color: 'gray',
    fontSize: 12,
  },


});