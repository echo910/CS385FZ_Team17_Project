import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const avatar = require("../assets/artist1.png");
const vipBadge = require("../assets/album1.png"); // 临时代用作徽标示例，可替换为正式资源

export default function MyHomeScreen({ onLogout }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
        <Text style={styles.headerTitle}>My</Text>
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </View>

      {/* 头像卡片 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.vipCorner}>
            <Image source={vipBadge} style={styles.vipIcon} />
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Cat Music Lover</Text>
          <Text style={styles.subtitle}>ID: 18888888888</Text>
          <View style={styles.statsRow}>
            {[
              { label: "关注", value: "128" },
              { label: "粉丝", value: "2.4k" },
              { label: "获赞", value: "8.6k" },
            ].map((item) => (
              <View key={item.label} style={styles.statBox}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.levelBadge} activeOpacity={0.85}>
          <Text style={styles.levelText}>LV.6</Text>
        </TouchableOpacity>
      </View>

      {/* VIP 横幅 */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>开通黑胶VIP</Text>
          <Text style={styles.bannerDesc}>畅听高品质音乐 · 主题皮肤</Text>
        </View>
        <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
          <Text style={styles.bannerBtnText}>立即开通</Text>
        </TouchableOpacity>
      </View>

      {/* 快捷功能 */}
      <View style={styles.quickCard}>
        {[
          { icon: "musical-notes-outline", text: "本地音乐" },
          { icon: "heart-outline", text: "我喜欢" },
          { icon: "cloud-download-outline", text: "已下载" },
          { icon: "star-outline", text: "收藏夹" },
        ].map((item, idx) => (
          <View key={item.text} style={[styles.quickItem, idx === 3 && { borderRightWidth: 0 }]}>
            <Ionicons name={item.icon} size={22} color="#fff" />
            <Text style={styles.quickText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* 列表 */}
      <View style={styles.list}>
        {[
          { icon: "time-outline", text: "最近播放" },
          { icon: "albums-outline", text: "我的歌单" },
          { icon: "chatbubble-ellipses-outline", text: "我的评论" },
          { icon: "settings-outline", text: "设置" },
        ].map((item, index) => (
          <TouchableOpacity key={item.text} style={[styles.listItem, index < 3 && styles.listDivider]}>
            <View style={styles.listLeft}>
              <Ionicons name={item.icon} size={20} color="#fff" />
              <Text style={styles.listText}>{item.text}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 退出 */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={onLogout}
        activeOpacity={0.85}
      >
        <Text style={styles.logoutText}>退出登陆</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1f22",
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22272a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    position: "relative",
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 14,
  },
  vipCorner: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#1c1f22",
    alignItems: "center",
    justifyContent: "center",
  },
  vipIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
  },
  levelBadge: {
    backgroundColor: "#6fbdd3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  levelText: {
    color: "#022251",
    fontWeight: "700",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 12,
  },
  statBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#1c1f22",
  },
  statValue: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginTop: 2,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0545a2",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bannerDesc: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    marginBottom: 0,
    fontSize: 12,
  },
  bannerBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  bannerBtnText: {
    color: "#0545a2",
    fontWeight: "700",
    fontSize: 13,
  },
  quickCard: {
    flexDirection: "row",
    backgroundColor: "#22272a",
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  quickItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.06)",
    gap: 6,
  },
  quickText: {
    color: "#fff",
    fontSize: 13,
  },
  list: {
    backgroundColor: "#22272a",
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  listDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listText: {
    color: "#fff",
    fontSize: 15,
  },
  logoutBtn: {
    marginTop: 8,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});


