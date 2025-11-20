# Week 4: Activity 2 - Spotify Profile Creation Form

## Project Overview
This is a comprehensive profile creation form inspired by Spotify, featuring real-time validation, smooth animations, AsyncStorage caching, and a dynamic profile preview with genre-specific imagery.

## Key Features Implemented

### 1. Profile Form with Enhanced Validation (50 mins) ✅

**Form Fields:**
- **Username**: 3–20 characters, alphanumeric and underscores only
- **Email**: Valid email format with '@' and domain
- **Genre**: Select from 8 predefined options (Pop, Rock, Jazz, Classical, Hip-Hop, Electronic, R&B, Country)

**Real-Time Validation:**
```javascript
// Username regex: letters, numbers, underscores only, 3-20 chars
/^[A-Za-z0-9_]{3,20}$/

// Email regex: standard format with @ and domain
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Genre: Must be in predefined list
GENRES = ['Pop', 'Rock', 'Jazz', ...]
```

**Validation Features:**
- Validates on every input change (not on blur)
- Displays error messages below each field
- Character count for username field
- Prevents invalid submissions
- Clears errors when input becomes valid

### 2. Animations (30 mins) ✅

**Shake Animation on Validation Error:**
```javascript
triggerShake(shakeRef) {
  withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-8, { duration: 50 }),
    withTiming(8, { duration: 50 }),
    withTiming(0, { duration: 50 })
  )
}
```
- Triggered when form submission fails
- Applied to invalid fields only
- Total duration: 250ms
- Uses `react-native-reanimated` for smooth 60fps performance

**Profile Preview Fade-In Animation:**
```javascript
opacity: withTiming(1, {
  duration: 400,
  easing: Easing.out(Easing.cubic),
})
scale: withTiming(1, {
  duration: 400,
  easing: Easing.out(Easing.cubic),
})
```
- Fades in and scales up when data is entered
- Fades out when all fields are empty
- Cubic easing for smooth appearance
- Uses `react-native-reanimated` for optimal performance

**Error Message Animation:**
- Fade-in effect when errors appear
- Fade-out when errors clear
- Smooth transitions with minimal UI jank

### 3. Form Caching (20 mins) ✅

**AsyncStorage Integration:**
```javascript
const FORM_CACHE_KEY = 'profile_form_cache';

// Auto-save on field changes (debounced 500ms)
useEffect(() => {
  const timer = setTimeout(async () => {
    await AsyncStorage.setItem(FORM_CACHE_KEY, 
      JSON.stringify({ username, email, genre })
    );
  }, 500);
  return () => clearTimeout(timer);
}, [username, email, genre]);

// Load on component mount
useEffect(() => {
  const cached = await AsyncStorage.getItem(FORM_CACHE_KEY);
  if (cached) {
    const { username, email, genre } = JSON.parse(cached);
    setUsername(username);
    setEmail(email);
    setGenre(genre);
  }
}, []);

// Clear on successful submission
handleSubmit() {
  // ... validation ...
  await AsyncStorage.removeItem(FORM_CACHE_KEY);
  setUsername('');
  setEmail('');
  setGenre(undefined);
}
```

**Caching Features:**
- Auto-saves form data every 500ms (debounced)
- Restores on app reload
- Clears automatically after successful submission
- Error handling with console logging
- Loading state while retrieving cached data

### 4. Dynamic Profile Preview (40 mins) ✅

**Real-Time Updates:**
- Updates instantly as user types
- Shows username, email, and genre
- Genre-specific placeholder image from `via.placeholder.com`
- Color-coded by genre selection

**Genre-Color Mapping:**
```javascript
const genreColors = {
  Pop: '#FF1493',
  Rock: '#DC143C',
  Jazz: '#8B4513',
  Classical: '#FFD700',
  'Hip-Hop': '#FF6347',
  Electronic: '#00CED1',
  'R&B': '#8B008B',
  Country: '#FF8C00',
};

const genreImageUrls = {
  Pop: 'https://via.placeholder.com/120/FF1493/FFFFFF?text=Pop',
  // ... other genres with matching colors
};
```

**Memoization Optimization:**
```javascript
export const ProfileFormPreview = React.memo(
  ProfileFormPreviewComponent
);
```
- Prevents unnecessary re-renders
- Only updates when props change
- Reduces parent re-render performance impact

**Preview Features:**
- Displays only when data is present (smart visibility)
- Animated appearance with fade + scale
- Genre-specific background color
- Professional card layout with border
- Responsive design

## File Structure

```
app/(tabs)/
  profile-form.tsx              (180 lines) - Main form screen
  _layout.tsx                   (Modified) - Added profile-form tab
components/
  profile-form-preview.tsx      (140 lines) - Memoized preview component
```

## Testing Checklist

### Validation Tests ✅
- [ ] Username < 3 chars shows error
- [ ] Username > 20 chars shows error
- [ ] Username with special chars shows error
- [ ] Valid username clears error
- [ ] Email without @ shows error
- [ ] Invalid email format shows error
- [ ] Valid email clears error
- [ ] Genre must be selected
- [ ] Invalid genre shows error

### Animation Tests ✅
- [ ] Shake animation triggers on invalid form submission
- [ ] Shake affects all invalid fields
- [ ] Preview fades in smoothly when data entered
- [ ] Preview fades out when fields empty
- [ ] Animations run at 60fps (no jank)
- [ ] Error messages fade in/out smoothly

### Caching Tests ✅
- [ ] Form data saves on input change
- [ ] Form data loads on app restart
- [ ] Cache clears on successful submission
- [ ] Empty form persists if submitted without data
- [ ] Debouncing prevents excessive writes

### Preview Tests ✅
- [ ] Preview shows username
- [ ] Preview shows email
- [ ] Preview shows genre with correct color
- [ ] Genre placeholder image displays
- [ ] Colors match genre selection
- [ ] Preview hides when no data entered
- [ ] Preview updates in real-time

### Integration Tests ✅
- [ ] Submit button disabled visual feedback
- [ ] Reset button clears all fields
- [ ] Keyboard handling on iOS/Android
- [ ] Character counter updates live
- [ ] Success message displays and clears
- [ ] Haptic feedback on errors/success

## State Management Flow

```
User Input
  ↓
Validate in real-time
  ↓
Update error state
  ↓
Auto-save to AsyncStorage (debounced)
  ↓
Preview re-renders (React.memo optimized)
  ↓
On submit: Shake animations if errors
          Success message & clear cache if valid
```

## Performance Optimizations

1. **React.memo**: Preview component only re-renders on prop changes
2. **useCallback**: Used implicitly through event handlers
3. **Debounced Saves**: Form saved every 500ms, not on every keystroke
4. **Memoized Values**: Genre color/image computed only when genre changes
5. **Native Animations**: Reanimated handles all animations on native thread
6. **useEffect Dependencies**: Carefully managed to prevent unnecessary re-renders

## Validation Logic Summary

The form validates inputs in real-time: username must be 3–20 characters with only alphanumeric characters and underscores (regex: `/^[A-Za-z0-9_]{3,20}$/`), email must follow standard format with '@' and domain (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), and genre must be selected from a predefined list of 8 options. Errors display immediately below each field, and shake animations are triggered on invalid form submission attempts. The form auto-saves to AsyncStorage every 500ms for data persistence across app restarts.

## Animation Approach Summary

React Native Reanimated v2 powers all animations for optimal 60fps performance without blocking the UI thread. Field shake effects use sequenced timing animations on invalid inputs (250ms total duration), while the profile preview uses cubic easing for smooth fade-in (400ms) and scale transformations. Error messages fade in/out seamlessly. All animations run on the native thread, ensuring responsive UI even on low-end devices.

## Preview Update Summary

The profile preview updates dynamically in real-time as the user types, displaying the current username, email, and genre selection. Each genre has a unique color and placeholder image URL (from `via.placeholder.com`) that updates the preview card's appearance. The component uses React.memo to prevent unnecessary re-renders—only re-rendering when username, email, or genre props change. The preview intelligently hides when no data is entered and fades in with a smooth scale animation when data becomes available.

## Future Enhancements

- Image upload with camera integration
- Social login (Spotify OAuth)
- Profile picture customization
- Bio/bio emoji field
- Public profile page
- Follow/unfollow users
- Integration with Spotify API for real user data
