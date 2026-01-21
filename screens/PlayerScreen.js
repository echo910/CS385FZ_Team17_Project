import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");

// 主题色
const THEME_BLUE = "#6FBDD3";

// 播放模式图标映射
const PLAY_MODE_ICONS = {
  sequence: "repeat",
  repeat: "repeat",
  "repeat-one": "repeat",
  shuffle: "shuffle",
};

const PLAY_MODE_LABELS = {
  sequence: "顺序播放",
  repeat: "列表循环",
  "repeat-one": "单曲循环",
  shuffle: "随机播放",
};

export default function PlayerScreen({
  onClose,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  currentTime = 0,
  duration = 0,
  playMode = "sequence",
  onPlayModeChange,
  queue = [],
  onFavoriteToggle,
  isFavorite = false,
}) {
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [localCurrentTime, setLocalCurrentTime] = useState(currentTime);
  const [isDragging, setIsDragging] = useState(false);
  
  // 动画值
  const albumRotation = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 同步外部时间
  useEffect(() => {
    if (!isDragging) {
      setLocalCurrentTime(currentTime);
    }
  }, [currentTime, isDragging]);

  // 唱片旋转动画
  useEffect(() => {
    let animation;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.timing(albumRotation, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      albumRotation.stopAnimation();
    }
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isPlaying]);

  // 播放/暂停按钮动画
  const handlePlayPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onTogglePlay?.();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (localCurrentTime / duration) * 100 : 0;

  // 进度条拖动
  const handleProgressPress = (event) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = width - 72;
    const newProgress = Math.max(0, Math.min(1, locationX / progressBarWidth));
    const newTime = newProgress * duration;
    setLocalCurrentTime(newTime);
    onSeek?.(newTime);
  };

  // 切换播放模式
  const handlePlayModePress = () => {
    const modes = ["sequence", "repeat", "repeat-one", "shuffle"];
    const currentIndex = modes.indexOf(playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    onPlayModeChange?.(nextMode);
  };

  const spin = albumRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const defaultTrack = {
    title: "未知歌曲",
    artist: "未知艺术家",
    albumArt: require("../assets/album1.png"),
  };

  const track = currentTrack || defaultTrack;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 背景模糊效果 */}
      <View style={styles.backgroundContainer}>
        <Image
          source={track.albumArt || track.image}
          style={styles.backgroundImage}
          blurRadius={50}
        />
        <View style={styles.backgroundOverlay} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航 */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <Text style={styles.topBarTitle} numberOfLines={1}>
              {track.title}
            </Text>
            <Text style={styles.topBarSubtitle} numberOfLines={1}>
              {track.artist}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 专辑封面 */}
        <View style={styles.albumArtContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setShowLyrics(!showLyrics)}
          >
            <Animated.View
              style={[
                styles.albumArtWrapper,
                { transform: [{ rotate: spin }] },
              ]}
            >
              <Image
                source={track.albumArt || track.image}
                style={styles.albumArt}
                resizeMode="cover"
              />
              {/* 唱片中心圆点 */}
              <View style={styles.albumCenter} />
            </Animated.View>
          </TouchableOpacity>
          
          {/* 点击提示 */}
          <Text style={styles.tapHint}>
            {showLyrics ? "点击查看封面" : "点击查看歌词"}
          </Text>
        </View>

        {/* 歌曲信息 */}
        <View style={styles.songInfo}>
          <View style={styles.songTitleRow}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {track.title}
            </Text>
            {track.vip && (
              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>VIP</Text>
              </View>
            )}
          </View>
          <Text style={styles.artistName} numberOfLines={1}>
            {track.artist}
            {track.album && ` - ${track.album}`}
          </Text>
        </View>

        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <TouchableOpacity
            style={styles.progressBarContainer}
            onPress={handleProgressPress}
            activeOpacity={1}
          >
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
              <View
                style={[
                  styles.progressDot,
                  { left: `${progress}%` },
                ]}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(localCurrentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* 播放控制 */}
        <View style={styles.controlsContainer}>
          {/* 播放模式 */}
          <TouchableOpacity
            onPress={handlePlayModePress}
            style={styles.controlButton}
          >
            <Ionicons
              name={PLAY_MODE_ICONS[playMode]}
              size={24}
              color={playMode === "sequence" ? "#888" : THEME_BLUE}
            />
            {playMode === "repeat-one" && (
              <Text style={styles.repeatOneText}>1</Text>
            )}
          </TouchableOpacity>

          {/* 上一首 */}
          <TouchableOpacity onPress={onPrevious} style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={32} color="#fff" />
          </TouchableOpacity>

          {/* 播放/暂停 */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handlePlayPress}
              style={styles.playPauseButton}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={36}
                color="#000"
                style={!isPlaying && { marginLeft: 4 }}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* 下一首 */}
          <TouchableOpacity onPress={onNext} style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={32} color="#fff" />
          </TouchableOpacity>

          {/* 播放队列 */}
          <TouchableOpacity
            onPress={() => setShowQueue(true)}
            style={styles.controlButton}
          >
            <Ionicons name="list" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* 底部操作栏 */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onFavoriteToggle?.(track)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={26}
              color={isFavorite ? "#FF6B6B" : "#fff"}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={26} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 播放模式提示 */}
        <Text style={styles.playModeHint}>{PLAY_MODE_LABELS[playMode]}</Text>
      </SafeAreaView>

      {/* 播放队列 Modal */}
      <Modal
        visible={showQueue}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQueue(false)}
      >
        <View style={styles.queueModalContainer}>
          <TouchableOpacity
            style={styles.queueModalOverlay}
            onPress={() => setShowQueue(false)}
          />
          <View style={styles.queueModal}>
            <View style={styles.queueHeader}>
              <Text style={styles.queueTitle}>播放队列</Text>
              <Text style={styles.queueCount}>{queue.length} 首歌曲</Text>
            </View>
            <ScrollView style={styles.queueList}>
              {queue.map((item, index) => (
                <TouchableOpacity
                  key={item.id || index}
                  style={[
                    styles.queueItem,
                    currentTrack?.id === item.id && styles.queueItemActive,
                  ]}
                >
                  <Text style={styles.queueIndex}>{index + 1}</Text>
                  <View style={styles.queueItemInfo}>
                    <Text
                      style={[
                        styles.queueItemTitle,
                        currentTrack?.id === item.id && styles.queueItemTitleActive,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.queueItemArtist} numberOfLines={1}>
                      {item.artist}
                    </Text>
                  </View>
                  {currentTrack?.id === item.id && (
                    <Ionicons name="musical-notes" size={18} color={THEME_BLUE} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  safeArea: {
    flex: 1,
  },
  // 顶部栏
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
  },
  topBarTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  topBarSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  // 专辑封面
  albumArtContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  albumArtWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  albumArt: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
  },
  albumCenter: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1a1a1a",
    borderWidth: 8,
    borderColor: "#333",
  },
  tapHint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 16,
  },
  // 歌曲信息
  songInfo: {
    alignItems: "center",
    paddingHorizontal: 36,
    marginBottom: 20,
  },
  songTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  vipBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vipText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
  artistName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 6,
    textAlign: "center",
  },
  // 进度条
  progressContainer: {
    paddingHorizontal: 36,
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 30,
    justifyContent: "center",
  },
  progressBarBg: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 1.5,
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: THEME_BLUE,
    borderRadius: 1.5,
  },
  progressDot: {
    position: "absolute",
    top: -5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginLeft: -6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  // 播放控制
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  repeatOneText: {
    position: "absolute",
    fontSize: 10,
    color: THEME_BLUE,
    fontWeight: "700",
    bottom: 8,
  },
  playPauseButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // 底部操作
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingBottom: 10,
  },
  actionButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  playModeHint: {
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    paddingBottom: 10,
  },
  // 播放队列 Modal
  queueModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  queueModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  queueModal: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
  },
  queueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  queueTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  queueCount: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  queueList: {
    paddingHorizontal: 16,
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  queueItemActive: {
    backgroundColor: "rgba(111, 189, 211, 0.1)",
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  queueIndex: {
    width: 30,
    color: "#666",
    fontSize: 14,
  },
  queueItemInfo: {
    flex: 1,
  },
  queueItemTitle: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 2,
  },
  queueItemTitleActive: {
    color: THEME_BLUE,
  },
  queueItemArtist: {
    color: "#888",
    fontSize: 12,
  },
});
