import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const THEME_BLUE = "#6FBDD3";

// 猫咪 Logo 组件
function CatLogo({ size = 120 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 132 132">
      <Circle cx="66" cy="66" r="66" fill={THEME_BLUE} />
      <Path
        d="M35 94V47.5c0-5 6.5-15 11-15 3 0 3 7.5 4.5 9.5 1.5 2 4.5 0 6.5 0 3 0 6 5 7.5 5s4.5-6 7.5-6 6 12.5 6 17.5S68 90 66 94"
        fill="none"
        stroke="#fff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M66 94c-2-4-9.5-13.5-15.5-13.5-6 0-6 7-3.5 10.5 2.5 3.5 10.5 10 13.5 10 3 0 5-4.5 5-7Z"
        fill="none"
        stroke="#fff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="50" cy="55" r="4" fill="#fff" />
      <Circle cx="66" cy="60" r="4" fill="#fff" />
      <Path
        d="M97 60c0-4-2-8-5-10-4-3-10 0-13 5-3 5-10.5 17.5-10.5 17.5"
        fill="none"
        stroke="#fff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo 动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 文字动画（延迟）
    setTimeout(() => {
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // 进度条动画
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // 完成后回调
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onFinish?.();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* 背景装饰 */}
      <View style={styles.backgroundDecor}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <CatLogo size={140} />
      </Animated.View>

      {/* 应用名称 */}
      <Animated.View
        style={[
          styles.textContainer,
          { opacity: textFadeAnim },
        ]}
      >
        <Text style={styles.appName}>Cat Music</Text>
        <Text style={styles.tagline}>AI 智能音乐播放器</Text>
      </Animated.View>

      {/* 加载进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progressWidth },
            ]}
          />
        </View>
        <Animated.Text style={[styles.loadingText, { opacity: textFadeAnim }]}>
          正在加载...
        </Animated.Text>
      </View>

      {/* 底部信息 */}
      <Animated.View style={[styles.footer, { opacity: textFadeAnim }]}>
        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <Ionicons name="sparkles" size={16} color={THEME_BLUE} />
            <Text style={styles.featureText}>AI 推荐</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <Ionicons name="musical-notes" size={16} color={THEME_BLUE} />
            <Text style={styles.featureText}>智能歌单</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <Ionicons name="heart" size={16} color={THEME_BLUE} />
            <Text style={styles.featureText}>个性化</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: THEME_BLUE,
    opacity: 0.05,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    bottom: -50,
    right: 50,
  },
  logoContainer: {
    marginBottom: 30,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#888",
    letterSpacing: 1,
  },
  progressContainer: {
    width: width * 0.6,
    alignItems: "center",
  },
  progressBg: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: THEME_BLUE,
    borderRadius: 1.5,
  },
  loadingText: {
    color: "#666",
    fontSize: 12,
    marginTop: 12,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    color: "#888",
    fontSize: 12,
  },
  featureDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#444",
    marginHorizontal: 12,
  },
});
