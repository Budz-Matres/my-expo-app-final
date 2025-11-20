import { useReducer, useCallback } from 'react';

export type Song = {
  id: string;
  name: string;
  addedAt: number;
};

export type PlaylistState = {
  songs: Song[];
  history: PlaylistState[];
  historyIndex: number;
};

export type PlaylistAction =
  | { type: 'ADD_SONG'; payload: Song }
  | { type: 'REMOVE_SONG'; payload: string }
  | { type: 'CLEAR_PLAYLIST' }
  | { type: 'SET_SONGS'; payload: Song[] }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialState: PlaylistState = {
  songs: [],
  history: [],
  historyIndex: -1,
};

export const playlistReducer = (
  state: PlaylistState,
  action: PlaylistAction
): PlaylistState => {
  switch (action.type) {
    case 'ADD_SONG': {
      const newSongs = [...state.songs, action.payload];
      return {
        songs: newSongs,
        history: [...state.history.slice(0, state.historyIndex + 1), { ...state, songs: newSongs }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REMOVE_SONG': {
      const newSongs = state.songs.filter((song) => song.id !== action.payload);
      return {
        songs: newSongs,
        history: [...state.history.slice(0, state.historyIndex + 1), { ...state, songs: newSongs }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'CLEAR_PLAYLIST': {
      return {
        songs: [],
        history: [...state.history.slice(0, state.historyIndex + 1), { ...state, songs: [] }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'SET_SONGS': {
      return {
        ...state,
        songs: action.payload,
      };
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const prevState = state.history[state.historyIndex - 1];
        return {
          ...state,
          songs: prevState.songs,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1];
        return {
          ...state,
          songs: nextState.songs,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    }

    default:
      return state;
  }
};

export const usePlaylistReducer = () => {
  const [state, dispatch] = useReducer(playlistReducer, initialState);

  const addSong = useCallback(
    (name: string) => {
      if (name.trim()) {
        const newSong: Song = {
          id: `${Date.now()}-${Math.random()}`,
          name: name.trim(),
          addedAt: Date.now(),
        };
        dispatch({ type: 'ADD_SONG', payload: newSong });
      }
    },
    []
  );

  const removeSong = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_SONG', payload: id });
  }, []);

  const clearPlaylist = useCallback(() => {
    dispatch({ type: 'CLEAR_PLAYLIST' });
  }, []);

  const setSongs = useCallback((songs: Song[]) => {
    dispatch({ type: 'SET_SONGS', payload: songs });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  return {
    state,
    addSong,
    removeSong,
    clearPlaylist,
    setSongs,
    undo,
    redo,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
  };
};
