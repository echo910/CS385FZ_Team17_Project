import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AIAssistantIcon from "../components/AIAssistantIcon";

function HistoryChip({ label, onPress, style, textStyle }) {
  return (
    <TouchableOpacity
      style={[styles.chip, style]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Text style={[styles.chipText, textStyle]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const HISTORY = [
  "几分之几（You Complete Me)",
  "陶喆",
  "方大同",
  "王力宏",
  "王力宏",
  "王力宏",
  "王力宏",
];

const CHARTS = [
  {
    title: "热播榜",
    items: [
      "Susan说",
      "爱爱爱",
      "贝加尔湖畔",
      "那沙漠里的水",
      "回留",
      "望春风",
      "Tango",
      "孤独患者",
      "爱错",
      "江湖中人",
      "歌手与模特儿",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
    ],
  },
  {
    title: "歌手榜",
    items: [
      "Susan说",
      "爱爱爱",
      "贝加尔湖畔",
      "那沙漠里的水",
      "回留",
      "望春风",
      "Tango",
      "孤独患者",
      "爱错",
      "江湖中人",
      "歌手与模特儿",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
    ],
  },
  {
    title: "专辑榜",
    items: [
      "Susan说",
      "爱爱爱",
      "贝加尔湖畔",
      "那沙漠里的水",
      "回留",
      "望春风",
      "Tango",
      "孤独患者",
      "爱错",
      "江湖中人",
      "歌手与模特儿",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
    ],
  },
  {
    title: "MV榜",
    items: [
      "Susan说",
      "爱爱爱",
      "贝加尔湖畔",
      "那沙漠里的水",
      "回留",
      "望春风",
      "Tango",
      "孤独患者",
      "爱错",
      "江湖中人",
      "歌手与模特儿",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
      "Susan说",
    ],
  },
];

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.topIcons}>
          <AIAssistantIcon size={30} color="#66bdd3" />
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </View>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="What do you want to listen?"
          placeholderTextColor="#444"
          style={styles.searchInput}
        />
        <Ionicons name="search" size={20} color="#000" />
      </View>

      {/* 搜索历史 */}
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Search History</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.historyClear}>Clear History</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.historyChips}
      >
        {HISTORY.map((item, index) => (
          <HistoryChip
            key={item + index}
            label={item}
            style={{ marginRight: index === HISTORY.length - 1 ? 0 : 8 }}
          />
        ))}
      </ScrollView>

      {/* 榜单区域 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartRow}
      >
        {CHARTS.map((chart, chartIndex) => (
          <View key={chart.title + chartIndex} style={styles.chartCard}>
            <Text style={styles.chartTitle}>{chart.title}</Text>
            <View style={styles.chartDivider} />
            <ScrollView>
              {chart.items.map((name, idx) => {
                const rank = idx + 1;
                const highlight = rank <= 3;
                return (
                  <View key={rank + name} style={styles.chartItem}>
                    <Text
                      style={[
                        styles.rankText,
                        highlight && styles.rankHighlight,
                      ]}
                    >
                      {rank}
                    </Text>
                    <Text style={styles.songText}>{name}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3133",
    paddingTop: 12,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  topIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: "rgba(0,0,0,0.08)",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 8,
  },
  historyTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  historyClear: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
  },
  historyChips: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: "#fff",
    width: 71,
    height: 32,
    paddingVertical: 0,
    paddingHorizontal: 4,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  chipText: {
    fontSize: 10,
    color: "rgba(0,0,0,0.5)",
  },
  chartRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
  },
  chartCard: {
    width: 230,
    backgroundColor: "#1d2224",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  chartTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  chartDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
  },
  chartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  rankText: {
    width: 24,
    color: "#fff",
    fontSize: 12,
    textAlign: "right",
    marginRight: 6,
  },
  rankHighlight: {
    color: "#ff3a3a",
  },
  songText: {
    color: "#fff",
    fontSize: 12,
  },
});


