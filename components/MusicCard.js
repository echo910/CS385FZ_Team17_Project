import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * MusicCard Component
 * 
 * 支持多种 variants 的音乐卡片组件
 * 
 * @param {Object} props
 * @param {string} props.title - 卡片标题
 * @param {string} props.subtitle - 卡片副标题
 * @param {string|number} props.image - 图片资源（可以是 require() 导入的本地图片或网络 URL）
 * @param {string} props.variant - 卡片变体: 'hero' | 'square-large' | 'square-small' | 'album' | 'circle'
 * @param {string} props.color - 背景颜色（仅 hero variant）
 * @param {string} props.tagColor - 标签颜色（仅 square variants）
 * @param {boolean} props.showTag - 是否显示标签线
 * @param {Function} props.onPress - 点击回调函数
 * @param {ViewStyle} props.style - 自定义样式
 * @param {ImageStyle} props.imageStyle - 自定义图片样式
 * @param {TextStyle} props.titleStyle - 自定义标题样式
 * @param {TextStyle} props.subtitleStyle - 自定义副标题样式
 */
export default function MusicCard({
  title,
  subtitle,
  image,
  variant = "square-large",
  color,
  tagColor = "#FFB6C1",
  showTag = true,
  onPress,
  style,
  imageStyle,
  titleStyle,
  subtitleStyle,
}) {
  const renderContent = () => {
    switch (variant) {
      case "hero":
        return (
          <View style={[styles.heroCard, style]}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={[styles.heroImage, imageStyle]}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <Text style={[styles.heroTitle, titleStyle]}>{title}</Text>
            <View style={[styles.heroFooter, { backgroundColor: color || "#000" }]}>
              <Text style={[styles.heroSubtitle, subtitleStyle]}>
                {subtitle}
              </Text>
            </View>
          </View>
        );

      case "square-large":
        return (
          <View style={[styles.squareCardLarge, style]}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={[styles.squareImageLarge, imageStyle]}
            />
            <View style={styles.albumTextOverlay}>
              {showTag && (
                <View style={[styles.tagLine, { backgroundColor: tagColor }]} />
              )}
              <Text
                style={[styles.albumTitleOverlay, titleStyle]}
                numberOfLines={2}
              >
                {title}
              </Text>
            </View>
          </View>
        );

      case "square-small":
        return (
          <View style={[styles.squareCardSmall, style]}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={[styles.squareImageSmall, imageStyle]}
            />
            <View style={styles.smallOverlay}>
              {showTag && <View style={styles.tagLineSmall} />}
              <Text
                style={[styles.smallTitle, titleStyle]}
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>
          </View>
        );

      case "album":
        return (
          <View style={[styles.albumCard, style]}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={[styles.albumImage, imageStyle]}
            />
            <Text style={[styles.albumName, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[styles.artistName, subtitleStyle]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        );

      case "circle":
        return (
          <View style={[styles.circleCard, style]}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={[styles.circleImage, imageStyle]}
            />
            <Text style={[styles.circleName, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
}

const styles = StyleSheet.create({
  // Hero Card
  heroCard: {
    width: 160,
    height: 200,
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 160,
    height: 160, // 正方形：160x160
    opacity: 0.6,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 160,
    height: 160, // 覆盖正方形图片区域
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    zIndex: 2,
  },
  heroFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.85)", // 纯色背景，不透明
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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

  // Album Card
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

  // Circle Card
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
});

