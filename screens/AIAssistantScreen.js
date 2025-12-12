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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import AIAssistantIcon from "../components/AIAssistantIcon"; // 不再需要旧图标组件
import MusicCard from "../components/MusicCard";

// 导入现有图片资源
const albumImage1 = require("../assets/album1.png");
const albumImage2 = require("../assets/album2.png");
const heroImage1 = require("../assets/hero1.png");
const heroImage2 = require("../assets/hero2.png");

// --- 新增：导入猫咪素材 ---
// 【重要】请确保你的 assets 文件夹里有一张名为 ai_cat.png 的图片
// 如果没有，请先随便找一张图重命名放进去
const aiCatAvatar = require("../assets/ai_cat.png");

const MOCK_RECOMMENDATIONS = [
  { id: 101, title: "午夜 City Pop", subtitle: "放松 · 怀旧", image: heroImage1 },
  { id: 102, title: "下班地铁", subtitle: "治愈 · 独处", image: albumImage1 },
  { id: 103, title: "周五狂欢", subtitle: "能量 · 节奏", image: heroImage2 },
  { id: 104, title: "雨天读书", subtitle: "静谧 · 纯音", image: albumImage2 },
];

// 定义主题色
const THEME_BLUE = "#6FBDD3";

export default function AIAssistantScreen({ onClose }) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // --- 更新：修改了默认欢迎语，增加猫咪元素 ---
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      content:
        "喵~ 你好！我是你的 AI 音乐猫。🐱🎵\n\n告诉我你想听什么感觉的歌？比如：\n\"周五下班想听点放松的歌\"",
      dataType: "text",
    },
  ]);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      dataType: "text",
    };
    setMessages((prev) => [...prev, userMsg]);
    const originalText = inputText;
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = {};
      if (
        originalText.includes("歌") ||
        originalText.includes("听") ||
        originalText.includes("推荐") ||
        originalText.includes("pop") ||
        originalText.includes("放松")
      ) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `喵呜！捕捉到关键词 "${originalText}"。这是为你准备的私藏猫粮（歌单），快尝尝！🐟`,
          dataType: "playlist",
          data: MOCK_RECOMMENDATIONS,
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "呼噜呼噜...虽然我只是一只猫，但我也在努力理解人类的语言。试着对我说\"推荐一些歌\"吧？",
          dataType: "text",
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const renderItem = ({ item }) => {
    const isUser = item.type === "user";

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.rowReverse : styles.rowStart,
        ]}
      >
        {/* 头像区域 */}
        <View style={styles.avatarContainer}>
          {isUser ? (
            <Image
              source={require("../assets/artist1.png")}
              style={styles.avatar}
            />
          ) : (
            // --- 更新：AI 头像部分改为显示猫咪图片 ---
            <View style={styles.aiAvatarBg}>
              <Image
                source={aiCatAvatar}
                style={styles.aiCatImage}
                resizeMode="contain"
                // 如果你的猫咪图片是纯黑色的，可以用 tintColor 把它染成主题蓝
                // 如果图片本身有颜色，可以去掉这一行
                tintColor={THEME_BLUE}
              />
            </View>
          )}
        </View>

        {/* 消息气泡区域 */}
        <View style={{ maxWidth: "80%" }}>
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

          {item.dataType === "playlist" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.playlistContainer}
            >
              {item.data.map((music) => (
                <MusicCard
                  key={music.id}
                  variant="square-small"
                  title={music.title}
                  image={music.image}
                  style={{ marginRight: 10 }}
                  showTag={false}
                  onPress={() => console.log("Play generated list", music.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航 Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          {/* --- 更新：Header 标题和图标 --- */}
          <View style={styles.headerTitleContainer}>
            {/* 使用小号猫咪图标 */}
            <Image
              source={aiCatAvatar}
              style={{ width: 22, height: 22 }}
              resizeMode="contain"
              tintColor={THEME_BLUE}
            />
            <Text style={styles.headerTitle}>Music Meow</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                {/* --- 更新：Typing 提示文案 --- */}
                <Text style={styles.typingText}>Cat AI is thinking...</Text>
              </View>
            ) : null
          }
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask the music cat..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: inputText ? THEME_BLUE : "#333" },
              ]}
              onPress={handleSend}
              disabled={!inputText}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText ? "#000" : "#888"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  backButton: {
    width: 28,
    alignItems: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 20,
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  // AI 头像背景框
  aiAvatarBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(111, 189, 211, 0.15)", // 稍微调淡一点背景
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(111, 189, 211, 0.4)",
  },
  // --- 新增：猫咪图片样式 ---
  aiCatImage: {
    width: 24, // 控制图片大小，使其适应圆形背景
    height: 24,
  },
  bubble: {
    padding: 12,
    borderRadius: 18, // 稍微增加一点圆角
    marginBottom: 4,
  },
  aiBubble: {
    backgroundColor: "#2A2A2A",
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
  playlistContainer: {
    marginTop: 10,
    marginLeft: 0,
  },
  typingContainer: {
    paddingLeft: 60,
    paddingBottom: 20,
  },
  typingText: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#151515",
  },
  input: {
    flex: 1,
    backgroundColor: "#252525",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 15,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
