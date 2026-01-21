import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const THEME_BLUE = "#6FBDD3";

export default function SettingsScreen({ onClose, settings = {}, onSettingChange }) {
  const [audioQuality, setAudioQuality] = React.useState(settings.audioQuality || "high");
  const [autoPlay, setAutoPlay] = React.useState(settings.autoPlay !== false);
  const [downloadOnWifi, setDownloadOnWifi] = React.useState(settings.downloadOnWifi !== false);
  const [showLyrics, setShowLyrics] = React.useState(settings.showLyrics !== false);
  const [notifications, setNotifications] = React.useState(settings.notifications !== false);
  const [darkMode, setDarkMode] = React.useState(settings.darkMode !== false);

  const handleSettingChange = (key, value) => {
    onSettingChange?.(key, value);
  };

  const settingSections = [
    {
      title: "播放设置",
      items: [
        {
          icon: "musical-notes-outline",
          label: "音质选择",
          type: "select",
          value: audioQuality,
          options: [
            { label: "标准", value: "standard" },
            { label: "高品质", value: "high" },
            { label: "无损", value: "lossless" },
          ],
          onPress: () => {
            const qualities = ["standard", "high", "lossless"];
            const currentIndex = qualities.indexOf(audioQuality);
            const nextQuality = qualities[(currentIndex + 1) % qualities.length];
            setAudioQuality(nextQuality);
            handleSettingChange("audioQuality", nextQuality);
          },
        },
        {
          icon: "play-circle-outline",
          label: "自动播放下一首",
          type: "switch",
          value: autoPlay,
          onToggle: (value) => {
            setAutoPlay(value);
            handleSettingChange("autoPlay", value);
          },
        },
        {
          icon: "text-outline",
          label: "显示歌词",
          type: "switch",
          value: showLyrics,
          onToggle: (value) => {
            setShowLyrics(value);
            handleSettingChange("showLyrics", value);
          },
        },
      ],
    },
    {
      title: "下载设置",
      items: [
        {
          icon: "wifi-outline",
          label: "仅在 WiFi 下下载",
          type: "switch",
          value: downloadOnWifi,
          onToggle: (value) => {
            setDownloadOnWifi(value);
            handleSettingChange("downloadOnWifi", value);
          },
        },
        {
          icon: "folder-outline",
          label: "下载位置",
          type: "navigate",
          value: "内部存储",
        },
        {
          icon: "trash-outline",
          label: "清除缓存",
          type: "action",
          value: "0 MB",
          onPress: () => {
            // 清除缓存逻辑
          },
        },
      ],
    },
    {
      title: "通知设置",
      items: [
        {
          icon: "notifications-outline",
          label: "推送通知",
          type: "switch",
          value: notifications,
          onToggle: (value) => {
            setNotifications(value);
            handleSettingChange("notifications", value);
          },
        },
      ],
    },
    {
      title: "外观",
      items: [
        {
          icon: "moon-outline",
          label: "深色模式",
          type: "switch",
          value: darkMode,
          onToggle: (value) => {
            setDarkMode(value);
            handleSettingChange("darkMode", value);
          },
        },
      ],
    },
    {
      title: "关于",
      items: [
        {
          icon: "information-circle-outline",
          label: "版本",
          type: "info",
          value: "1.0.0",
        },
        {
          icon: "document-text-outline",
          label: "用户协议",
          type: "navigate",
        },
        {
          icon: "shield-checkmark-outline",
          label: "隐私政策",
          type: "navigate",
        },
        {
          icon: "help-circle-outline",
          label: "帮助与反馈",
          type: "navigate",
        },
      ],
    },
  ];

  const getQualityLabel = (quality) => {
    const labels = {
      standard: "标准",
      high: "高品质",
      lossless: "无损",
    };
    return labels[quality] || quality;
  };

  const renderSettingItem = (item, index, isLast) => {
    return (
      <TouchableOpacity
        key={index}
        style={[styles.settingItem, !isLast && styles.settingItemBorder]}
        onPress={item.onPress}
        disabled={item.type === "switch" || item.type === "info"}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <Ionicons name={item.icon} size={22} color="#fff" />
          <Text style={styles.settingLabel}>{item.label}</Text>
        </View>
        <View style={styles.settingRight}>
          {item.type === "switch" && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: "#3a3a3a", true: THEME_BLUE }}
              thumbColor="#fff"
            />
          )}
          {item.type === "select" && (
            <View style={styles.selectValue}>
              <Text style={styles.settingValue}>{getQualityLabel(item.value)}</Text>
              <Ionicons name="chevron-forward" size={18} color="#666" />
            </View>
          )}
          {item.type === "navigate" && (
            <View style={styles.navigateValue}>
              {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
              <Ionicons name="chevron-forward" size={18} color="#666" />
            </View>
          )}
          {item.type === "action" && (
            <View style={styles.actionValue}>
              <Text style={styles.settingValue}>{item.value}</Text>
              <Ionicons name="chevron-forward" size={18} color="#666" />
            </View>
          )}
          {item.type === "info" && (
            <Text style={styles.settingValue}>{item.value}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航 */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>设置</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* 设置列表 */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) =>
                  renderSettingItem(
                    item,
                    itemIndex,
                    itemIndex === section.items.length - 1
                  )
                )}
              </View>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 14,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  settingLabel: {
    color: "#fff",
    fontSize: 15,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    color: "#888",
    fontSize: 14,
    marginRight: 4,
  },
  selectValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigateValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionValue: {
    flexDirection: "row",
    alignItems: "center",
  },
});
