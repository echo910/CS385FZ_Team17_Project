import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 组件
import MusicCard from "./components/MusicCard";
import AIAssistantIcon from "./components/AIAssistantIcon";
import SongActionSheet from "./components/SongActionSheet";

// 页面
import PlayerScreen from "./screens/PlayerScreen";
import SearchScreen from "./screens/SearchScreen";
import MyScreen from "./screens/MyScreen";
import MyHomeScreen from "./screens/MyHomeScreen";
import AIAssistantScreen from "./screens/AIAssistantScreen";
import GeneratedPlaylistScreen from "./screens/GeneratedPlaylistScreen";
import SplashScreen from "./screens/SplashScreen";
import SettingsScreen from "./screens/SettingsScreen";

// 数据
import { MUSIC_DATABASE } from "./data/musicDatabase";

// 服务
import {
  getPersonalizedRecommendations,
  getDailyRecommendation,
  getSimilarSongs,
} from "./services/recommendationService";

// 从 assets 导入图片
const heroImage1 = require("./assets/hero1.png");
const heroImage2 = require("./assets/hero2.png");
const heroImage3 = require("./assets/hero3.png");
const albumImage1 = require("./assets/album1.png");
const albumImage2 = require("./assets/album2.png");
const albumImage3 = require("./assets/album3.png");
const artistImage1 = require("./assets/artist1.png");
const artistImage2 = require("./assets/artist2.png");
const artistImage3 = require("./assets/artist3.png");

// 主题色
const THEME_BLUE = "#6FBDD3";

// 模拟数据
const HERO_CARDS = [
  {
    id: 1,
    title: "Heartbeat Radar",
    subtitle: "Fresh songs\nthat suit your taste",
    image: heroImage1,
    color: "#8FB8B4",
  },
  {
    id: 2,
    title: "Similar Artists",
    subtitle: "Starting from\na favorite artist",
    image: heroImage2,
    color: "#F29F9F",
  },
  {
    id: 3,
    title: "Daily Mix",
    subtitle: "Made for you",
    image: heroImage3,
    color: "#9F9FF2",
  },
];

const GUESS_LIKE = [
  { id: 1, title: "陳奕迅合輯", artist: "Eason Chan", image: albumImage1 },
  { id: 2, title: "YELLOW黃宣", artist: "合輯", image: albumImage2 },
  { id: 3, title: "方大同精选", artist: "Khalil Fong", image: albumImage3 },
];

const PLAYED_RECENTLY = [
  { id: 1, title: "方大同合輯", image: albumImage1 },
  { id: 2, title: "陳奕迅合輯", image: albumImage2 },
];

const REC_ARTIST_SECTION = {
  recommender: { name: "卢广仲", avatar: artistImage1 },
  albums: [
    { id: 1, title: "唯一", subtitle: "Album · 王力宏", image: albumImage2 },
    { id: 2, title: "告五人", subtitle: "Band", image: albumImage1 },
    { id: 3, title: "橙月", subtitle: "Album · 方大同", image: albumImage1 },
  ],
};

const REC_ARTISTS_CIRCLE = [
  { id: 1, name: "告五人", image: artistImage1 },
  { id: 2, name: "陶喆", image: artistImage2 },
  { id: 3, name: "落日飞车", image: artistImage3 },
];

// 存储键
const STORAGE_KEYS = {
  FAVORITES: "@app_favorites",
  RECENTLY_PLAYED: "@app_recently_played",
  PLAY_MODE: "@app_play_mode",
  PLAYLISTS: "@app_playlists",
  SETTINGS: "@app_settings",
};

export default function App() {
  // 启动页状态
  const [showSplash, setShowSplash] = useState(true);
  
  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(242);
  const [playMode, setPlayMode] = useState("sequence");
  
  // 播放队列
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  
  // 收藏
  const [favorites, setFavorites] = useState([]);
  
  // 最近播放
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  
  // 用户歌单
  const [userPlaylists, setUserPlaylists] = useState([]);
  
  // AI 生成的歌单
  const [aiPlaylists, setAiPlaylists] = useState([]);
  
  // 设置
  const [settings, setSettings] = useState({
    audioQuality: "high",
    autoPlay: true,
    downloadOnWifi: true,
    showLyrics: true,
    notifications: true,
    darkMode: true,
  });
  
  // 导航状态
  const [currentTab, setCurrentTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showGeneratedPlaylist, setShowGeneratedPlaylist] = useState(false);
  const [generatedPlaylistData, setGeneratedPlaylistData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // 歌曲操作菜单
  const [showSongAction, setShowSongAction] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  
  // 个性化推荐
  const [dailyRecommendation, setDailyRecommendation] = useState(null);
  const [personalizedSongs, setPersonalizedSongs] = useState([]);

  // 加载持久化数据
  useEffect(() => {
    loadPersistedData();
  }, []);

  // 更新个性化推荐
  useEffect(() => {
    updateRecommendations();
  }, [recentlyPlayed, favorites]);

  const updateRecommendations = () => {
    // 获取每日推荐
    const daily = getDailyRecommendation(recentlyPlayed, favorites);
    setDailyRecommendation(daily);
    
    // 获取个性化推荐
    const personalized = getPersonalizedRecommendations(recentlyPlayed, favorites, 10);
    setPersonalizedSongs(personalized);
  };

  // 保存数据
  useEffect(() => {
    if (favorites.length > 0) {
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (recentlyPlayed.length > 0) {
      AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed));
    }
  }, [recentlyPlayed]);

  const loadPersistedData = async () => {
    try {
      const [favData, recentData, modeData, playlistsData, settingsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED),
        AsyncStorage.getItem(STORAGE_KEYS.PLAY_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.PLAYLISTS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      ]);
      
      if (favData) setFavorites(JSON.parse(favData));
      if (recentData) setRecentlyPlayed(JSON.parse(recentData));
      if (modeData) setPlayMode(modeData);
      if (playlistsData) setUserPlaylists(JSON.parse(playlistsData));
      if (settingsData) setSettings(JSON.parse(settingsData));
      
      // 设置默认播放歌曲
      if (!currentTrack && MUSIC_DATABASE.length > 0) {
        setCurrentTrack({
          ...MUSIC_DATABASE[0],
          albumArt: MUSIC_DATABASE[0].image,
        });
        setDuration(MUSIC_DATABASE[0].duration || 242);
      }
    } catch (error) {
      console.warn("Failed to load data:", error);
    }
  };

  // 保存歌单
  useEffect(() => {
    if (userPlaylists.length > 0) {
      AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(userPlaylists));
    }
  }, [userPlaylists]);

  // 保存设置
  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  // 模拟播放进度
  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration - 1) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // 播放控制
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
      return;
    }
    
    if (queue.length > 0) {
      let prevIndex = queueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = playMode === "repeat" ? queue.length - 1 : 0;
      }
      playTrackAtIndex(prevIndex);
    }
  };

  const handleNext = () => {
    if (queue.length === 0) return;

    let nextIndex;
    if (playMode === "shuffle") {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (playMode === "repeat-one") {
      nextIndex = queueIndex;
      setCurrentTime(0);
      return;
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (playMode === "repeat") {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }
    playTrackAtIndex(nextIndex);
  };

  const playTrackAtIndex = (index) => {
    if (index >= 0 && index < queue.length) {
      const track = queue[index];
      setCurrentTrack({
        ...track,
        albumArt: track.image,
      });
      setQueueIndex(index);
      setCurrentTime(0);
      setDuration(track.duration || 242);
      setIsPlaying(true);
      addToRecentlyPlayed(track);
    }
  };

  // 播放歌曲
  const handlePlaySong = (song, songQueue = null) => {
    const track = {
      ...song,
      albumArt: song.image,
    };
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(song.duration || 242);
    setIsPlaying(true);
    
    if (songQueue) {
      setQueue(songQueue);
      const index = songQueue.findIndex((s) => s.id === song.id);
      setQueueIndex(index >= 0 ? index : 0);
    } else {
      setQueue([song]);
      setQueueIndex(0);
    }
    
    addToRecentlyPlayed(song);
  };

  // 播放歌单
  const handlePlayPlaylist = (playlistData) => {
    if (playlistData.songs && playlistData.songs.length > 0) {
      setQueue(playlistData.songs);
      handlePlaySong(playlistData.songs[0], playlistData.songs);
    }
    setGeneratedPlaylistData(playlistData);
    setShowGeneratedPlaylist(true);
    setShowAI(false);
  };

  // 保存 AI 生成的歌单
  const handleSaveAIPlaylist = (playlistData) => {
    const newPlaylist = {
      id: `ai_${Date.now()}`,
      name: playlistData.name || "AI 歌单",
      description: playlistData.description || "",
      songs: playlistData.songs || [],
      createdAt: new Date().toISOString(),
      isAI: true,
    };
    setAiPlaylists((prev) => [newPlaylist, ...prev]);
    Alert.alert("保存成功", `歌单「${newPlaylist.name}」已保存到我的歌单`);
  };

  // 添加歌曲到歌单
  const handleAddToPlaylist = (playlistId, song) => {
    setUserPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          const exists = playlist.songs?.some((s) => s.id === song.id);
          if (!exists) {
            return {
              ...playlist,
              songs: [...(playlist.songs || []), song],
            };
          }
        }
        return playlist;
      })
    );
  };

  // 创建新歌单
  const handleCreatePlaylist = (name) => {
    const newPlaylist = {
      id: `playlist_${Date.now()}`,
      name,
      songs: [],
      createdAt: new Date().toISOString(),
    };
    setUserPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  // 添加到播放队列
  const handleAddToQueue = (song) => {
    setQueue((prev) => [...prev, song]);
  };

  // 打开歌曲操作菜单
  const handleOpenSongAction = (song) => {
    setSelectedSong(song);
    setShowSongAction(true);
  };

  // 添加到最近播放
  const addToRecentlyPlayed = (song) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [song, ...filtered].slice(0, 50);
    });
  };

  // 收藏切换
  const handleFavoriteToggle = (track) => {
    const isFav = favorites.some((f) => f.id === track.id);
    if (isFav) {
      setFavorites(favorites.filter((f) => f.id !== track.id));
    } else {
      setFavorites([track, ...favorites]);
    }
  };

  const isFavorite = (trackId) => {
    return favorites.some((f) => f.id === trackId);
  };

  // 播放模式切换
  const handlePlayModeChange = (mode) => {
    setPlayMode(mode);
    AsyncStorage.setItem(STORAGE_KEYS.PLAY_MODE, mode);
  };

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "夜深了 🌙";
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌆";
  };

  // 启动页
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 设置页面
  if (showSettings) {
    return (
      <SettingsScreen
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingChange={handleSettingChange}
      />
    );
  }

  // 播放器页面
  if (showPlayer) {
    return (
      <PlayerScreen
        onClose={() => setShowPlayer(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSeek={handleSeek}
        currentTime={currentTime}
        duration={duration}
        playMode={playMode}
        onPlayModeChange={handlePlayModeChange}
        queue={queue}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={currentTrack ? isFavorite(currentTrack.id) : false}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* 首页 */}
        {currentTab === "home" && (
          <>
            <View style={styles.header}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={styles.headerIconButton}
                  onPress={() => setShowAI(true)}
                >
                  <AIAssistantIcon size={30} color={THEME_BLUE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconButton}>
                  <Ionicons name="notifications-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* AI 入口卡片 */}
              <TouchableOpacity
                style={styles.aiEntryCard}
                onPress={() => setShowAI(true)}
                activeOpacity={0.85}
              >
                <View style={styles.aiEntryContent}>
                  <View style={styles.aiEntryIcon}>
                    <AIAssistantIcon size={36} color={THEME_BLUE} />
                  </View>
                  <View style={styles.aiEntryText}>
                    <Text style={styles.aiEntryTitle}>AI 智能歌单</Text>
                    <Text style={styles.aiEntrySubtitle}>
                      告诉我你的心情，为你生成专属歌单
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={THEME_BLUE} />
                </View>
                <View style={styles.aiEntryTags}>
                  <View style={styles.aiEntryTag}>
                    <Text style={styles.aiEntryTagText}>🚇 通勤放松</Text>
                  </View>
                  <View style={styles.aiEntryTag}>
                    <Text style={styles.aiEntryTagText}>🌃 City Pop</Text>
                  </View>
                  <View style={styles.aiEntryTag}>
                    <Text style={styles.aiEntryTagText}>🌧️ 雨天</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Hero Cards */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {HERO_CARDS.map((item) => (
                  <MusicCard
                    key={item.id}
                    variant="hero"
                    title={item.title}
                    subtitle={item.subtitle}
                    image={item.image}
                    color={item.color}
                  />
                ))}
              </ScrollView>

              {/* 最近播放 */}
              {recentlyPlayed.length > 0 && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>最近播放</Text>
                    <TouchableOpacity>
                      <Text style={styles.seeAllText}>查看全部</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.sectionScroll}
                  >
                    {recentlyPlayed.slice(0, 10).map((item) => (
                      <MusicCard
                        key={item.id}
                        variant="square-small"
                        title={item.title}
                        image={item.image}
                        showTag={false}
                        onPress={() => handlePlaySong(item, recentlyPlayed)}
                      />
                    ))}
                  </ScrollView>
                </>
              )}

              {/* 每日推荐 */}
              {dailyRecommendation && dailyRecommendation.songs.length > 0 && (
                <>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                      <Ionicons name="sunny-outline" size={20} color={THEME_BLUE} />
                      <Text style={styles.sectionTitle}>{dailyRecommendation.title}</Text>
                    </View>
                    <Text style={styles.sectionSubtitle}>{dailyRecommendation.description}</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.sectionScroll}
                  >
                    {dailyRecommendation.songs.slice(0, 8).map((item) => (
                      <MusicCard
                        key={item.id}
                        variant="square-small"
                        title={item.title}
                        subtitle={item.artist}
                        image={item.image}
                        showTag={false}
                        onPress={() => handlePlaySong(item, dailyRecommendation.songs)}
                        onLongPress={() => handleOpenSongAction(item)}
                      />
                    ))}
                  </ScrollView>
                </>
              )}

              {/* 猜你喜欢 - 个性化推荐 */}
              {personalizedSongs.length > 0 ? (
                <>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                      <Ionicons name="heart-outline" size={20} color="#FF6B6B" />
                      <Text style={styles.sectionTitle}>猜你喜欢</Text>
                    </View>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.sectionScroll}
                  >
                    {personalizedSongs.map((item) => (
                      <MusicCard
                        key={item.id}
                        variant="square-large"
                        title={item.title}
                        subtitle={item.artist}
                        image={item.image}
                        showTag={false}
                        onPress={() => handlePlaySong(item, personalizedSongs)}
                        onLongPress={() => handleOpenSongAction(item)}
                      />
                    ))}
                  </ScrollView>
                </>
              ) : (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Guess You Like</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.sectionScroll}
                  >
                    {GUESS_LIKE.map((item) => (
                      <MusicCard
                        key={item.id}
                        variant="square-large"
                        title={item.title}
                        image={item.image}
                        tagColor={item.id === 2 ? "#FFD700" : "#FFB6C1"}
                        showTag={true}
                      />
                    ))}
                  </ScrollView>
                </>
              )}

              {/* 推荐歌手 */}
              <View style={styles.recommenderContainer}>
                <Image
                  source={REC_ARTIST_SECTION.recommender.avatar}
                  style={styles.recommenderAvatar}
                />
                <View>
                  <Text style={styles.recommenderLabel}>
                    According to the recommendation
                  </Text>
                  <Text style={styles.recommenderName}>
                    {REC_ARTIST_SECTION.recommender.name}
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {REC_ARTIST_SECTION.albums.map((item) => (
                  <MusicCard
                    key={item.id}
                    variant="album"
                    title={item.title}
                    subtitle={item.subtitle}
                    image={item.image}
                  />
                ))}
              </ScrollView>

              {/* 推荐艺术家 */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended Artists</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {REC_ARTISTS_CIRCLE.map((item, index) => (
                  <MusicCard
                    key={index}
                    variant="circle"
                    title={item.name}
                    image={item.image}
                  />
                ))}
              </ScrollView>

              <View style={{ height: 140 }} />
            </ScrollView>
          </>
        )}

        {/* 搜索页 */}
        {currentTab === "search" && (
          <SearchScreen
            onOpenAI={() => setShowAI(true)}
            onPlaySong={(song, queue) => handlePlaySong(song, queue)}
          />
        )}

        {/* 我的页面 */}
        {currentTab === "my" &&
          (isLoggedIn ? (
            <MyHomeScreen
              onLogout={() => setIsLoggedIn(false)}
              favorites={favorites}
              recentlyPlayed={recentlyPlayed}
              aiPlaylists={aiPlaylists}
              userPlaylists={userPlaylists}
              onPlaySong={handlePlaySong}
              onRemoveFavorite={(song) => handleFavoriteToggle(song)}
              onClearHistory={() => setRecentlyPlayed([])}
              onOpenSettings={() => setShowSettings(true)}
              onOpenAI={() => setShowAI(true)}
              onSongLongPress={handleOpenSongAction}
            />
          ) : (
            <MyScreen onLogin={() => setIsLoggedIn(true)} />
          ))}
      </SafeAreaView>

      {/* 迷你播放器 */}
      {currentTrack && (
        <TouchableOpacity
          style={styles.miniPlayerContainer}
          onPress={() => setShowPlayer(true)}
          activeOpacity={0.9}
        >
          <View style={styles.miniPlayerContent}>
            <Image
              source={currentTrack.albumArt || currentTrack.image}
              style={styles.miniArt}
            />
            <View style={styles.miniInfo}>
              <Text style={styles.miniTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.miniArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <View style={styles.miniControls}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle(currentTrack);
                }}
                style={styles.miniControlBtn}
              >
                <Ionicons
                  name={isFavorite(currentTrack.id) ? "heart" : "heart-outline"}
                  size={22}
                  color={isFavorite(currentTrack.id) ? "#FF6B6B" : "#fff"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleTogglePlay();
                }}
              >
                <View style={styles.playButtonCircle}>
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={20}
                    color="#000"
                    style={!isPlaying && { marginLeft: 2 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                style={styles.miniControlBtn}
              >
                <Ionicons name="play-skip-forward" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          {/* 进度条 */}
          <View style={styles.miniProgress}>
            <View
              style={[
                styles.miniProgressBar,
                { width: `${(currentTime / duration) * 100}%` },
              ]}
            />
          </View>
        </TouchableOpacity>
      )}

      {/* 底部导航 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab("home")}
        >
          <Ionicons
            name={currentTab === "home" ? "home" : "home-outline"}
            size={26}
            color={currentTab === "home" ? THEME_BLUE : "#888"}
          />
          <Text
            style={[
              styles.navText,
              { color: currentTab === "home" ? THEME_BLUE : "#888" },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab("search")}
        >
          <Ionicons
            name={currentTab === "search" ? "search" : "search-outline"}
            size={26}
            color={currentTab === "search" ? THEME_BLUE : "#888"}
          />
          <Text
            style={[
              styles.navText,
              { color: currentTab === "search" ? THEME_BLUE : "#888" },
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab("my")}
        >
          <Ionicons
            name={currentTab === "my" ? "person" : "person-outline"}
            size={26}
            color={currentTab === "my" ? THEME_BLUE : "#888"}
          />
          <Text
            style={[
              styles.navText,
              { color: currentTab === "my" ? THEME_BLUE : "#888" },
            ]}
          >
            My
          </Text>
        </TouchableOpacity>
      </View>

      {/* AI 助手 Modal */}
      <Modal
        visible={showAI}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAI(false)}
      >
        <AIAssistantScreen
          onClose={() => setShowAI(false)}
          onPlaySong={(song) => handlePlaySong(song)}
          onPlayPlaylist={handlePlayPlaylist}
        />
      </Modal>

      {/* 生成的歌单详情 Modal */}
      <Modal
        visible={showGeneratedPlaylist}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowGeneratedPlaylist(false)}
      >
        <GeneratedPlaylistScreen
          onClose={() => setShowGeneratedPlaylist(false)}
          playlistData={generatedPlaylistData}
          onPlaySong={(song) => handlePlaySong(song, generatedPlaylistData?.songs)}
          onPlayAll={(data) => {
            if (data.songs && data.songs.length > 0) {
              handlePlaySong(data.songs[0], data.songs);
            }
          }}
          currentPlayingId={currentTrack?.id}
          isPlaying={isPlaying}
          onSavePlaylist={handleSaveAIPlaylist}
          onSongLongPress={handleOpenSongAction}
        />
      </Modal>

      {/* 歌曲操作菜单 */}
      <SongActionSheet
        visible={showSongAction}
        onClose={() => {
          setShowSongAction(false);
          setSelectedSong(null);
        }}
        song={selectedSong}
        onPlay={(song) => handlePlaySong(song)}
        onAddToQueue={handleAddToQueue}
        onAddToPlaylist={handleAddToPlaylist}
        onToggleFavorite={handleFavoriteToggle}
        isFavorite={selectedSong ? isFavorite(selectedSong.id) : false}
        playlists={userPlaylists}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // AI 入口卡片
  aiEntryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "rgba(111, 189, 211, 0.1)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(111, 189, 211, 0.2)",
  },
  aiEntryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiEntryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(111, 189, 211, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  aiEntryText: {
    flex: 1,
  },
  aiEntryTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  aiEntrySubtitle: {
    color: "#888",
    fontSize: 13,
  },
  aiEntryTags: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  aiEntryTag: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  aiEntryTagText: {
    color: "#aaa",
    fontSize: 12,
  },
  // 区块
  sectionScroll: {
    paddingLeft: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "column",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  sectionSubtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  seeAllText: {
    color: THEME_BLUE,
    fontSize: 13,
  },
  // 推荐
  recommenderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  recommenderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  recommenderLabel: {
    color: "#888",
    fontSize: 12,
  },
  recommenderName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  // 迷你播放器
  miniPlayerContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "#0a1628",
    borderRadius: 14,
    overflow: "hidden",
  },
  miniPlayerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  miniArt: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  miniInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  miniArtist: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  miniControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniControlBtn: {
    padding: 6,
  },
  playButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  miniProgress: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  miniProgressBar: {
    height: "100%",
    backgroundColor: THEME_BLUE,
  },
  // 底部导航
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#1C1C1C",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  },
});
