import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme, PRESET_THEMES, type ThemeColors } from '@/store/themeStore';

const THEME_STORAGE_KEY = 'app_theme_preference';

export default function ThemeSwitcherScreen() {
  const { mode, currentTheme, setThemeMode, setCustomTheme, updateThemeColor } = useTheme();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [editingColor, setEditingColor] = useState<keyof ThemeColors | null>(null);
  const [colorInput, setColorInput] = useState('');

  const fadeAnim = useSharedValue(0);

  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved) {
          const { mode: savedMode, theme } = JSON.parse(saved);
          setThemeMode(savedMode);
          if (savedMode === 'custom' && theme) {
            setCustomTheme(theme);
          }
        }
      } catch (err) {
        console.error('Failed to load theme:', err);
      }
    };
    loadTheme();
  }, [setThemeMode, setCustomTheme]);

  // Save theme preference
  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({ mode, theme: currentTheme })
      );
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  // Handle theme mode change
  const handleThemeModeChange = (newMode: typeof mode) => {
    setThemeMode(newMode);
    setIsCustomizing(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate transition
    fadeAnim.value = withTiming(0.5, { duration: 200 });
    fadeAnim.value = withTiming(1, { duration: 300 });
  };

  // Handle preset theme selection
  const handlePresetTheme = (preset: typeof PRESET_THEMES[0]) => {
    setCustomTheme(preset);
    setIsCustomizing(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    saveThemePreference();
  };

  // Handle color edit
  const handleEditColor = (key: keyof ThemeColors) => {
    setEditingColor(key);
    setColorInput(currentTheme.colors[key]);
  };

  const handleColorSave = () => {
    if (editingColor && /^#[0-9A-F]{6}$/i.test(colorInput)) {
      updateThemeColor(editingColor, colorInput);
      setEditingColor(null);
      setColorInput('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      saveThemePreference();
    }
  };

  const fadeAnimStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const bgColor = currentTheme.colors.background;
  const textColor = currentTheme.colors.text;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]} edges={['top']}>
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        style={fadeAnimStyle}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Theme Settings</Text>
          <Text style={[styles.subtitle, { color: textColor + '80' }]}>
            Customize your app appearance
          </Text>
        </View>

        {/* Current Theme Display */}
        <View
          style={[
            styles.themePreview,
            { backgroundColor: currentTheme.colors.secondary },
          ]}
        >
          <Text style={[styles.previewLabel, { color: textColor }]}>
            Current Theme: {currentTheme.name}
          </Text>
          <View style={styles.colorGrid}>
            {(Object.entries(currentTheme.colors) as Array<
              [keyof ThemeColors, string]
            >).map(([key, color]) => (
              <Pressable
                key={key}
                onPress={() => handleEditColor(key)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  editingColor === key && styles.colorSwatchActive,
                ]}
              >
                <Text style={styles.colorLabel}>{key.slice(0, 2)}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Preset Themes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Preset Themes</Text>
          {PRESET_THEMES.map((preset) => (
            <Pressable
              key={preset.name}
              onPress={() => handlePresetTheme(preset)}
              style={[
                styles.themeButton,
                { backgroundColor: currentTheme.colors.secondary },
                mode === preset.name.toLowerCase() && styles.themeButtonActive,
              ]}
            >
              <View style={styles.presetColors}>
                {(Object.values(preset.colors) as string[]).slice(0, 3).map((color, i) => (
                  <View
                    key={i}
                    style={[styles.presetColorDot, { backgroundColor: color }]}
                  />
                ))}
              </View>
              <Text style={[styles.themeButtonText, { color: textColor }]}>
                {preset.name}
              </Text>
              {mode === preset.name.toLowerCase() && (
                <IconSymbol name="checkmark" size={20} color={currentTheme.colors.primary} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Color Customization */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Custom Colors</Text>
            <Switch
              value={isCustomizing}
              onValueChange={setIsCustomizing}
              trackColor={{
                false: currentTheme.colors.secondary,
                true: currentTheme.colors.primary + '80',
              }}
              thumbColor={currentTheme.colors.primary}
            />
          </View>

          {isCustomizing && (
            <View style={styles.customizationPanel}>
              {(
                Object.entries(currentTheme.colors) as Array<
                  [keyof ThemeColors, string]
                >
              ).map(([key, value]) => (
                <Pressable
                  key={key}
                  onPress={() => handleEditColor(key)}
                  style={[
                    styles.colorRow,
                    { backgroundColor: currentTheme.colors.secondary },
                    editingColor === key && {
                      borderColor: currentTheme.colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <View style={styles.colorRowLeft}>
                    <View
                      style={[styles.colorPreview, { backgroundColor: value }]}
                    />
                    <Text style={[styles.colorName, { color: textColor }]}>
                      {key}
                    </Text>
                  </View>
                  <Text style={[styles.colorValue, { color: textColor + '80' }]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Color Editor Modal */}
        {editingColor && (
          <View
            style={[
              styles.editorPanel,
              { backgroundColor: currentTheme.colors.secondary },
            ]}
          >
            <Text style={[styles.editorTitle, { color: textColor }]}>
              Edit {editingColor}
            </Text>
            <TextInput
              value={colorInput}
              onChangeText={setColorInput}
              placeholder="#000000"
              placeholderTextColor={textColor + '80'}
              style={[
                styles.colorInputField,
                {
                  backgroundColor: bgColor,
                  color: textColor,
                  borderColor: currentTheme.colors.primary,
                },
              ]}
              maxLength={7}
            />
            <View style={styles.editorButtons}>
              <Pressable
                onPress={() => setEditingColor(null)}
                style={[
                  styles.editorButton,
                  { backgroundColor: currentTheme.colors.secondary },
                ]}
              >
                <Text style={[styles.editorButtonText, { color: textColor }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleColorSave}
                style={[
                  styles.editorButton,
                  { backgroundColor: currentTheme.colors.primary },
                ]}
              >
                <Text style={[styles.editorButtonText, { color: 'black' }]}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Info */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: currentTheme.colors.secondary },
          ]}
        >
          <IconSymbol
            name="info.circle"
            size={16}
            color={currentTheme.colors.primary}
          />
          <Text style={[styles.infoText, { color: textColor }]}>
            Themes are saved and will persist across app restarts
          </Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },

  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },

  themePreview: { borderRadius: 12, padding: 16, marginBottom: 24 },
  previewLabel: { fontWeight: '600', marginBottom: 12 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorSwatch: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchActive: { borderWidth: 3, borderColor: '#FFFFFF' },
  colorLabel: { color: 'white', fontWeight: '700', fontSize: 10 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  themeButtonActive: { borderWidth: 2, borderColor: '#1DB954' },
  themeButtonText: { flex: 1, fontWeight: '600' },

  presetColors: { flexDirection: 'row', gap: 4 },
  presetColorDot: { width: 12, height: 12, borderRadius: 6 },

  customizationPanel: { marginTop: 12 },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  colorRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  colorPreview: { width: 24, height: 24, borderRadius: 6 },
  colorName: { fontWeight: '600' },
  colorValue: { fontSize: 12, fontFamily: 'monospace' },

  editorPanel: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  editorTitle: { fontWeight: '700', marginBottom: 12 },
  colorInputField: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontFamily: 'monospace',
    borderWidth: 2,
  },
  editorButtons: { flexDirection: 'row', gap: 8 },
  editorButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  editorButtonText: { fontWeight: '700' },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: { flex: 1, fontSize: 12 },
});
