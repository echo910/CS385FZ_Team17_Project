import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MusicCard from "../components/MusicCard";

// 导入 AI 服务和歌曲匹配器
import {
  extractTagsFromNaturalLanguage,
  analyzeIntent,
  generateAIResponse,
  generateNoResultResponse,
  getAIStatus,
} from "../services/aiService";
import { generateSmartPlaylist } from "../services/songMatcher";
import { TAG_LABELS } from "../data/musicDatabase";

// 导入图片资源
const albumImage1 = require("../assets/album1.png");
const albumImage2 = require("../assets/album2.png");
const heroImage1 = require("../assets/hero1.png");
const heroImage2 = require("../assets/hero2.png");

// 猫咪头像
const aiCatAvatar = require("../assets/ai_cat.png");

const { width } = Dimensions.get("window");

// 主题色
const THEME_BLUE = "#6FBDD3";
const THEME_DARK = "#151515";
const THEME_CARD = "#1E1E1E";

// 快捷提示词
const QUICK_PROMPTS = [
  { id: 1, text: "周五下班放松", icon: "🚇" },
  { id: 2, text: "80年代City Pop", icon: "🌃" },
  { id: 3, text: "雨天读书", icon: "🌧️" },
  { id: 4, text: "深夜一个人", icon: "🌙" },
  { id: 5, text: "运动健身", icon: "💪" },
  { id: 6, text: "学习专注", icon: "📚" },
];

export default function AIAssistantScreen({ onClose, onPlaySong, onPlayPlaylist }) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // 获取 AI 状态
  const aiStatus = getAIStatus();

  // 消息列表
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "ai",
      content:
        `喵~ 你好！我是你的 AI 音乐猫 🐱🎵\n\n${aiStatus.mode === "online" ? `🤖 已连接 ${aiStatus.provider}` : "💡 本地智能匹配模式"}\n\n告诉我你想听什么感觉的歌？比如：\n• \"周五下班在地铁上，又累又想放松\"\n• \"80年代复古风格的City Pop\"\n• \"雨天适合读书的轻音乐\"`,
      dataType: "text",
    },
    {
      id: "quick-prompts",
      type: "ai",
      content: "或者试试这些快捷入口：",
      dataType: "quickPrompts",
    },
  ]);

  // 打字动画
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  // 自动滚动到底部
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  // 处理发送消息
  const handleSend = (text = inputText) => {
    if (!text.trim()) return;

    // 添加用户消息
    const userMsg = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      dataType: "text",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 模拟 AI 处理延迟
    setTimeout(() => {
      processUserInput(text);
    }, 800 + Math.random() * 700);
  };

  // 处理用户输入 (异步版本，支持在线 AI)
  const processUserInput = async (input) => {
    try {
      // 1. 分析意图
      const intent = analyzeIntent(input);

      // 2. 提取标签 (现在是异步的，支持在线 AI)
      const { tags, title, description, source } = await extractTagsFromNaturalLanguage(input);

      // 3. 匹配歌曲
      const matchResult = generateSmartPlaylist(tags, { targetLength: 12 });

      let aiResponse;

      if (matchResult.songs.length > 0) {
        // 找到匹配的歌曲
        const responseText = generateAIResponse(
          tags,
          matchResult.songs.length,
          title,
          source
        );

        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: responseText,
          dataType: "playlist",
          data: {
            title,
            description,
            tags,
            songs: matchResult.songs,
            totalMatched: matchResult.totalMatched,
            aiSource: source, // 标记 AI 来源
          },
        };
      } else {
        // 没有找到匹配的歌曲
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: generateNoResultResponse(),
          dataType: "text",
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI processing error:", error);
      // 错误处理
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "喵呜...出了点小问题，请再试一次吧~ 🐱",
        dataType: "text",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // 处理快捷提示词点击
  const handleQuickPrompt = (prompt) => {
    handleSend(prompt.text);
  };

  // 处理歌曲点击
  const handleSongPress = (song) => {
    if (onPlaySong) {
      onPlaySong(song);
    }
  };

  // 处理播放整个歌单
  const handlePlayAll = (playlistData) => {
    if (onPlayPlaylist) {
      onPlayPlaylist(playlistData);
    }
  };

  // 渲染标签
  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {tags.slice(0, 5).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>
              {TAG_LABELS[tag]?.zh || tag}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // 渲染歌曲列表项
  const renderSongItem = (song, index) => (
    <TouchableOpacity
      key={song.id}
      style={styles.songItem}
      onPress={() => handleSongPress(song)}
      activeOpacity={0.7}
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
      <TouchableOpacity style={styles.songPlayBtn}>
        <Ionicons name="play-circle" size={28} color={THEME_BLUE} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // 渲染消息项
  const renderItem = ({ item }) => {
    const isUser = item.type === "user";

    // 快捷提示词特殊渲染
    if (item.dataType === "quickPrompts") {
      return (
        <View style={styles.quickPromptsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsScroll}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt.id}
                style={styles.quickPromptBtn}
                onPress={() => handleQuickPrompt(prompt)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickPromptIcon}>{prompt.icon}</Text>
                <Text style={styles.quickPromptText}>{prompt.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.rowReverse : styles.rowStart,
        ]}
      >
        {/* 头像 */}
        <View style={styles.avatarContainer}>
          {isUser ? (
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={18} color="#fff" />
            </View>
          ) : (
            <View style={styles.aiAvatarBg}>
              <Image
                source={aiCatAvatar}
                style={styles.aiCatImage}
                resizeMode="contain"
                tintColor={THEME_BLUE}
              />
            </View>
          )}
        </View>

        {/* 消息内容 */}
        <View style={{ maxWidth: "82%", flex: 1 }}>
          <View
            style={[
              styles.bubble,
              isUser ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[styles.messageText, isUser ? styles.userText : null]}
            >
              {item.content}
            </Text>
          </View>

          {/* 歌单结果 */}
          {item.dataType === "playlist" && item.data && (
            <View style={styles.playlistResultContainer}>
              {/* 歌单头部 */}
              <View style={styles.playlistHeader}>
                <View style={styles.playlistTitleRow}>
                  <View style={styles.playlistTitleWithBadge}>
                    <Text style={styles.playlistTitle}>{item.data.title}</Text>
                    {item.data.aiSource === "siliconflow" && (
                      <View style={styles.aiSourceBadge}>
                        <Text style={styles.aiSourceText}>🤖 AI</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.playAllBtn}
                    onPress={() => handlePlayAll(item.data)}
                  >
                    <Ionicons name="play" size={14} color="#000" />
                    <Text style={styles.playAllText}>播放全部</Text>
                  </TouchableOpacity>
                </View>
                {renderTags(item.data.tags)}
                <Text style={styles.playlistCount}>
                  共 {item.data.songs.length} 首歌曲
                  {item.data.totalMatched > item.data.songs.length &&
                    ` (匹配到 ${item.data.totalMatched} 首)`}
                </Text>
              </View>

              {/* 歌曲列表 */}
              <View style={styles.songsList}>
                {item.data.songs.slice(0, 6).map((song, index) =>
                  renderSongItem(song, index)
                )}
              </View>

              {/* 查看更多 */}
              {item.data.songs.length > 6 && (
                <TouchableOpacity style={styles.viewMoreBtn}>
                  <Text style={styles.viewMoreText}>
                    查看全部 {item.data.songs.length} 首
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={THEME_BLUE} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  // 渲染打字指示器
  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.aiAvatarBg}>
          <Image
            source={aiCatAvatar}
            style={styles.aiCatImage}
            resizeMode="contain"
            tintColor={THEME_BLUE}
          />
        </View>
        <View style={styles.typingBubble}>
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: typingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: typingAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: typingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.3],
                }),
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Image
              source={aiCatAvatar}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
              tintColor={THEME_BLUE}
            />
            <Text style={styles.headerTitle}>Music Meow</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 消息列表 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
        />

        {/* 输入区域 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="描述你想听的音乐..."
                placeholderTextColor="#666"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? THEME_BLUE : "#333" },
                ]}
                onPress={() => handleSend()}
                disabled={!inputText.trim()}
              >
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color={inputText.trim() ? "#000" : "#666"}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHint}>
              💡 试试描述场景、心情或风格
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_DARK,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  aiBadge: {
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  rowStart: {
    justifyContent: "flex-start",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  aiAvatarBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(111, 189, 211, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(111, 189, 211, 0.3)",
  },
  aiCatImage: {
    width: 22,
    height: 22,
  },
  bubble: {
    padding: 14,
    borderRadius: 18,
    maxWidth: "100%",
  },
  aiBubble: {
    backgroundColor: "#252525",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: THEME_BLUE,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#fff",
  },
  userText: {
    color: "#000",
    fontWeight: "500",
  },
  // 快捷提示词
  quickPromptsContainer: {
    marginLeft: 52,
    marginBottom: 16,
  },
  quickPromptsScroll: {
    paddingRight: 20,
  },
  quickPromptBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252525",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(111, 189, 211, 0.2)",
  },
  quickPromptIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  quickPromptText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  // 歌单结果
  playlistResultContainer: {
    backgroundColor: THEME_CARD,
    borderRadius: 16,
    marginTop: 12,
    overflow: "hidden",
  },
  playlistHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  playlistTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  playlistTitleWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
  },
  aiSourceBadge: {
    backgroundColor: "rgba(147, 112, 219, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  aiSourceText: {
    color: "#9370DB",
    fontSize: 10,
    fontWeight: "600",
  },
  playAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  playAllText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "rgba(111, 189, 211, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: THEME_BLUE,
    fontSize: 11,
    fontWeight: "500",
  },
  playlistCount: {
    color: "#888",
    fontSize: 12,
  },
  // 歌曲列表
  songsList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  songIndex: {
    width: 24,
    color: "#666",
    fontSize: 13,
    textAlign: "center",
  },
  songImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  songArtist: {
    color: "#888",
    fontSize: 12,
  },
  songPlayBtn: {
    padding: 4,
  },
  viewMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    gap: 4,
  },
  viewMoreText: {
    color: THEME_BLUE,
    fontSize: 13,
    fontWeight: "500",
  },
  // 打字指示器
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    marginTop: 8,
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#252525",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    marginLeft: 8,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_BLUE,
  },
  // 输入区域
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    backgroundColor: THEME_DARK,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#252525",
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  inputHint: {
    color: "#555",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
});
