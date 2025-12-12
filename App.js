import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MusicCard from "./components/MusicCard";
import AIAssistantIcon from "./components/AIAssistantIcon";
import PlayerScreen from "./screens/PlayerScreen";
import SearchScreen from "./screens/SearchScreen";
import MyScreen from "./screens/MyScreen";
import MyHomeScreen from "./screens/MyHomeScreen";
import AIAssistantScreen from "./screens/AIAssistantScreen";

// 从 assets 导入图片
// Hero Cards 图片（正方形）
const heroImage1 = require("./assets/hero1.png"); // 光头艺术家
const heroImage2 = require("./assets/hero2.png"); // 白色毛衣艺术家
const heroImage3 = require("./assets/hero3.png"); // 粉色插画人物

// Album 图片
const albumImage1 = require("./assets/album1.png"); // 方大同专辑
const albumImage2 = require("./assets/album2.png"); // 王力宏专辑
const albumImage3 = require("./assets/album3.png"); // 其他专辑

// Artist 图片
const artistImage1 = require("./assets/artist1.png");
const artistImage2 = require("./assets/artist2.png");
const artistImage3 = require("./assets/artist3.png");

// --- 模拟数据 (Data Mock) - 使用本地 assets 图片 ---
const HERO_CARDS = [
  {
    id: 1,
    title: "Heartbeat Radar",
    subtitle: "Fresh songs\nthat suit your taste",
    image: heroImage1,
    color: "#8FB8B4",
  },
  {
    id: 2,
    title: "Similar Artists",
    subtitle: "Starting from\na favorite artist",
    image: heroImage2,
    color: "#F29F9F",
  },
  {
    id: 3,
    title: "Daily Mix",
    subtitle: "Made for you",
    image: heroImage3,
    color: "#9F9FF2",
  },
];

const GUESS_LIKE = [
  {
    id: 1,
    title: "陳奕迅合輯",
    artist: "Eason Chan",
    image: albumImage1, // 方大同专辑
  },
  {
    id: 2,
    title: "YELLOW黃宣",
    artist: "合輯",
    image: albumImage2, // 王力宏专辑
  },
  {
    id: 3,
    title: "虚构列表",
    artist: "未知艺术家",
    image: albumImage3,
  },
];

const PLAYED_RECENTLY = [
  { id: 1, title: "方大同合輯", image: albumImage1 },
  { id: 2, title: "陳奕迅合輯", image: albumImage2 },
];

const REC_ARTIST_SECTION = {
  recommender: { name: "卢广仲", avatar: artistImage1 },
  albums: [
    {
      id: 1,
      title: "唯一",
      subtitle: "Album · 王力宏",
      image: albumImage2, // 王力宏专辑
    },
    {
      id: 2,
      title: "告五人",
      subtitle: "Band",
      image: albumImage1, // 方大同专辑
    },
    {
      id: 3,
      title: "橙月",
      subtitle: "Album · 方大同",
      image: albumImage1, // 方大同专辑
    },
  ],
};

const REC_ARTISTS_CIRCLE = [
  { id: 1, name: "告五人", image: artistImage1 },
  { id: 2, name: "告五人", image: artistImage2 },
  { id: 3, name: "落日飞车", image: artistImage3 },
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTab, setCurrentTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    // 上一首逻辑
  };

  const handleNext = () => {
    // 下一首逻辑
  };

  if (showPlayer) {
    return (
      <PlayerScreen
        onClose={() => setShowPlayer(false)}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {currentTab === "home" && (
          <>
            {/* 顶部 Header */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Good Morning ~</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={styles.headerIconButton}
                  onPress={() => setShowAI(true)}
                >
                  <AIAssistantIcon size={30} color="#6FBDD3" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconButton}>
                  <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 主滚动区域 */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 1. Hero Cards */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {HERO_CARDS.map((item) => (
                  <MusicCard
                    key={item.id}
                    variant="hero"
                    title={item.title}
                    subtitle={item.subtitle}
                    image={item.image}
                    color={item.color}
                  />
                ))}
              </ScrollView>

              {/* 2. Guess You Like */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Guess You Like</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {GUESS_LIKE.map((item) => (
                  <MusicCard
                    key={item.id}
                    variant="square-large"
                    title={item.title}
                    image={item.image}
                    tagColor={item.id === 2 ? "#FFD700" : "#FFB6C1"}
                    showTag={true}
                  />
                ))}
              </ScrollView>

              {/* 3. Played Recently */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Played Recently</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {PLAYED_RECENTLY.map((item) => (
                  <MusicCard
                    key={item.id}
                    variant="square-small"
                    title={item.title}
                    image={item.image}
                    showTag={true}
                  />
                ))}
              </ScrollView>

              {/* 4. Recommendation Section */}
              <View style={styles.recommenderContainer}>
                <Image
                  source={REC_ARTIST_SECTION.recommender.avatar}
                  style={styles.recommenderAvatar}
                />
                <View>
                  <Text style={styles.recommenderLabel}>
                    According to the recommendation
                  </Text>
                  <Text style={styles.recommenderName}>
                    {REC_ARTIST_SECTION.recommender.name}
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {REC_ARTIST_SECTION.albums.map((item) => (
                  <MusicCard
                    key={item.id}
                    variant="album"
                    title={item.title}
                    subtitle={item.subtitle}
                    image={item.image}
                  />
                ))}
              </ScrollView>

              {/* 5. Recommended Artists */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended Artists</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionScroll}
              >
                {REC_ARTISTS_CIRCLE.map((item, index) => (
                  <MusicCard
                    key={index}
                    variant="circle"
                    title={item.name}
                    image={item.image}
                  />
                ))}
              </ScrollView>

              {/* 底部垫高，防止被播放器遮挡 */}
              <View style={{ height: 140 }} />
            </ScrollView>
          </>
        )}
        {currentTab === "search" && <SearchScreen />}
        {currentTab === "my" &&
          (isLoggedIn ? (
            <MyHomeScreen onLogout={() => setIsLoggedIn(false)} />
          ) : (
            <MyScreen onLogin={() => setIsLoggedIn(true)} />
          ))}
      </SafeAreaView>

      {/* 底部悬浮播放器 */}
      <TouchableOpacity
        style={styles.miniPlayerContainer}
        onPress={() => setShowPlayer(true)}
        activeOpacity={0.8}
      >
        <View style={styles.miniPlayerContent}>
          <Image source={artistImage1} style={styles.miniArt} />
          <View style={styles.miniInfo}>
            <Text style={styles.miniTitle}>望春风</Text>
            <Text style={styles.miniArtist}>陶喆</Text>
          </View>
          <View style={styles.miniControls}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="play-skip-forward-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
            >
              <View style={styles.playButtonCircle}>
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={18}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* 底部导航栏 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab("home")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="home"
            size={26}
            color={currentTab === "home" ? "#87CEEB" : "#888"}
          />
          <Text
            style={[
              styles.navText,
              { color: currentTab === "home" ? "#87CEEB" : "#888" },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab("search")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="search-outline"
            size={26}
            color={currentTab === "search" ? "#6fbdd3" : "#888"}
          />
          <Text
            style={[
              styles.navText,
              { color: currentTab === "search" ? "#6fbdd3" : "#888" },
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab("my")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="person-outline"
            size={26}
            color={currentTab === "my" ? "#87CEEB" : "#888"}
          />
          <Text
            style={[
              styles.navText,
              { color: currentTab === "my" ? "#87CEEB" : "#888" },
            ]}
          >
            My
          </Text>
        </TouchableOpacity>
      </View>

      {/* AI 助手 Modal */}
      <Modal
        visible={showAI}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAI(false)}
      >
        <AIAssistantScreen onClose={() => setShowAI(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionScroll: {
    paddingLeft: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  // Hero Cards
  heroCard: {
    width: 160,
    height: 200,
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
    position: "relative",
    padding: 12,
    justifyContent: "space-between",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heroFooter: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 8,
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  // Square Large
  squareCardLarge: {
    width: 140,
    height: 140,
    marginRight: 15,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  squareImageLarge: {
    width: "100%",
    height: "100%",
  },
  albumTextOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  tagLine: {
    width: 4,
    height: 15,
    marginBottom: 4,
  },
  albumTitleOverlay: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  // Square Small
  squareCardSmall: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 4,
    overflow: "hidden",
  },
  squareImageSmall: {
    width: "100%",
    height: "100%",
  },
  smallOverlay: {
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  tagLineSmall: {
    width: 3,
    height: 10,
    backgroundColor: "#FF7F50",
    marginBottom: 2,
  },
  smallTitle: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Recommender
  recommenderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  recommenderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  recommenderLabel: {
    color: "#888",
    fontSize: 12,
  },
  recommenderName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  // Album Card Vertical Text
  albumCard: {
    width: 120,
    marginRight: 15,
  },
  albumImage: {
    width: 120,
    height: 120,
    borderRadius: 4,
  },
  albumName: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
  },
  artistName: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  // Circle Artists
  circleCard: {
    alignItems: "center",
    marginRight: 20,
    width: 110,
  },
  circleImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },
  circleName: {
    color: "#fff",
    fontSize: 14,
  },
  // Mini Player
  miniPlayerContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "#001f3f",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  miniPlayerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  miniArt: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  miniInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  miniArtist: {
    color: "#aaa",
    fontSize: 12,
  },
  miniControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButtonCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  // Bottom Nav
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#1C1C1C",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: "#888",
  },
});


