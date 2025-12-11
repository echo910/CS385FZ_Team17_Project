import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function PlayerScreen({
  onClose,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  currentTrack = {
    title: "望春风",
    artist: "陶喆",
    albumArt: require("../assets/a184667b4c681be8d0036fcbd9bc8ef9c90e9a94.png"),
  },
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(242); // 4:02 in seconds
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = duration - currentTime;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部状态栏和导航 */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 专辑封面 */}
        <View style={styles.albumArtContainer}>
          <Image
            source={currentTrack.albumArt}
            style={styles.albumArt}
            resizeMode="cover"
          />
        </View>

        {/* 歌曲信息 */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{currentTrack.title}</Text>
          <Text style={styles.artistName}>{currentTrack.artist}</Text>
        </View>

        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>-{formatTime(remainingTime)}</Text>
          </View>
        </View>

        {/* 播放控制按钮 */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={() => setIsLiked(!isLiked)}
            style={[styles.controlButton, { marginRight: 13 }]}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onPrevious} style={[styles.controlButton, { marginRight: 12 }]}>
            <Ionicons name="play-skip-back" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onTogglePlay}
            style={styles.playPauseButton}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color="#022251"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onNext} style={[styles.controlButton, { marginLeft: 12 }]}>
            <Ionicons name="play-skip-forward" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsShuffled(!isShuffled)}
            style={[styles.controlButton, { marginLeft: 13 }]}
          >
            <Ionicons
              name={isShuffled ? "shuffle" : "shuffle-outline"}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* 底部操作按钮 */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="list-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#022251",
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  moreButton: {
    padding: 4,
  },
  albumArtContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  albumArt: {
    width: width * 0.82,
    height: width * 0.82,
    borderRadius: 8,
  },
  songInfo: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 36,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  artistName: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  progressContainer: {
    paddingHorizontal: 36,
    marginBottom: 40,
  },
  progressBarContainer: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 1,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
    marginBottom: 40,
  },
  controlButton: {
    padding: 8,
  },
  playPauseButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 37,
    paddingBottom: 20,
  },
  actionButton: {
    padding: 8,
  },
});

