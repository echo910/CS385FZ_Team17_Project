/**
 * MusicCard Component 使用示例
 * 
 * 展示所有支持的 variants 和 props
 */

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import MusicCard from "./MusicCard";

export default function MusicCardExamples() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Variant */}
      <View style={styles.section}>
        <MusicCard
          variant="hero"
          title="Heartbeat Radar"
          subtitle="Fresh songs\nthat suit your taste"
          image="https://i.pravatar.cc/300?img=12"
          color="#8FB8B4"
          onPress={() => console.log("Hero card pressed")}
        />
      </View>

      {/* Square Large Variant */}
      <View style={styles.section}>
        <MusicCard
          variant="square-large"
          title="陳奕迅合輯"
          image="https://i.pravatar.cc/300?img=59"
          tagColor="#FFB6C1"
          showTag={true}
          onPress={() => console.log("Square large pressed")}
        />
        <MusicCard
          variant="square-large"
          title="YELLOW黃宣"
          image="https://i.pravatar.cc/300?img=53"
          tagColor="#FFD700"
          showTag={true}
          onPress={() => console.log("Square large pressed")}
        />
      </View>

      {/* Square Small Variant */}
      <View style={styles.section}>
        <MusicCard
          variant="square-small"
          title="方大同合輯"
          image="https://i.pravatar.cc/300?img=15"
          showTag={true}
          onPress={() => console.log("Square small pressed")}
        />
      </View>

      {/* Album Variant */}
      <View style={styles.section}>
        <MusicCard
          variant="album"
          title="唯一"
          subtitle="Album · 王力宏"
          image="https://i.pravatar.cc/300?img=10"
          onPress={() => console.log("Album pressed")}
        />
      </View>

      {/* Circle Variant */}
      <View style={styles.section}>
        <MusicCard
          variant="circle"
          title="告五人"
          image="https://i.pravatar.cc/300?img=30"
          onPress={() => console.log("Circle pressed")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    padding: 20,
  },
  section: {
    marginBottom: 30,
    flexDirection: "row",
  },
});



