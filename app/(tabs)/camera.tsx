import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';

const FILTER_TYPES = ['none', 'grayscale', 'sepia', 'cool', 'warm'] as const;
type FilterType = typeof FILTER_TYPES[number];

interface PhotoState {
  uri: string;
  filter: FilterType;
  intensity: number;
}

// Filter intensity slider component
const FilterSlider = React.memo(
  ({
    value,
    onChange,
    label,
    color,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
    color: string;
  }) => {
    return (
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={styles.slider}>
          <View
            style={[
              styles.sliderFill,
              { width: `${value}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.sliderValue}>{Math.round(value)}%</Text>
      </View>
    );
  }
);

// Camera filter preview component with memoization
const CameraPreview = React.memo(
  ({
    photoUri,
    filter,
    intensity,
  }: {
    photoUri: string;
    filter: FilterType;
    intensity: number;
  }) => {
    const filteredUri = useMemo(() => {
      // In a real app, you'd apply actual image filters here
      // For demo, we'll use CSS filters via react-native-web if available
      return photoUri;
    }, [photoUri, filter, intensity]);

    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: filteredUri }}
          style={styles.previewImage}
        />
        {/* Filter overlay effect simulation */}
        {filter !== 'none' && (
          <View
            style={[
              styles.filterOverlay,
              {
                opacity: intensity / 100,
                backgroundColor:
                  filter === 'grayscale'
                    ? '#808080'
                    : filter === 'sepia'
                    ? '#704230'
                    : filter === 'cool'
                    ? '#0080FF'
                    : '#FF8000',
              },
            ]}
          />
        )}
      </View>
    );
  }
);

export default function CameraScreen() {
  const [photoState, setPhotoState] = useState<PhotoState | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fadeAnim = useSharedValue(0);

  // Simulate camera capture
  const handleCapturePhoto = async () => {
    // In a real app, you'd use expo-camera to capture
    // For demo, we'll use a placeholder
    const mockPhotoUri = 'https://via.placeholder.com/400x600/1DB954/FFFFFF?text=Camera+Photo';
    setPhotoState({
      uri: mockPhotoUri,
      filter: 'none',
      intensity: 50,
    });
    setIsPreviewMode(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate transition
    fadeAnim.value = withTiming(1, { duration: 400 });
  };

  const handleFilterChange = (filter: FilterType) => {
    if (photoState) {
      setPhotoState({ ...photoState, filter });
      Haptics.selectionAsync();
    }
  };

  const handleIntensityChange = (intensity: number) => {
    if (photoState) {
      setPhotoState({ ...photoState, intensity });
    }
  };

  const handleReset = () => {
    setPhotoState(null);
    setIsPreviewMode(false);
    fadeAnim.value = withTiming(0, { duration: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRotate = () => {
    if (photoState) {
      // In real app, implement rotation logic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleCrop = () => {
    if (photoState) {
      // In real app, implement crop logic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const fadeAnimStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {!isPreviewMode ? (
        // Camera View
        <View style={styles.cameraContainer}>
          <View style={styles.cameraViewfinder}>
            <IconSymbol name="camera.fill" size={80} color="#1DB954" />
            <Text style={styles.cameraPrompt}>Tap to take a photo</Text>
          </View>

          <Pressable
            onPress={handleCapturePhoto}
            style={styles.captureButton}
          >
            <View style={styles.captureCircle} />
          </Pressable>
        </View>
      ) : (
        // Filter & Editing View
        <Animated.ScrollView
          contentContainerStyle={styles.previewContainer}
          style={fadeAnimStyle}
        >
          {photoState && (
            <>
              {/* Photo Preview */}
              <CameraPreview
                photoUri={photoState.uri}
                filter={photoState.filter}
                intensity={photoState.intensity}
              />

              {/* Filter Selection */}
              <View style={styles.filtersSection}>
                <Text style={styles.sectionTitle}>Filters</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.filterScroll}
                >
                  {FILTER_TYPES.map((filter) => (
                    <Pressable
                      key={filter}
                      onPress={() => handleFilterChange(filter)}
                      style={[
                        styles.filterButton,
                        photoState.filter === filter &&
                          styles.filterButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          photoState.filter === filter &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Intensity Slider */}
              {photoState.filter !== 'none' && (
                <View style={styles.intensitySection}>
                  <FilterSlider
                    value={photoState.intensity}
                    onChange={handleIntensityChange}
                    label="Filter Intensity"
                    color="#1DB954"
                  />
                </View>
              )}

              {/* Editing Tools */}
              <View style={styles.toolsSection}>
                <Text style={styles.sectionTitle}>Edit</Text>
                <View style={styles.toolsGrid}>
                  <Pressable
                    onPress={handleRotate}
                    style={styles.toolButton}
                  >
                    <IconSymbol name="arrow.counterclockwise" size={24} color="#1DB954" />
                    <Text style={styles.toolLabel}>Rotate</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleCrop}
                    style={styles.toolButton}
                  >
                    <IconSymbol name="rectangle.and.pencil.and.ellipsis" size={24} color="#1DB954" />
                    <Text style={styles.toolLabel}>Crop</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      /* Flip horizontally */
                    }}
                    style={styles.toolButton}
                  >
                    <IconSymbol name="arrow.left.and.right" size={24} color="#1DB954" />
                    <Text style={styles.toolLabel}>Flip</Text>
                  </Pressable>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable
                  onPress={handleReset}
                  style={[styles.actionButton, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Retake</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    handleReset();
                  }}
                  style={[styles.actionButton, styles.saveButton]}
                >
                  <Text style={styles.saveButtonText}>Save Photo</Text>
                </Pressable>
              </View>
            </>
          )}
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#121212' },

  // Camera View
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  cameraViewfinder: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 2,
    borderColor: '#1DB954',
    borderRadius: 12,
    margin: 16,
  },
  cameraPrompt: {
    color: '#BBB',
    marginTop: 12,
    fontSize: 14,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#121212',
  },

  // Preview View
  previewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  previewImage: {
    width: width - 32,
    height: 400,
    borderRadius: 12,
    marginBottom: 16,
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },

  filtersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  filterScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1DB954',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: 'black',
  },

  intensitySection: {
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 12,
  },
  sliderLabel: {
    color: '#BBB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  slider: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  sliderValue: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },

  toolsSection: {
    marginBottom: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolButton: {
    alignItems: 'center',
    gap: 8,
  },
  toolLabel: {
    color: '#BBB',
    fontSize: 12,
    fontWeight: '500',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A2A',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#1DB954',
  },
  saveButtonText: {
    color: 'black',
    fontWeight: '700',
  },
});
