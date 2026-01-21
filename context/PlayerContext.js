/**
 * 播放器状态管理 Context
 * 管理全局播放状态、播放队列、播放历史等
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 初始状态
const initialState = {
  // 当前播放
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  
  // 播放队列
  queue: [],
  queueIndex: 0,
  
  // 播放模式: 'sequence' | 'repeat' | 'repeat-one' | 'shuffle'
  playMode: "sequence",
  
  // 播放历史
  playHistory: [],
  
  // 收藏的歌曲
  favorites: [],
  
  // 用户创建的歌单
  playlists: [],
  
  // AI 生成的歌单历史
  aiPlaylists: [],
  
  // 最近播放
  recentlyPlayed: [],
  
  // 音量 (0-1)
  volume: 1,
  
  // 是否静音
  isMuted: false,
};

// Action Types
const ActionTypes = {
  SET_CURRENT_TRACK: "SET_CURRENT_TRACK",
  SET_PLAYING: "SET_PLAYING",
  SET_CURRENT_TIME: "SET_CURRENT_TIME",
  SET_DURATION: "SET_DURATION",
  SET_QUEUE: "SET_QUEUE",
  SET_QUEUE_INDEX: "SET_QUEUE_INDEX",
  ADD_TO_QUEUE: "ADD_TO_QUEUE",
  REMOVE_FROM_QUEUE: "REMOVE_FROM_QUEUE",
  CLEAR_QUEUE: "CLEAR_QUEUE",
  SET_PLAY_MODE: "SET_PLAY_MODE",
  ADD_TO_HISTORY: "ADD_TO_HISTORY",
  ADD_TO_FAVORITES: "ADD_TO_FAVORITES",
  REMOVE_FROM_FAVORITES: "REMOVE_FROM_FAVORITES",
  ADD_PLAYLIST: "ADD_PLAYLIST",
  UPDATE_PLAYLIST: "UPDATE_PLAYLIST",
  DELETE_PLAYLIST: "DELETE_PLAYLIST",
  ADD_AI_PLAYLIST: "ADD_AI_PLAYLIST",
  ADD_TO_RECENTLY_PLAYED: "ADD_TO_RECENTLY_PLAYED",
  SET_VOLUME: "SET_VOLUME",
  SET_MUTED: "SET_MUTED",
  LOAD_PERSISTED_STATE: "LOAD_PERSISTED_STATE",
};

// Reducer
function playerReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_TRACK:
      return { ...state, currentTrack: action.payload };
      
    case ActionTypes.SET_PLAYING:
      return { ...state, isPlaying: action.payload };
      
    case ActionTypes.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload };
      
    case ActionTypes.SET_DURATION:
      return { ...state, duration: action.payload };
      
    case ActionTypes.SET_QUEUE:
      return { ...state, queue: action.payload };
      
    case ActionTypes.SET_QUEUE_INDEX:
      return { ...state, queueIndex: action.payload };
      
    case ActionTypes.ADD_TO_QUEUE:
      return { ...state, queue: [...state.queue, action.payload] };
      
    case ActionTypes.REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter((_, index) => index !== action.payload),
      };
      
    case ActionTypes.CLEAR_QUEUE:
      return { ...state, queue: [], queueIndex: 0 };
      
    case ActionTypes.SET_PLAY_MODE:
      return { ...state, playMode: action.payload };
      
    case ActionTypes.ADD_TO_HISTORY:
      const newHistory = [
        action.payload,
        ...state.playHistory.filter((t) => t.id !== action.payload.id),
      ].slice(0, 100); // 保留最近100首
      return { ...state, playHistory: newHistory };
      
    case ActionTypes.ADD_TO_FAVORITES:
      if (state.favorites.some((t) => t.id === action.payload.id)) {
        return state;
      }
      return { ...state, favorites: [action.payload, ...state.favorites] };
      
    case ActionTypes.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter((t) => t.id !== action.payload),
      };
      
    case ActionTypes.ADD_PLAYLIST:
      return { ...state, playlists: [action.payload, ...state.playlists] };
      
    case ActionTypes.UPDATE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
      
    case ActionTypes.DELETE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.filter((p) => p.id !== action.payload),
      };
      
    case ActionTypes.ADD_AI_PLAYLIST:
      return {
        ...state,
        aiPlaylists: [action.payload, ...state.aiPlaylists].slice(0, 20),
      };
      
    case ActionTypes.ADD_TO_RECENTLY_PLAYED:
      const newRecent = [
        action.payload,
        ...state.recentlyPlayed.filter((t) => t.id !== action.payload.id),
      ].slice(0, 50);
      return { ...state, recentlyPlayed: newRecent };
      
    case ActionTypes.SET_VOLUME:
      return { ...state, volume: action.payload };
      
    case ActionTypes.SET_MUTED:
      return { ...state, isMuted: action.payload };
      
    case ActionTypes.LOAD_PERSISTED_STATE:
      return { ...state, ...action.payload };
      
    default:
      return state;
  }
}

// Context
const PlayerContext = createContext(null);

// Storage Keys
const STORAGE_KEYS = {
  FAVORITES: "@player_favorites",
  PLAYLISTS: "@player_playlists",
  AI_PLAYLISTS: "@player_ai_playlists",
  RECENTLY_PLAYED: "@player_recently_played",
  PLAY_MODE: "@player_play_mode",
  VOLUME: "@player_volume",
};

// Provider Component
export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // 加载持久化数据
  useEffect(() => {
    loadPersistedData();
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FAVORITES, state.favorites);
  }, [state.favorites]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PLAYLISTS, state.playlists);
  }, [state.playlists]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AI_PLAYLISTS, state.aiPlaylists);
  }, [state.aiPlaylists]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECENTLY_PLAYED, state.recentlyPlayed);
  }, [state.recentlyPlayed]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PLAY_MODE, state.playMode);
  }, [state.playMode]);

  const loadPersistedData = async () => {
    try {
      const [favorites, playlists, aiPlaylists, recentlyPlayed, playMode] =
        await Promise.all([
          loadFromStorage(STORAGE_KEYS.FAVORITES),
          loadFromStorage(STORAGE_KEYS.PLAYLISTS),
          loadFromStorage(STORAGE_KEYS.AI_PLAYLISTS),
          loadFromStorage(STORAGE_KEYS.RECENTLY_PLAYED),
          loadFromStorage(STORAGE_KEYS.PLAY_MODE),
        ]);

      dispatch({
        type: ActionTypes.LOAD_PERSISTED_STATE,
        payload: {
          favorites: favorites || [],
          playlists: playlists || [],
          aiPlaylists: aiPlaylists || [],
          recentlyPlayed: recentlyPlayed || [],
          playMode: playMode || "sequence",
        },
      });
    } catch (error) {
      console.warn("Failed to load persisted data:", error);
    }
  };

  const saveToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Failed to save to storage:", error);
    }
  };

  const loadFromStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn("Failed to load from storage:", error);
      return null;
    }
  };

  // Actions
  const actions = {
    // 播放控制
    playTrack: (track, queue = null) => {
      dispatch({ type: ActionTypes.SET_CURRENT_TRACK, payload: track });
      dispatch({ type: ActionTypes.SET_PLAYING, payload: true });
      dispatch({ type: ActionTypes.ADD_TO_RECENTLY_PLAYED, payload: track });
      dispatch({ type: ActionTypes.ADD_TO_HISTORY, payload: track });
      
      if (queue) {
        dispatch({ type: ActionTypes.SET_QUEUE, payload: queue });
        const index = queue.findIndex((t) => t.id === track.id);
        dispatch({ type: ActionTypes.SET_QUEUE_INDEX, payload: index >= 0 ? index : 0 });
      }
    },

    pauseTrack: () => {
      dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
    },

    resumeTrack: () => {
      dispatch({ type: ActionTypes.SET_PLAYING, payload: true });
    },

    togglePlay: () => {
      dispatch({ type: ActionTypes.SET_PLAYING, payload: !state.isPlaying });
    },

    seekTo: (time) => {
      dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: time });
    },

    setDuration: (duration) => {
      dispatch({ type: ActionTypes.SET_DURATION, payload: duration });
    },

    // 播放队列
    playNext: () => {
      if (state.queue.length === 0) return;

      let nextIndex;
      
      if (state.playMode === "shuffle") {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else if (state.playMode === "repeat-one") {
        nextIndex = state.queueIndex;
      } else {
        nextIndex = state.queueIndex + 1;
        if (nextIndex >= state.queue.length) {
          if (state.playMode === "repeat") {
            nextIndex = 0;
          } else {
            dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
            return;
          }
        }
      }

      const nextTrack = state.queue[nextIndex];
      if (nextTrack) {
        dispatch({ type: ActionTypes.SET_QUEUE_INDEX, payload: nextIndex });
        dispatch({ type: ActionTypes.SET_CURRENT_TRACK, payload: nextTrack });
        dispatch({ type: ActionTypes.ADD_TO_RECENTLY_PLAYED, payload: nextTrack });
        dispatch({ type: ActionTypes.ADD_TO_HISTORY, payload: nextTrack });
      }
    },

    playPrevious: () => {
      if (state.queue.length === 0) return;

      // 如果播放超过3秒，重新播放当前歌曲
      if (state.currentTime > 3) {
        dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: 0 });
        return;
      }

      let prevIndex = state.queueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.playMode === "repeat" ? state.queue.length - 1 : 0;
      }

      const prevTrack = state.queue[prevIndex];
      if (prevTrack) {
        dispatch({ type: ActionTypes.SET_QUEUE_INDEX, payload: prevIndex });
        dispatch({ type: ActionTypes.SET_CURRENT_TRACK, payload: prevTrack });
        dispatch({ type: ActionTypes.ADD_TO_RECENTLY_PLAYED, payload: prevTrack });
      }
    },

    addToQueue: (track) => {
      dispatch({ type: ActionTypes.ADD_TO_QUEUE, payload: track });
    },

    removeFromQueue: (index) => {
      dispatch({ type: ActionTypes.REMOVE_FROM_QUEUE, payload: index });
    },

    clearQueue: () => {
      dispatch({ type: ActionTypes.CLEAR_QUEUE });
    },

    setPlayMode: (mode) => {
      dispatch({ type: ActionTypes.SET_PLAY_MODE, payload: mode });
    },

    cyclePlayMode: () => {
      const modes = ["sequence", "repeat", "repeat-one", "shuffle"];
      const currentIndex = modes.indexOf(state.playMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      dispatch({ type: ActionTypes.SET_PLAY_MODE, payload: nextMode });
    },

    // 收藏
    toggleFavorite: (track) => {
      const isFavorite = state.favorites.some((t) => t.id === track.id);
      if (isFavorite) {
        dispatch({ type: ActionTypes.REMOVE_FROM_FAVORITES, payload: track.id });
      } else {
        dispatch({ type: ActionTypes.ADD_TO_FAVORITES, payload: track });
      }
    },

    isFavorite: (trackId) => {
      return state.favorites.some((t) => t.id === trackId);
    },

    // 歌单管理
    createPlaylist: (name, description = "") => {
      const playlist = {
        id: `playlist_${Date.now()}`,
        name,
        description,
        songs: [],
        coverImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: ActionTypes.ADD_PLAYLIST, payload: playlist });
      return playlist;
    },

    addToPlaylist: (playlistId, track) => {
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.songs.some((s) => s.id === track.id)) {
        const updatedPlaylist = {
          ...playlist,
          songs: [...playlist.songs, track],
          updatedAt: new Date().toISOString(),
        };
        dispatch({ type: ActionTypes.UPDATE_PLAYLIST, payload: updatedPlaylist });
      }
    },

    removeFromPlaylist: (playlistId, trackId) => {
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        const updatedPlaylist = {
          ...playlist,
          songs: playlist.songs.filter((s) => s.id !== trackId),
          updatedAt: new Date().toISOString(),
        };
        dispatch({ type: ActionTypes.UPDATE_PLAYLIST, payload: updatedPlaylist });
      }
    },

    deletePlaylist: (playlistId) => {
      dispatch({ type: ActionTypes.DELETE_PLAYLIST, payload: playlistId });
    },

    // AI 歌单
    saveAIPlaylist: (playlistData) => {
      const aiPlaylist = {
        id: `ai_${Date.now()}`,
        ...playlistData,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: ActionTypes.ADD_AI_PLAYLIST, payload: aiPlaylist });
      return aiPlaylist;
    },

    // 音量
    setVolume: (volume) => {
      dispatch({ type: ActionTypes.SET_VOLUME, payload: Math.max(0, Math.min(1, volume)) });
    },

    toggleMute: () => {
      dispatch({ type: ActionTypes.SET_MUTED, payload: !state.isMuted });
    },
  };

  return (
    <PlayerContext.Provider value={{ state, ...actions }}>
      {children}
    </PlayerContext.Provider>
  );
}

// Hook
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

export default PlayerContext;
