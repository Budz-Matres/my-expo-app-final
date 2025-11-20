# Week 4: State Management - Spotify Playlist Builder

## Project Overview
This is a Spotify-inspired playlist creation app that demonstrates advanced state management techniques including Redux-pattern reducers, undo/redo functionality, animations, and persistent storage.

## Key Features

### 1. Playlist Management
- Add songs with unique IDs and timestamps
- Remove individual songs with slide-out animation
- Clear entire playlist with confirmation haptic feedback
- Real-time song count display with fade animations

### 2. State Management Architecture
**Reducer Pattern (`usePlaylistReducer`):**
- Custom hook implementing `useReducer` for centralized state management
- Actions: `ADD_SONG`, `REMOVE_SONG`, `CLEAR_PLAYLIST`, `SET_SONGS`, `UNDO`, `REDO`
- Maintains full history stack with index pointer for undo/redo navigation
- Action creators use `useCallback` to prevent unnecessary re-renders

**State Structure:**
```typescript
{
  songs: Song[];           // Current playlist
  history: PlaylistState[]; // All previous states
  historyIndex: number;    // Current position in history
}
```

### 3. Undo/Redo Functionality
- Maintains immutable history stack
- **Undo**: Navigate backward in history, branching behavior when new action occurs
- **Redo**: Navigate forward in available history
- Dynamic enable/disable based on `canUndo` and `canRedo` computed properties
- Visual feedback with opacity changes on disabled buttons

### 4. Animations
**Song Addition (Fade-In + Spring):**
- Opacity animation: 0 → 1 over 300ms
- Transform: -100px → 0 with spring physics (damping: 10, mass: 1)

**Song Removal (Fade-Out):**
- Opacity animation: 1 → 0 over 200ms
- Removed from list after animation completes
- Haptic feedback on removal (light impact)

**Song Count Animation:**
- Fade-in effect when count updates
- Provides visual feedback for playlist size changes

### 5. Persistent Storage
**AsyncStorage Integration:**
- Saves playlist to `playlist_data` key on every change
- Loads playlist on app mount (isLoading state prevents premature saves)
- Error handling with console logging for debugging
- Restoration works across app restarts

### 6. Performance Optimization
- **React.memo**: `SongItem` component memoized to prevent unnecessary re-renders
- **useCallback**: All handlers wrapped to maintain referential equality
- **FlatList**: Used for efficient rendering of long playlists
- **Animated.Text**: Native animations for smooth count transitions

## File Structure
```
app/
  (tabs)/
    create.tsx               # Main playlist screen
hooks/
  usePlaylistReducer.ts      # Custom reducer hook with history
components/
  song-item.tsx             # Memoized song item with animations
```

## Testing Checklist
- ✅ Add songs: Input text and press add button or return key
- ✅ Remove songs: Tap X button on individual songs
- ✅ Undo: Press undo button to reverse last action
- ✅ Redo: Press redo button to repeat undone action
- ✅ Clear: Remove all songs at once
- ✅ Persistence: Close and reopen app, playlist persists
- ✅ Animations: Smooth fade-in/out on add/remove
- ✅ Haptics: Tactile feedback on interactions
- ✅ Performance: FlatList with 100+ songs remains smooth

## State Management Approach Summary
The playlist builder uses a **Redux-pattern reducer** to manage complex state transitions while maintaining immutable history for undo/redo. Each action (add, remove, clear) creates a new state snapshot in the history stack, enabling full reversal. The reducer returns computed properties (`canUndo`, `canRedo`) to efficiently gate button availability. AsyncStorage persists the current playlist independently of history, ensuring data survives app restarts while keeping history session-scoped. Component memoization and useCallback hooks prevent unnecessary re-renders, maintaining 60fps performance even with large playlists. This architecture separates concerns between state logic (reducer), side effects (persistence), and UI (memoized components).

## Technical Decisions
1. **useReducer over Context**: Centralized logic makes debugging and testing easier
2. **History Stack Pattern**: Enables branching behavior (new action cancels redo chain)
3. **Separate Persistence**: AsyncStorage saves current state only, not entire history
4. **React.memo + useCallback**: Essential for preventing memo-breaking in FlatList
5. **Reanimated 2 API**: Used for smooth native animations without thread blocking

## Future Enhancements
- Cloud sync with Firebase Realtime Database
- Collaborative playlists with real-time updates
- Rich metadata (artist, duration) from Spotify API
- Drag-to-reorder songs with `react-native-reanimated-carousel`
- Export playlist as .m3u file
- Search and filter songs by name/artist
