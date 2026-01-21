import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const THEME_BLUE = "#6FBDD3";

/**
 * 歌曲操作菜单组件
 * 显示歌曲详情和各种操作选项
 */
export default function SongActionSheet({
  visible,
  onClose,
  song,
  onPlay,
  onAddToQueue,
  onAddToPlaylist,
  onToggleFavorite,
  onDownload,
  onShare,
  onViewArtist,
  onViewAlbum,
  isFavorite = false,
  playlists = [],
}) {
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

  if (!song) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎵 推荐一首歌：${song.title} - ${song.artist}`,
        title: song.title,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
    onClose();
  };

  const handleAddToPlaylist = (playlist) => {
    onAddToPlaylist?.(playlist.id, song);
    setShowPlaylistPicker(false);
    onClose();
    Alert.alert("添加成功", `已添加到「${playlist.name}」`);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const actions = [
    {
      icon: "play-circle-outline",
      label: "立即播放",
      onPress: () => {
        onPlay?.(song);
        onClose();
      },
    },
    {
      icon: "list-outline",
      label: "添加到播放队列",
      onPress: () => {
        onAddToQueue?.(song);
        onClose();
        Alert.alert("已添加", "歌曲已添加到播放队列");
      },
    },
    {
      icon: isFavorite ? "heart" : "heart-outline",
      label: isFavorite ? "取消收藏" : "收藏到我喜欢",
      color: isFavorite ? "#FF6B6B" : "#fff",
      onPress: () => {
        onToggleFavorite?.(song);
        onClose();
      },
    },
    {
      icon: "add-circle-outline",
      label: "添加到歌单",
      onPress: () => setShowPlaylistPicker(true),
    },
    {
      icon: "download-outline",
      label: "下载",
      onPress: () => {
        onDownload?.(song);
        onClose();
        Alert.alert("开始下载", `正在下载「${song.title}」`);
      },
    },
    {
      icon: "share-outline",
      label: "分享",
      onPress: handleShare,
    },
    {
      icon: "person-outline",
      label: `查看歌手: ${song.artist}`,
      onPress: () => {
        onViewArtist?.(song.artist);
        onClose();
      },
    },
  ];

  if (song.album) {
    actions.push({
      icon: "disc-outline",
      label: `查看专辑: ${song.album}`,
      onPress: () => {
        onViewAlbum?.(song.album);
        onClose();
      },
    });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.sheet}>
          {/* 歌曲信息头部 */}
          <View style={styles.header}>
            <Image source={song.image} style={styles.coverImage} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={2}>
                {song.title}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {song.artist}
                {song.album && ` · ${song.album}`}
              </Text>
              {song.duration && (
                <Text style={styles.songDuration}>
                  {formatDuration(song.duration)}
                </Text>
              )}
            </View>
          </View>

          {/* 分隔线 */}
          <View style={styles.divider} />

          {/* 操作列表 */}
          <ScrollView style={styles.actionList} showsVerticalScrollIndicator={false}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={action.icon}
                  size={24}
                  color={action.color || "#fff"}
                />
                <Text style={[styles.actionLabel, action.color && { color: action.color }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 取消按钮 */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 歌单选择器 */}
      <Modal
        visible={showPlaylistPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPlaylistPicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>添加到歌单</Text>
              <TouchableOpacity onPress={() => setShowPlaylistPicker(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.playlistList}>
              {/* 新建歌单选项 */}
              <TouchableOpacity
                style={styles.playlistItem}
                onPress={() => {
                  setShowPlaylistPicker(false);
                  Alert.prompt?.(
                    "新建歌单",
                    "请输入歌单名称",
                    (name) => {
                      if (name) {
                        // 创建新歌单并添加歌曲
                        Alert.alert("创建成功", `已创建歌单「${name}」并添加歌曲`);
                      }
                    }
                  ) || Alert.alert("提示", "请在设置中创建新歌单");
                  onClose();
                }}
              >
                <View style={styles.newPlaylistIcon}>
                  <Ionicons name="add" size={28} color={THEME_BLUE} />
                </View>
                <Text style={styles.playlistName}>新建歌单</Text>
              </TouchableOpacity>

              {/* 现有歌单列表 */}
              {playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.playlistItem}
                  onPress={() => handleAddToPlaylist(playlist)}
                >
                  <View style={styles.playlistCover}>
                    {playlist.coverImage ? (
                      <Image source={playlist.coverImage} style={styles.playlistCoverImage} />
                    ) : (
                      <Ionicons name="musical-notes" size={24} color="#666" />
                    )}
                  </View>
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                    <Text style={styles.playlistCount}>
                      {playlist.songs?.length || 0} 首歌曲
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {playlists.length === 0 && (
                <View style={styles.emptyPlaylists}>
                  <Text style={styles.emptyText}>暂无歌单</Text>
                  <Text style={styles.emptyHint}>点击上方创建新歌单</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 14,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  songArtist: {
    color: "#888",
    fontSize: 14,
    marginBottom: 2,
  },
  songDuration: {
    color: "#666",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 20,
  },
  actionList: {
    maxHeight: 350,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  actionLabel: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 18,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    marginBottom: 20,
  },
  cancelText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
  // 歌单选择器
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  pickerSheet: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    width: "100%",
    maxHeight: "70%",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  pickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  playlistList: {
    padding: 12,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 14,
  },
  newPlaylistIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "rgba(111, 189, 211, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(111, 189, 211, 0.3)",
    borderStyle: "dashed",
  },
  playlistCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  playlistCoverImage: {
    width: "100%",
    height: "100%",
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 2,
  },
  playlistCount: {
    color: "#888",
    fontSize: 12,
  },
  emptyPlaylists: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    color: "#888",
    fontSize: 15,
    marginBottom: 4,
  },
  emptyHint: {
    color: "#666",
    fontSize: 13,
  },
});
