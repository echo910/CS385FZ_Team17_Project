import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const THEME_BLUE = "#6FBDD3";

export default function RecentlyPlayedScreen({
  onClose,
  recentlyPlayed = [],
  onPlaySong,
  onClearHistory,
}) {
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
    
    return date.toLocaleDateString();
  };

  const handleClearHistory = () => {
    Alert.alert(
      "清空播放历史",
      "确定要清空所有播放历史吗？此操作不可恢复。",
      [
        { text: "取消", style: "cancel" },
        {
          text: "清空",
          style: "destructive",
          onPress: () => onClearHistory?.(),
        },
      ]
    );
  };

  const renderSongItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => onPlaySong?.(item, recentlyPlayed)}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <View style={styles.songMeta}>
        <Text style={styles.songDuration}>{formatDuration(item.duration)}</Text>
      </View>
      <TouchableOpacity style={styles.playBtn}>
        <Ionicons name="play-circle" size={32} color={THEME_BLUE} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>最近播放</Text>
          <Text style={styles.headerSubtitle}>
            {recentlyPlayed.length} 首歌曲
          </Text>
        </View>
        {recentlyPlayed.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Ionicons name="trash-outline" size={18} color="#888" />
            <Text style={styles.clearText}>清空</Text>
          </TouchableOpacity>
        )}
      </View>

      {recentlyPlayed.length > 0 && (
        <TouchableOpacity
          style={styles.playAllButton}
          onPress={() => onPlaySong?.(recentlyPlayed[0], recentlyPlayed)}
        >
          <Ionicons name="play" size={20} color="#000" />
          <Text style={styles.playAllText}>播放全部</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time-outline" size={64} color="#444" />
      <Text style={styles.emptyTitle}>暂无播放记录</Text>
      <Text style={styles.emptySubtitle}>
        开始播放音乐，这里会记录你的播放历史
      </Text>
    </View>
  );

  // 按日期分组
  const groupByDate = (songs) => {
    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    songs.forEach((song) => {
      let dateKey = "更早";
      if (song.playedAt) {
        const playDate = new Date(song.playedAt).toDateString();
        if (playDate === today) {
          dateKey = "今天";
        } else if (playDate === yesterday) {
          dateKey = "昨天";
        } else {
          const diff = Date.now() - new Date(song.playedAt).getTime();
          if (diff < 604800000) {
            dateKey = "本周";
          }
        }
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(song);
    });

    return groups;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航 */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>最近播放</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* 歌曲列表 */}
        <FlatList
          data={recentlyPlayed}
          renderItem={renderSongItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 100,
  },
  // 头部
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#888",
    fontSize: 14,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  clearText: {
    color: "#888",
    fontSize: 14,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_BLUE,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playAllText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
  // 歌曲项
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 14,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  songArtist: {
    color: "#888",
    fontSize: 13,
  },
  songMeta: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  songDuration: {
    color: "#666",
    fontSize: 12,
  },
  playBtn: {
    padding: 4,
  },
  // 空状态
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
