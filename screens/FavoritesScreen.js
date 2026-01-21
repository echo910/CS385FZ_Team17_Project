import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const THEME_BLUE = "#6FBDD3";

export default function FavoritesScreen({
  onClose,
  favorites = [],
  onPlaySong,
  onPlayAll,
  onRemoveFavorite,
  onSongLongPress,
}) {
  const [searchText, setSearchText] = useState("");

  const filteredFavorites = favorites.filter(
    (song) =>
      song.title.toLowerCase().includes(searchText.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalDuration = favorites.reduce((acc, song) => acc + (song.duration || 0), 0);

  const handleRemove = (song) => {
    Alert.alert(
      "取消收藏",
      `确定要取消收藏「${song.title}」吗？`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "确定",
          style: "destructive",
          onPress: () => onRemoveFavorite?.(song),
        },
      ]
    );
  };

  const renderSongItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => onPlaySong?.(item, favorites)}
      onLongPress={() => onSongLongPress?.(item)}
      activeOpacity={0.7}
      delayLongPress={300}
    >
      <Text style={styles.songIndex}>{index + 1}</Text>
      <Image source={item.image} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text style={styles.songDuration}>{formatDuration(item.duration)}</Text>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemove(item)}
      >
        <Ionicons name="heart" size={22} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* 封面 */}
      <View style={styles.coverContainer}>
        <View style={styles.coverGradient}>
          <Ionicons name="heart" size={60} color="#FF6B6B" />
        </View>
      </View>

      {/* 信息 */}
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>我喜欢的音乐</Text>
        <Text style={styles.playlistStats}>
          {favorites.length} 首歌曲 · {Math.floor(totalDuration / 60)} 分钟
        </Text>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.playAllButton}
          onPress={() => onPlayAll?.(favorites)}
          disabled={favorites.length === 0}
        >
          <Ionicons name="play" size={22} color="#000" />
          <Text style={styles.playAllText}>播放全部</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shuffleButton}>
          <Ionicons name="shuffle" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 搜索框 */}
      {favorites.length > 5 && (
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索收藏的歌曲"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#444" />
      <Text style={styles.emptyTitle}>还没有收藏的歌曲</Text>
      <Text style={styles.emptySubtitle}>
        点击歌曲旁边的 ♡ 来收藏喜欢的音乐
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航 */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>我喜欢</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* 歌曲列表 */}
        <FlatList
          data={filteredFavorites}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
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
    paddingBottom: 20,
  },
  coverContainer: {
    alignSelf: "center",
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  coverGradient: {
    flex: 1,
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    background: "linear-gradient(135deg, #FF6B6B 0%, #ee5a5a 100%)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a1a1a",
  },
  playlistInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  playlistStats: {
    color: "#888",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playAllText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
  shuffleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  // 歌曲项
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  songIndex: {
    width: 28,
    color: "#666",
    fontSize: 14,
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 3,
  },
  songArtist: {
    color: "#888",
    fontSize: 12,
  },
  songDuration: {
    color: "#666",
    fontSize: 12,
    marginRight: 8,
  },
  removeBtn: {
    padding: 8,
  },
  // 空状态
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
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
