import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Animated,
  Dimensions,
  LinearGradient,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TAG_LABELS } from "../data/musicDatabase";

const { width, height } = Dimensions.get("window");

// 主题色
const THEME_BLUE = "#6FBDD3";
const THEME_DARK = "#121212";

export default function GeneratedPlaylistScreen({
  onClose,
  playlistData,
  onPlaySong,
  onPlayAll,
  currentPlayingId,
  isPlaying,
}) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedSongId, setSelectedSongId] = useState(null);

  if (!playlistData) {
    return null;
  }

  const { title, description, tags, songs, totalMatched } = playlistData;

  // 计算总时长
  const totalDuration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  // 格式化单曲时长
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Header 动画
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const coverScale = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [1.2, 1, 0.8],
    extrapolate: "clamp",
  });

  const coverOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  // 渲染标签
  const renderTags = () => {
    if (!tags || tags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {tags.slice(0, 6).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>
              {TAG_LABELS[tag]?.zh || tag}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // 渲染歌曲项
  const renderSongItem = ({ item, index }) => {
    const isCurrentPlaying = currentPlayingId === item.id;
    const isSelected = selectedSongId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.songItem,
          isCurrentPlaying && styles.songItemPlaying,
          isSelected && styles.songItemSelected,
        ]}
        onPress={() => onPlaySong && onPlaySong(item)}
        onLongPress={() => setSelectedSongId(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.songIndexContainer}>
          {isCurrentPlaying && isPlaying ? (
            <View style={styles.playingIndicator}>
              <View style={[styles.playingBar, styles.playingBar1]} />
              <View style={[styles.playingBar, styles.playingBar2]} />
              <View style={[styles.playingBar, styles.playingBar3]} />
            </View>
          ) : (
            <Text
              style={[
                styles.songIndex,
                isCurrentPlaying && styles.songIndexPlaying,
              ]}
            >
              {index + 1}
            </Text>
          )}
        </View>

        <Image source={item.image} style={styles.songImage} />

        <View style={styles.songInfo}>
          <Text
            style={[
              styles.songTitle,
              isCurrentPlaying && styles.songTitlePlaying,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View style={styles.songMeta}>
            <Text style={styles.songArtist} numberOfLines={1}>
              {item.artist}
            </Text>
            {item.album && (
              <>
                <Text style={styles.songDot}>·</Text>
                <Text style={styles.songAlbum} numberOfLines={1}>
                  {item.album}
                </Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.songDuration}>
          {formatDuration(item.duration || 0)}
        </Text>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={18} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // 渲染头部
  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* 封面区域 */}
      <Animated.View
        style={[
          styles.coverContainer,
          {
            transform: [{ scale: coverScale }],
            opacity: coverOpacity,
          },
        ]}
      >
        {/* 使用歌单中第一首歌的封面，或者创建拼贴效果 */}
        <View style={styles.coverCollage}>
          {songs.slice(0, 4).map((song, index) => (
            <Image
              key={song.id}
              source={song.image}
              style={[
                styles.coverImage,
                songs.length >= 4 && styles.coverImageQuarter,
              ]}
            />
          ))}
        </View>
        <View style={styles.coverOverlay}>
          <View style={styles.aiGeneratedBadge}>
            <Ionicons name="sparkles" size={12} color="#000" />
            <Text style={styles.aiGeneratedText}>AI 生成</Text>
          </View>
        </View>
      </Animated.View>

      {/* 歌单信息 */}
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>{title}</Text>
        {description && (
          <Text style={styles.playlistDescription}>{description}</Text>
        )}
        {renderTags()}
        <View style={styles.playlistStats}>
          <Text style={styles.statsText}>
            {songs.length} 首歌曲 · {formatTotalDuration()}
          </Text>
          {totalMatched > songs.length && (
            <Text style={styles.matchedText}>
              从 {totalMatched} 首匹配中精选
            </Text>
          )}
        </View>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="heart-outline" size={22} color="#fff" />
          <Text style={styles.secondaryButtonText}>收藏</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playAllButton}
          onPress={() => onPlayAll && onPlayAll(playlistData)}
        >
          <Ionicons name="play" size={24} color="#000" />
          <Text style={styles.playAllText}>播放全部</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="shuffle-outline" size={22} color="#fff" />
          <Text style={styles.secondaryButtonText}>随机</Text>
        </TouchableOpacity>
      </View>

      {/* 分隔线 */}
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 背景渐变 */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, { backgroundColor: THEME_BLUE, opacity: 0.15 }]} />
        <View style={[styles.gradientLayer, styles.gradientBottom]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* 固定顶部导航 */}
        <Animated.View style={[styles.fixedHeader, { opacity: headerOpacity }]}>
          <View style={styles.fixedHeaderBg} />
          <Text style={styles.fixedHeaderTitle} numberOfLines={1}>
            {title}
          </Text>
        </Animated.View>

        {/* 返回按钮 */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 歌曲列表 */}
        <Animated.FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_DARK,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  gradientLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBottom: {
    top: "50%",
    backgroundColor: THEME_DARK,
  },
  safeArea: {
    flex: 1,
  },
  // 固定头部
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 90,
    justifyContent: "flex-end",
    paddingBottom: 12,
    paddingHorizontal: 60,
  },
  fixedHeaderBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME_DARK,
  },
  fixedHeaderTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  // 顶部栏
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 101,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  // 列表内容
  listContent: {
    paddingBottom: 100,
  },
  // 头部内容
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // 封面
  coverContainer: {
    alignSelf: "center",
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  coverCollage: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverImageQuarter: {
    width: "50%",
    height: "50%",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  aiGeneratedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  aiGeneratedText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
  // 歌单信息
  playlistInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  playlistDescription: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "rgba(111, 189, 211, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: {
    color: THEME_BLUE,
    fontSize: 12,
    fontWeight: "500",
  },
  playlistStats: {
    alignItems: "center",
  },
  statsText: {
    color: "#888",
    fontSize: 13,
  },
  matchedText: {
    color: "#666",
    fontSize: 11,
    marginTop: 4,
  },
  // 操作按钮
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 24,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  playAllText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    gap: 4,
  },
  secondaryButtonText: {
    color: "#888",
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 8,
  },
  // 歌曲项
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  songItemPlaying: {
    backgroundColor: "rgba(111, 189, 211, 0.08)",
  },
  songItemSelected: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  songIndexContainer: {
    width: 28,
    alignItems: "center",
  },
  songIndex: {
    color: "#666",
    fontSize: 14,
  },
  songIndexPlaying: {
    color: THEME_BLUE,
  },
  playingIndicator: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 16,
    gap: 2,
  },
  playingBar: {
    width: 3,
    backgroundColor: THEME_BLUE,
    borderRadius: 1,
  },
  playingBar1: {
    height: 8,
  },
  playingBar2: {
    height: 14,
  },
  playingBar3: {
    height: 10,
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    marginRight: 8,
  },
  songTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 3,
  },
  songTitlePlaying: {
    color: THEME_BLUE,
  },
  songMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  songArtist: {
    color: "#888",
    fontSize: 12,
    maxWidth: 100,
  },
  songDot: {
    color: "#666",
    fontSize: 12,
    marginHorizontal: 4,
  },
  songAlbum: {
    color: "#666",
    fontSize: 12,
    maxWidth: 80,
  },
  songDuration: {
    color: "#666",
    fontSize: 12,
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
});
