import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AIAssistantIcon from "../components/AIAssistantIcon";
import { searchSongs } from "../services/songMatcher";
import {
  extractTagsFromNaturalLanguage,
  generateAIResponse,
} from "../services/aiService";
import { generateSmartPlaylist } from "../services/songMatcher";
import { TAG_LABELS } from "../data/musicDatabase";

// 主题色
const THEME_BLUE = "#6FBDD3";

// 搜索历史
const DEFAULT_HISTORY = [
  "周杰伦",
  "陶喆",
  "方大同",
  "City Pop",
  "放松音乐",
];

// 热门榜单
const CHARTS = [
  {
    title: "热播榜",
    color: "#FF6B6B",
    items: ["望春风", "爱爱爱", "十年", "晴天", "稻香", "孤独患者"],
  },
  {
    title: "新歌榜",
    color: "#4ECDC4",
    items: ["夜に駆ける", "Faded", "Closer", "光年之外", "泡沫", "演员"],
  },
  {
    title: "经典榜",
    color: "#FFE66D",
    items: ["爱很简单", "唯一", "Plastic Love", "Stay With Me", "红豆", "安静"],
  },
];

// 热门搜索标签
const HOT_TAGS = [
  { text: "周五放松", icon: "🎵" },
  { text: "City Pop", icon: "🌃" },
  { text: "学习BGM", icon: "📚" },
  { text: "运动歌单", icon: "💪" },
  { text: "深夜情歌", icon: "🌙" },
  { text: "怀旧金曲", icon: "📻" },
];

function HistoryChip({ label, onPress, onDelete }) {
  return (
    <TouchableOpacity style={styles.chip} activeOpacity={0.85} onPress={onPress}>
      <Text style={styles.chipText} numberOfLines={1}>
        {label}
      </Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.chipDelete}>
          <Ionicons name="close" size={12} color="#888" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default function SearchScreen({ onOpenAI, onPlaySong }) {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchHistory, setSearchHistory] = useState(DEFAULT_HISTORY);
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  
  const inputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 执行搜索
  const handleSearch = async (text = searchText) => {
    if (!text.trim()) return;

    Keyboard.dismiss();
    setIsSearching(true);
    setSearchResults(null);
    setAiResult(null);

    // 添加到搜索历史
    if (!searchHistory.includes(text)) {
      setSearchHistory([text, ...searchHistory.slice(0, 9)]);
    }

    // 判断是否是自然语言搜索（包含描述性词汇）
    const isNaturalLanguage = /想|要|听|推荐|感觉|心情|适合|风格|类型/.test(text);

    if (isNaturalLanguage) {
      // AI 智能搜索
      setIsAISearching(true);
      try {
        const { tags, title, description, source } = await extractTagsFromNaturalLanguage(text);
        const matchResult = generateSmartPlaylist(tags, { targetLength: 15 });

        if (matchResult.songs.length > 0) {
          setAiResult({
            title,
            description,
            tags,
            songs: matchResult.songs,
            source,
          });
        }
      } catch (error) {
        console.error("AI search error:", error);
      }
      setIsAISearching(false);
    }

    // 传统搜索（同时进行）
    const results = searchSongs(text, 20);
    setSearchResults(results);
    setIsSearching(false);
  };

  // 清除搜索
  const handleClear = () => {
    setSearchText("");
    setSearchResults(null);
    setAiResult(null);
    inputRef.current?.focus();
  };

  // 清除历史
  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // 删除单个历史
  const handleDeleteHistory = (item) => {
    setSearchHistory(searchHistory.filter((h) => h !== item));
  };

  // 渲染搜索结果
  const renderSearchResults = () => {
    if (isSearching || isAISearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_BLUE} />
          <Text style={styles.loadingText}>
            {isAISearching ? "AI 正在理解你的需求..." : "搜索中..."}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {/* AI 智能推荐结果 */}
        {aiResult && (
          <View style={styles.aiResultCard}>
            <View style={styles.aiResultHeader}>
              <View style={styles.aiResultTitleRow}>
                <AIAssistantIcon size={24} color={THEME_BLUE} />
                <Text style={styles.aiResultTitle}>{aiResult.title}</Text>
                {aiResult.source === "siliconflow" && (
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>AI</Text>
                  </View>
                )}
              </View>
              <Text style={styles.aiResultDesc}>
                根据「{searchText}」为你智能推荐
              </Text>
              {/* 标签 */}
              <View style={styles.aiTagsContainer}>
                {aiResult.tags.slice(0, 5).map((tag, index) => (
                  <View key={index} style={styles.aiTag}>
                    <Text style={styles.aiTagText}>
                      {TAG_LABELS[tag]?.zh || tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            {/* AI 推荐歌曲列表 */}
            {aiResult.songs.slice(0, 5).map((song, index) => (
              <TouchableOpacity
                key={song.id}
                style={styles.songItem}
                onPress={() => onPlaySong?.(song, aiResult.songs)}
              >
                <Text style={styles.songIndex}>{index + 1}</Text>
                <Image source={song.image} style={styles.songImage} />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {song.artist}
                  </Text>
                </View>
                <Ionicons name="play-circle" size={28} color={THEME_BLUE} />
              </TouchableOpacity>
            ))}
            {aiResult.songs.length > 5 && (
              <TouchableOpacity style={styles.viewMoreBtn}>
                <Text style={styles.viewMoreText}>
                  查看全部 {aiResult.songs.length} 首
                </Text>
                <Ionicons name="chevron-forward" size={16} color={THEME_BLUE} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 传统搜索结果 */}
        {searchResults && searchResults.songs.length > 0 && (
          <View style={styles.traditionalResults}>
            <Text style={styles.sectionTitle}>
              搜索结果 ({searchResults.totalMatched})
            </Text>
            {searchResults.songs.map((song, index) => (
              <TouchableOpacity
                key={song.id}
                style={styles.songItem}
                onPress={() => onPlaySong?.(song, searchResults.songs)}
              >
                <Image source={song.image} style={styles.songImage} />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {song.artist}
                    {song.album && ` · ${song.album}`}
                  </Text>
                </View>
                <TouchableOpacity style={styles.songMoreBtn}>
                  <Ionicons name="ellipsis-vertical" size={18} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 无结果 */}
        {searchResults && searchResults.songs.length === 0 && !aiResult && (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color="#444" />
            <Text style={styles.noResultsText}>
              没有找到「{searchText}」相关的歌曲
            </Text>
            <Text style={styles.noResultsHint}>
              试试用自然语言描述，比如"想听放松的歌"
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  // 渲染默认内容（搜索历史和榜单）
  const renderDefaultContent = () => (
    <ScrollView style={styles.defaultContent} showsVerticalScrollIndicator={false}>
      {/* AI 智能搜索提示 */}
      <TouchableOpacity style={styles.aiPromptCard} onPress={onOpenAI}>
        <View style={styles.aiPromptIcon}>
          <AIAssistantIcon size={32} color={THEME_BLUE} />
        </View>
        <View style={styles.aiPromptText}>
          <Text style={styles.aiPromptTitle}>AI 智能推荐</Text>
          <Text style={styles.aiPromptDesc}>
            告诉我你的心情，为你生成专属歌单
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      {/* 热门搜索标签 */}
      <View style={styles.hotTagsSection}>
        <Text style={styles.sectionTitle}>热门搜索</Text>
        <View style={styles.hotTagsContainer}>
          {HOT_TAGS.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={styles.hotTag}
              onPress={() => {
                setSearchText(tag.text);
                handleSearch(tag.text);
              }}
            >
              <Text style={styles.hotTagIcon}>{tag.icon}</Text>
              <Text style={styles.hotTagText}>{tag.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 搜索历史 */}
      {searchHistory.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>搜索历史</Text>
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearText}>清空</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyChips}>
            {searchHistory.map((item, index) => (
              <HistoryChip
                key={index}
                label={item}
                onPress={() => {
                  setSearchText(item);
                  handleSearch(item);
                }}
                onDelete={() => handleDeleteHistory(item)}
              />
            ))}
          </View>
        </View>
      )}

      {/* 榜单 */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>排行榜</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartRow}
      >
        {CHARTS.map((chart, chartIndex) => (
          <View key={chartIndex} style={styles.chartCard}>
            <View style={[styles.chartHeader, { backgroundColor: chart.color }]}>
              <Text style={styles.chartTitle}>{chart.title}</Text>
            </View>
            <View style={styles.chartContent}>
              {chart.items.map((name, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chartItem}
                  onPress={() => {
                    setSearchText(name);
                    handleSearch(name);
                  }}
                >
                  <Text
                    style={[
                      styles.rankText,
                      idx < 3 && { color: chart.color },
                    ]}
                  >
                    {idx + 1}
                  </Text>
                  <Text style={styles.chartSongText} numberOfLines={1}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ height: 120 }} />
    </ScrollView>
  );

  const hasSearchContent = searchText.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.topIcons}>
          <TouchableOpacity onPress={onOpenAI}>
            <AIAssistantIcon size={28} color={THEME_BLUE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          ref={inputRef}
          placeholder="搜索歌曲、歌手，或描述你想听的音乐"
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        {hasSearchContent && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* 内容区域 */}
      {hasSearchContent || searchResults || aiResult
        ? renderSearchResults()
        : renderDefaultContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
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
  // 搜索框
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#fff",
  },
  // 默认内容
  defaultContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // AI 提示卡片
  aiPromptCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(111, 189, 211, 0.1)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(111, 189, 211, 0.2)",
  },
  aiPromptIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(111, 189, 211, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  aiPromptText: {
    flex: 1,
  },
  aiPromptTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  aiPromptDesc: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  // 热门标签
  hotTagsSection: {
    marginBottom: 20,
  },
  hotTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  hotTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  hotTagIcon: {
    fontSize: 14,
  },
  hotTagText: {
    color: "#fff",
    fontSize: 13,
  },
  // 搜索历史
  historySection: {
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  clearText: {
    color: "#888",
    fontSize: 13,
  },
  historyChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    color: "#ccc",
    maxWidth: 100,
  },
  chipDelete: {
    padding: 2,
  },
  // 榜单
  chartRow: {
    paddingTop: 12,
    paddingRight: 16,
    gap: 12,
  },
  chartCard: {
    width: 200,
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
  },
  chartHeader: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  chartTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  chartContent: {
    padding: 10,
  },
  chartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  rankText: {
    width: 24,
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  chartSongText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  // 加载状态
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  loadingText: {
    color: "#888",
    marginTop: 16,
    fontSize: 14,
  },
  // 搜索结果
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // AI 结果卡片
  aiResultCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(111, 189, 211, 0.2)",
  },
  aiResultHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  aiResultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  aiResultTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  aiBadge: {
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aiBadgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
  aiResultDesc: {
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
  },
  aiTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  aiTag: {
    backgroundColor: "rgba(111, 189, 211, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  aiTagText: {
    color: THEME_BLUE,
    fontSize: 11,
  },
  // 歌曲列表
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
  },
  songIndex: {
    width: 24,
    color: "#666",
    fontSize: 13,
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
  songMoreBtn: {
    padding: 8,
  },
  viewMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 4,
  },
  viewMoreText: {
    color: THEME_BLUE,
    fontSize: 13,
  },
  // 传统搜索结果
  traditionalResults: {
    marginTop: 10,
  },
  // 无结果
  noResults: {
    alignItems: "center",
    paddingTop: 60,
  },
  noResultsText: {
    color: "#888",
    fontSize: 15,
    marginTop: 16,
  },
  noResultsHint: {
    color: "#666",
    fontSize: 13,
    marginTop: 8,
  },
});
