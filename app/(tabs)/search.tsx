import { IconSymbol } from '@/components/ui/icon-symbol';
import { useProfile } from '@/context/profileContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const { profile } = useProfile();
    const scrollY = new Animated.Value(0);
    const translateYHeader = scrollY.interpolate({
        inputRange: [0, 60], 
        outputRange: [0, -60],
        extrapolate: 'clamp',
    });
    const colorArray = [
  '#FF6633','#FFB399','#FF33FF','#FFFF99','#00B3E6',
  '#E6B333','#3366E6','#999966','#99FF99','#B34D4D',
  '#80B300','#809900','#E6B3B3','#6680B3','#66991A',
  '#FF99E6','#CCFF1A','#FF1A66','#E6331A','#33FFCC',
  '#66994D','#B366CC','#4D8000','#B33300','#CC80CC',
  '#66664D'
    ];
    const categoryList = [
    'Made for you', 'Upcoming releases', 'New Releases', 'Pinoy Music', 'Pop', 'Hip-Hop', 'K-pop',
    'Charts', 'Podcast Charts', 'Podcast Fresh Finds', 'Rock', 'Jazz', 'Classical', 'Electronic', 
    'Indie', 'R&B', 'Soul', 'Country', 'Reggae', 'Latin', 'Blues', 'Metal', 'Folk', 'Dance', 'Soundtracks', 'Comedy'
    ];

    


  // Calculate square width
  const screenWidth = Dimensions.get('window').width;
  const spacing = 16;
  const numColumns = 2;
  const squareSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); 
    router.replace("/login");              
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top']}>
    <ScrollView
        contentContainerStyle={{ padding: 16 }}
        stickyHeaderIndices={[1]} //second child becomes sticky only
    >
        
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Pressable style={styles.profileIcon} onPress={() => router.push('/profile-settings')} onLongPress={handleLogout}>
                <Image source={require('@/assets/images/MisterMatres.png')} style={styles.profileImage} />
                </Pressable>
                <View>
                  {profile?.username ? (
                    <Text style={styles.usernameText}>{profile.username}</Text>
                  ) : null}
                  <Text style={styles.headerTitle}>Search</Text>
                </View>
            </View>
            <Pressable>
                <IconSymbol name="camera" size={28} color="white" />
            </Pressable>
        </View>

       
        <View style={styles.searchInputContainer}>
        <TextInput
            placeholder="Search"
            placeholderTextColor="#888"
            style={styles.searchInput}
        />
        </View>

        {/* Grid content */}
        <View style={styles.grid}>
        {colorArray.map((color, index) => (
            <View key={index} style={[styles.playlist, { width: squareSize }]}>
            <Pressable style={[styles.colorSquare, { backgroundColor: color, height: squareSize - 50 }]}>
                <Text style={styles.categoryText} numberOfLines={1}>{categoryList[index]}</Text>
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
  usernameText: {
    color: '#BBB',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
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
    colorSquare: {
    width: '100%',
    

    borderRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    },
    categoryText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    },
    searchInputContainer: {
    backgroundColor: '#121212',
    paddingVertical: 8,
    },
    searchInput: {
    height: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: 'white',
    },
    });