/**
 * 音乐数据库 - 带有详细标签的曲库
 * 
 * 标签系统设计：
 * - mood: 情绪标签 (relaxing, energetic, melancholic, happy, romantic, nostalgic, peaceful, intense)
 * - scene: 场景标签 (commute, workout, study, sleep, party, cafe, rain, night, morning, driving)
 * - genre: 流派标签 (pop, rock, jazz, classical, electronic, r&b, hip-hop, folk, city-pop, ballad)
 * - era: 年代标签 (80s, 90s, 2000s, 2010s, 2020s, retro, modern)
 * - language: 语言标签 (mandarin, cantonese, english, japanese, korean)
 * - tempo: 节奏标签 (slow, medium, fast)
 * - vibe: 氛围标签 (chill, upbeat, dreamy, groovy, soulful, acoustic, electronic)
 */

// 导入图片资源
const albumImage1 = require("../assets/album1.png");
const albumImage2 = require("../assets/album2.png");
const albumImage3 = require("../assets/album3.png");
const heroImage1 = require("../assets/hero1.png");
const heroImage2 = require("../assets/hero2.png");
const artistImage1 = require("../assets/artist1.png");
const artistImage2 = require("../assets/artist2.png");
const artistImage3 = require("../assets/artist3.png");

// 完整的歌曲数据库
export const MUSIC_DATABASE = [
  // ===== 陶喆 =====
  {
    id: "tao-001",
    title: "望春风",
    artist: "陶喆",
    album: "太美丽",
    duration: 242,
    image: albumImage1,
    tags: {
      mood: ["nostalgic", "romantic", "peaceful"],
      scene: ["night", "cafe", "rain"],
      genre: ["r&b", "ballad", "pop"],
      era: ["2000s", "retro"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["soulful", "dreamy"],
    },
  },
  {
    id: "tao-002",
    title: "爱很简单",
    artist: "陶喆",
    album: "I'm OK",
    duration: 298,
    image: albumImage1,
    tags: {
      mood: ["romantic", "happy", "peaceful"],
      scene: ["night", "driving", "cafe"],
      genre: ["r&b", "ballad"],
      era: ["90s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["soulful", "acoustic"],
    },
  },
  {
    id: "tao-003",
    title: "Susan说",
    artist: "陶喆",
    album: "太平盛世",
    duration: 276,
    image: albumImage1,
    tags: {
      mood: ["melancholic", "nostalgic"],
      scene: ["night", "commute", "rain"],
      genre: ["r&b", "pop"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["soulful", "groovy"],
    },
  },
  {
    id: "tao-004",
    title: "找自己",
    artist: "陶喆",
    album: "陶喆同名专辑",
    duration: 265,
    image: albumImage1,
    tags: {
      mood: ["energetic", "happy", "intense"],
      scene: ["workout", "driving", "morning"],
      genre: ["rock", "r&b"],
      era: ["90s"],
      language: ["mandarin"],
      tempo: ["fast"],
      vibe: ["upbeat", "groovy"],
    },
  },

  // ===== 方大同 =====
  {
    id: "fang-001",
    title: "爱爱爱",
    artist: "方大同",
    album: "未来",
    duration: 234,
    image: albumImage2,
    tags: {
      mood: ["happy", "romantic", "peaceful"],
      scene: ["cafe", "morning", "commute"],
      genre: ["r&b", "soul", "pop"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["soulful", "groovy", "chill"],
    },
  },
  {
    id: "fang-002",
    title: "三人游",
    artist: "方大同",
    album: "橙月",
    duration: 287,
    image: albumImage2,
    tags: {
      mood: ["melancholic", "nostalgic", "romantic"],
      scene: ["night", "rain", "commute"],
      genre: ["r&b", "ballad"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["soulful", "dreamy"],
    },
  },
  {
    id: "fang-003",
    title: "红豆",
    artist: "方大同",
    album: "未来",
    duration: 312,
    image: albumImage2,
    tags: {
      mood: ["melancholic", "nostalgic", "peaceful"],
      scene: ["night", "rain", "cafe"],
      genre: ["r&b", "ballad"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["soulful", "acoustic"],
    },
  },
  {
    id: "fang-004",
    title: "特别的人",
    artist: "方大同",
    album: "危险世界",
    duration: 256,
    image: albumImage2,
    tags: {
      mood: ["romantic", "happy"],
      scene: ["cafe", "driving"],
      genre: ["r&b", "pop"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["groovy", "chill"],
    },
  },

  // ===== 王力宏 =====
  {
    id: "wang-001",
    title: "唯一",
    artist: "王力宏",
    album: "唯一",
    duration: 289,
    image: albumImage3,
    tags: {
      mood: ["romantic", "nostalgic", "peaceful"],
      scene: ["night", "cafe"],
      genre: ["r&b", "ballad", "pop"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["soulful", "dreamy"],
    },
  },
  {
    id: "wang-002",
    title: "你不知道的事",
    artist: "王力宏",
    album: "十八般武艺",
    duration: 276,
    image: albumImage3,
    tags: {
      mood: ["romantic", "melancholic", "peaceful"],
      scene: ["night", "rain"],
      genre: ["ballad", "pop"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["dreamy", "acoustic"],
    },
  },
  {
    id: "wang-003",
    title: "盖世英雄",
    artist: "王力宏",
    album: "盖世英雄",
    duration: 245,
    image: albumImage3,
    tags: {
      mood: ["energetic", "happy", "intense"],
      scene: ["workout", "party", "driving"],
      genre: ["hip-hop", "pop", "electronic"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["fast"],
      vibe: ["upbeat", "electronic"],
    },
  },
  {
    id: "wang-004",
    title: "落叶归根",
    artist: "王力宏",
    album: "盖世英雄",
    duration: 298,
    image: albumImage3,
    tags: {
      mood: ["nostalgic", "peaceful", "melancholic"],
      scene: ["commute", "night"],
      genre: ["hip-hop", "r&b"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["soulful", "groovy"],
    },
  },

  // ===== 陈奕迅 =====
  {
    id: "eason-001",
    title: "孤独患者",
    artist: "陈奕迅",
    album: "?",
    duration: 267,
    image: heroImage1,
    tags: {
      mood: ["melancholic", "nostalgic", "intense"],
      scene: ["night", "commute", "rain"],
      genre: ["rock", "pop"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["acoustic", "dreamy"],
    },
  },
  {
    id: "eason-002",
    title: "十年",
    artist: "陈奕迅",
    album: "黑白灰",
    duration: 312,
    image: heroImage1,
    tags: {
      mood: ["melancholic", "nostalgic", "romantic"],
      scene: ["night", "rain", "cafe"],
      genre: ["ballad", "pop"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["acoustic", "dreamy"],
    },
  },
  {
    id: "eason-003",
    title: "浮夸",
    artist: "陈奕迅",
    album: "U87",
    duration: 298,
    image: heroImage1,
    tags: {
      mood: ["intense", "melancholic", "energetic"],
      scene: ["night", "driving"],
      genre: ["rock", "pop"],
      era: ["2000s"],
      language: ["cantonese"],
      tempo: ["fast"],
      vibe: ["upbeat", "acoustic"],
    },
  },
  {
    id: "eason-004",
    title: "富士山下",
    artist: "陈奕迅",
    album: "What's Going On...?",
    duration: 287,
    image: heroImage1,
    tags: {
      mood: ["melancholic", "romantic", "peaceful"],
      scene: ["night", "cafe", "rain"],
      genre: ["ballad", "pop"],
      era: ["2000s"],
      language: ["cantonese"],
      tempo: ["slow"],
      vibe: ["dreamy", "acoustic"],
    },
  },

  // ===== City Pop / 日系 =====
  {
    id: "citypop-001",
    title: "Plastic Love",
    artist: "竹内まりや",
    album: "Variety",
    duration: 289,
    image: heroImage2,
    tags: {
      mood: ["nostalgic", "happy", "romantic"],
      scene: ["night", "driving", "party"],
      genre: ["city-pop", "pop"],
      era: ["80s", "retro"],
      language: ["japanese"],
      tempo: ["medium"],
      vibe: ["groovy", "dreamy", "electronic"],
    },
  },
  {
    id: "citypop-002",
    title: "Stay With Me",
    artist: "真夜中のドア",
    album: "Miki Matsubara",
    duration: 267,
    image: heroImage2,
    tags: {
      mood: ["nostalgic", "romantic", "melancholic"],
      scene: ["night", "driving", "cafe"],
      genre: ["city-pop", "pop"],
      era: ["80s", "retro"],
      language: ["japanese"],
      tempo: ["medium"],
      vibe: ["groovy", "dreamy"],
    },
  },
  {
    id: "citypop-003",
    title: "夜に駆ける",
    artist: "YOASOBI",
    album: "THE BOOK",
    duration: 254,
    image: heroImage2,
    tags: {
      mood: ["energetic", "melancholic", "intense"],
      scene: ["night", "commute", "workout"],
      genre: ["pop", "electronic"],
      era: ["2020s", "modern"],
      language: ["japanese"],
      tempo: ["fast"],
      vibe: ["upbeat", "electronic"],
    },
  },
  {
    id: "citypop-004",
    title: "Ride on Time",
    artist: "山下達郎",
    album: "Ride on Time",
    duration: 312,
    image: heroImage2,
    tags: {
      mood: ["happy", "energetic", "nostalgic"],
      scene: ["morning", "driving", "workout"],
      genre: ["city-pop", "pop", "funk"],
      era: ["80s", "retro"],
      language: ["japanese"],
      tempo: ["fast"],
      vibe: ["groovy", "upbeat"],
    },
  },

  // ===== 轻松/治愈系 =====
  {
    id: "chill-001",
    title: "小幸运",
    artist: "田馥甄",
    album: "我的少女时代",
    duration: 287,
    image: artistImage1,
    tags: {
      mood: ["happy", "romantic", "peaceful"],
      scene: ["morning", "cafe", "commute"],
      genre: ["pop", "ballad"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["acoustic", "dreamy"],
    },
  },
  {
    id: "chill-002",
    title: "晴天",
    artist: "周杰伦",
    album: "叶惠美",
    duration: 269,
    image: artistImage2,
    tags: {
      mood: ["nostalgic", "romantic", "happy"],
      scene: ["morning", "driving", "cafe"],
      genre: ["pop", "r&b"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["acoustic", "dreamy"],
    },
  },
  {
    id: "chill-003",
    title: "安静",
    artist: "周杰伦",
    album: "范特西",
    duration: 298,
    image: artistImage2,
    tags: {
      mood: ["melancholic", "peaceful", "romantic"],
      scene: ["night", "rain", "study"],
      genre: ["ballad", "pop"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["acoustic", "dreamy"],
    },
  },
  {
    id: "chill-004",
    title: "稻香",
    artist: "周杰伦",
    album: "魔杰座",
    duration: 234,
    image: artistImage2,
    tags: {
      mood: ["happy", "peaceful", "nostalgic"],
      scene: ["morning", "driving", "commute"],
      genre: ["pop", "folk"],
      era: ["2000s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["acoustic", "chill"],
    },
  },

  // ===== 电子/派对 =====
  {
    id: "edm-001",
    title: "Faded",
    artist: "Alan Walker",
    album: "Different World",
    duration: 212,
    image: artistImage3,
    tags: {
      mood: ["melancholic", "intense", "energetic"],
      scene: ["workout", "party", "night"],
      genre: ["electronic", "edm"],
      era: ["2010s", "modern"],
      language: ["english"],
      tempo: ["fast"],
      vibe: ["electronic", "dreamy"],
    },
  },
  {
    id: "edm-002",
    title: "Closer",
    artist: "The Chainsmokers",
    album: "Collage",
    duration: 245,
    image: artistImage3,
    tags: {
      mood: ["romantic", "happy", "energetic"],
      scene: ["party", "driving", "workout"],
      genre: ["electronic", "pop"],
      era: ["2010s", "modern"],
      language: ["english"],
      tempo: ["medium"],
      vibe: ["electronic", "upbeat"],
    },
  },

  // ===== 纯音乐/学习 =====
  {
    id: "inst-001",
    title: "River Flows in You",
    artist: "Yiruma",
    album: "First Love",
    duration: 187,
    image: albumImage1,
    tags: {
      mood: ["peaceful", "romantic", "melancholic"],
      scene: ["study", "sleep", "cafe", "rain"],
      genre: ["classical", "instrumental"],
      era: ["2000s"],
      language: ["instrumental"],
      tempo: ["slow"],
      vibe: ["acoustic", "dreamy", "chill"],
    },
  },
  {
    id: "inst-002",
    title: "Canon in D",
    artist: "Pachelbel",
    album: "Classical Favorites",
    duration: 312,
    image: albumImage1,
    tags: {
      mood: ["peaceful", "happy", "romantic"],
      scene: ["study", "cafe", "morning"],
      genre: ["classical", "instrumental"],
      era: ["retro"],
      language: ["instrumental"],
      tempo: ["slow"],
      vibe: ["acoustic", "dreamy"],
    },
  },

  // ===== 更多华语流行 =====
  {
    id: "cpop-001",
    title: "光年之外",
    artist: "邓紫棋",
    album: "光年之外",
    duration: 256,
    image: heroImage1,
    tags: {
      mood: ["romantic", "intense", "melancholic"],
      scene: ["night", "driving"],
      genre: ["pop", "ballad"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["medium"],
      vibe: ["dreamy", "electronic"],
    },
  },
  {
    id: "cpop-002",
    title: "泡沫",
    artist: "邓紫棋",
    album: "Xposed",
    duration: 278,
    image: heroImage1,
    tags: {
      mood: ["melancholic", "romantic", "intense"],
      scene: ["night", "rain"],
      genre: ["ballad", "pop"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["acoustic", "dreamy"],
    },
  },
  {
    id: "cpop-003",
    title: "演员",
    artist: "薛之谦",
    album: "绅士",
    duration: 287,
    image: artistImage1,
    tags: {
      mood: ["melancholic", "romantic", "nostalgic"],
      scene: ["night", "rain", "cafe"],
      genre: ["ballad", "pop"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["acoustic", "dreamy"],
    },
  },
  {
    id: "cpop-004",
    title: "绅士",
    artist: "薛之谦",
    album: "绅士",
    duration: 265,
    image: artistImage1,
    tags: {
      mood: ["melancholic", "romantic"],
      scene: ["night", "cafe"],
      genre: ["ballad", "pop"],
      era: ["2010s"],
      language: ["mandarin"],
      tempo: ["slow"],
      vibe: ["acoustic"],
    },
  },
];

// 标签中英文映射（用于显示和搜索）
export const TAG_LABELS = {
  // 情绪
  relaxing: { zh: "放松", en: "Relaxing" },
  energetic: { zh: "活力", en: "Energetic" },
  melancholic: { zh: "忧郁", en: "Melancholic" },
  happy: { zh: "开心", en: "Happy" },
  romantic: { zh: "浪漫", en: "Romantic" },
  nostalgic: { zh: "怀旧", en: "Nostalgic" },
  peaceful: { zh: "平静", en: "Peaceful" },
  intense: { zh: "激烈", en: "Intense" },

  // 场景
  commute: { zh: "通勤", en: "Commute" },
  subway: { zh: "地铁", en: "Subway" },
  workout: { zh: "运动", en: "Workout" },
  study: { zh: "学习", en: "Study" },
  sleep: { zh: "睡眠", en: "Sleep" },
  party: { zh: "派对", en: "Party" },
  cafe: { zh: "咖啡厅", en: "Cafe" },
  rain: { zh: "雨天", en: "Rainy Day" },
  night: { zh: "夜晚", en: "Night" },
  morning: { zh: "早晨", en: "Morning" },
  driving: { zh: "开车", en: "Driving" },
  friday: { zh: "周五", en: "Friday" },
  weekend: { zh: "周末", en: "Weekend" },

  // 流派
  pop: { zh: "流行", en: "Pop" },
  rock: { zh: "摇滚", en: "Rock" },
  jazz: { zh: "爵士", en: "Jazz" },
  classical: { zh: "古典", en: "Classical" },
  electronic: { zh: "电子", en: "Electronic" },
  "r&b": { zh: "R&B", en: "R&B" },
  "hip-hop": { zh: "嘻哈", en: "Hip-Hop" },
  folk: { zh: "民谣", en: "Folk" },
  "city-pop": { zh: "城市流行", en: "City Pop" },
  ballad: { zh: "抒情", en: "Ballad" },
  soul: { zh: "灵魂乐", en: "Soul" },
  funk: { zh: "放克", en: "Funk" },
  edm: { zh: "电子舞曲", en: "EDM" },
  instrumental: { zh: "纯音乐", en: "Instrumental" },

  // 年代
  "80s": { zh: "80年代", en: "80s" },
  "90s": { zh: "90年代", en: "90s" },
  "2000s": { zh: "2000年代", en: "2000s" },
  "2010s": { zh: "2010年代", en: "2010s" },
  "2020s": { zh: "2020年代", en: "2020s" },
  retro: { zh: "复古", en: "Retro" },
  modern: { zh: "现代", en: "Modern" },

  // 语言
  mandarin: { zh: "国语", en: "Mandarin" },
  cantonese: { zh: "粤语", en: "Cantonese" },
  english: { zh: "英语", en: "English" },
  japanese: { zh: "日语", en: "Japanese" },
  korean: { zh: "韩语", en: "Korean" },

  // 节奏
  slow: { zh: "慢速", en: "Slow" },
  medium: { zh: "中速", en: "Medium" },
  fast: { zh: "快速", en: "Fast" },

  // 氛围
  chill: { zh: "慵懒", en: "Chill" },
  upbeat: { zh: "欢快", en: "Upbeat" },
  dreamy: { zh: "梦幻", en: "Dreamy" },
  groovy: { zh: "律动", en: "Groovy" },
  soulful: { zh: "有灵魂", en: "Soulful" },
  acoustic: { zh: "原声", en: "Acoustic" },
};

// 获取所有可用标签
export const getAllTags = () => {
  const allTags = new Set();
  MUSIC_DATABASE.forEach((song) => {
    Object.values(song.tags).forEach((tagArray) => {
      tagArray.forEach((tag) => allTags.add(tag));
    });
  });
  return Array.from(allTags);
};

// 根据标签获取歌曲
export const getSongsByTags = (tags, matchMode = "any") => {
  if (!tags || tags.length === 0) return MUSIC_DATABASE;

  return MUSIC_DATABASE.filter((song) => {
    const songTags = Object.values(song.tags).flat();

    if (matchMode === "all") {
      // 所有标签都要匹配
      return tags.every((tag) =>
        songTags.some((st) => st.toLowerCase() === tag.toLowerCase())
      );
    } else {
      // 任意标签匹配
      return tags.some((tag) =>
        songTags.some((st) => st.toLowerCase() === tag.toLowerCase())
      );
    }
  });
};

// 根据标签获取歌曲（带权重评分）
export const getSongsByTagsWithScore = (tags) => {
  if (!tags || tags.length === 0) return [];

  const scoredSongs = MUSIC_DATABASE.map((song) => {
    const songTags = Object.values(song.tags).flat();
    let score = 0;

    tags.forEach((tag) => {
      if (songTags.some((st) => st.toLowerCase() === tag.toLowerCase())) {
        score += 1;
      }
    });

    return { ...song, matchScore: score };
  });

  return scoredSongs
    .filter((song) => song.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};

export default MUSIC_DATABASE;
