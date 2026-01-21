import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FavoritesScreen from "./FavoritesScreen";
import RecentlyPlayedScreen from "./RecentlyPlayedScreen";

const avatar = require("../assets/artist1.png");

const THEME_BLUE = "#6FBDD3";

export default function MyHomeScreen({
  onLogout,
  favorites = [],
  recentlyPlayed = [],
  aiPlaylists = [],
  userPlaylists = [],
  onPlaySong,
  onRemoveFavorite,
  onClearHistory,
  onOpenSettings,
  onOpenAI,
  onSongLongPress,
}) {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);

  // 快捷功能数据
  const quickActions = [
    {
      icon: "musical-notes-outline",
      text: "本地音乐",
      count: 0,
      onPress: () => {},
    },
    {
      icon: "heart-outline",
      text: "我喜欢",
      count: favorites.length,
      color: "#FF6B6B",
      onPress: () => setShowFavorites(true),
    },
    {
      icon: "cloud-download-outline",
      text: "已下载",
      count: 0,
      onPress: () => {},
    },
    {
      icon: "time-outline",
      text: "最近播放",
      count: recentlyPlayed.length,
      onPress: () => setShowRecentlyPlayed(true),
    },
  ];

  // 列表项数据
  const menuItems = [
    { icon: "albums-outline", text: "我的歌单", badge: userPlaylists.length || null, onPress: () => {} },
    { icon: "sparkles-outline", text: "AI 生成的歌单", badge: aiPlaylists.length || null, onPress: onOpenAI },
    { icon: "star-outline", text: "收藏的歌单", onPress: () => {} },
    { icon: "people-outline", text: "关注的歌手", onPress: () => {} },
    { icon: "chatbubble-ellipses-outline", text: "我的评论", onPress: () => {} },
    { icon: "settings-outline", text: "设置", onPress: onOpenSettings },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顶部栏 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="scan-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="settings-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 用户信息卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarWrap}>
              <Image source={avatar} style={styles.avatar} />
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>6</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Cat Music Lover</Text>
              <Text style={styles.subtitle}>ID: 18888888888</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 统计数据 */}
        <View style={styles.statsRow}>
          {[
            { label: "关注", value: "128" },
            { label: "粉丝", value: "2.4k" },
            { label: "获赞", value: "8.6k" },
            { label: "听歌", value: `${recentlyPlayed.length}` },
          ].map((item, index) => (
            <TouchableOpacity key={item.label} style={styles.statItem}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* VIP 横幅 */}
        <TouchableOpacity style={styles.vipBanner} activeOpacity={0.85}>
          <View style={styles.vipLeft}>
            <View style={styles.vipIcon}>
              <Ionicons name="diamond" size={20} color="#FFD700" />
            </View>
            <View>
              <Text style={styles.vipTitle}>开通黑胶VIP</Text>
              <Text style={styles.vipDesc}>畅听高品质音乐 · 专属皮肤</Text>
            </View>
          </View>
          <View style={styles.vipButton}>
            <Text style={styles.vipButtonText}>立即开通</Text>
          </View>
        </TouchableOpacity>

        {/* 快捷功能 */}
        <View style={styles.quickCard}>
          {quickActions.map((item, idx) => (
            <TouchableOpacity
              key={item.text}
              style={[
                styles.quickItem,
                idx < quickActions.length - 1 && styles.quickItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.quickIconWrap}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.color || "#fff"}
                />
                {item.count > 0 && (
                  <View style={styles.quickBadge}>
                    <Text style={styles.quickBadgeText}>{item.count}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI 歌单展示 */}
        {aiPlaylists.length > 0 && (
          <View style={styles.aiPlaylistSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="sparkles" size={18} color={THEME_BLUE} />
                <Text style={styles.sectionTitle}>AI 生成的歌单</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>查看全部</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.aiPlaylistScroll}
            >
              {aiPlaylists.slice(0, 5).map((playlist, index) => (
                <TouchableOpacity key={playlist.id || index} style={styles.aiPlaylistCard}>
                  <View style={styles.aiPlaylistCover}>
                    {playlist.songs?.[0]?.image ? (
                      <Image
                        source={playlist.songs[0].image}
                        style={styles.aiPlaylistImage}
                      />
                    ) : (
                      <Ionicons name="musical-notes" size={30} color="#666" />
                    )}
                    <View style={styles.aiPlaylistBadge}>
                      <Text style={styles.aiPlaylistBadgeText}>AI</Text>
                    </View>
                  </View>
                  <Text style={styles.aiPlaylistTitle} numberOfLines={1}>
                    {playlist.title}
                  </Text>
                  <Text style={styles.aiPlaylistCount}>
                    {playlist.songs?.length || 0} 首
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 菜单列表 */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.text}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={22} color="#fff" />
                <Text style={styles.menuText}>{item.text}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 退出登录 */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={onLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 我喜欢 Modal */}
      <Modal
        visible={showFavorites}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowFavorites(false)}
      >
        <FavoritesScreen
          onClose={() => setShowFavorites(false)}
          favorites={favorites}
          onPlaySong={onPlaySong}
          onPlayAll={(songs) => onPlaySong?.(songs[0], songs)}
          onRemoveFavorite={onRemoveFavorite}
        />
      </Modal>

      {/* 最近播放 Modal */}
      <Modal
        visible={showRecentlyPlayed}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowRecentlyPlayed(false)}
      >
        <RecentlyPlayedScreen
          onClose={() => setShowRecentlyPlayed(false)}
          recentlyPlayed={recentlyPlayed}
          onPlaySong={onPlaySong}
          onClearHistory={onClearHistory}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  // 顶部栏
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
  // 用户信息
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  levelBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME_BLUE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#121212",
  },
  levelText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "700",
  },
  profileInfo: {
    justifyContent: "center",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#888",
    fontSize: 13,
  },
  editButton: {
    padding: 8,
  },
  // 统计
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
  },
  // VIP 横幅
  vipBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  vipLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  vipTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  vipDesc: {
    color: "#888",
    fontSize: 12,
  },
  vipButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  vipButtonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "600",
  },
  // 快捷功能
  quickCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    marginBottom: 16,
  },
  quickItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 18,
  },
  quickItemBorder: {
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.05)",
  },
  quickIconWrap: {
    position: "relative",
    marginBottom: 8,
  },
  quickBadge: {
    position: "absolute",
    top: -6,
    right: -12,
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  quickBadgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
  quickText: {
    color: "#fff",
    fontSize: 13,
  },
  // AI 歌单
  aiPlaylistSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  seeAllText: {
    color: THEME_BLUE,
    fontSize: 13,
  },
  aiPlaylistScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  aiPlaylistCard: {
    width: 120,
    marginRight: 12,
  },
  aiPlaylistCover: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  aiPlaylistImage: {
    width: "100%",
    height: "100%",
  },
  aiPlaylistBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiPlaylistBadgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
  aiPlaylistTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  aiPlaylistCount: {
    color: "#888",
    fontSize: 12,
  },
  // 菜单列表
  menuList: {
    marginHorizontal: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuText: {
    color: "#fff",
    fontSize: 15,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuBadge: {
    backgroundColor: "rgba(111, 189, 211, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  menuBadgeText: {
    color: THEME_BLUE,
    fontSize: 12,
    fontWeight: "600",
  },
  // 退出按钮
  logoutBtn: {
    marginHorizontal: 16,
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  logoutText: {
    color: "#888",
    fontWeight: "600",
    fontSize: 15,
  },
});
