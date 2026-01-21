/**
 * AI 服务层 - 自然语言处理与标签提取
 * 
 * 支持两种模式：
 * 1. 本地关键词匹配（离线模式）
 * 2. SiliconFlow LLM API（在线模式，国内可用，免费）
 */

import { TAG_LABELS } from "../data/musicDatabase";

// ============================================
// 配置区域 - SiliconFlow API
// ============================================
const AI_CONFIG = {
  // 设置为 true 启用在线 AI，false 使用本地匹配
  useOnlineAI: true,
  
  // SiliconFlow API Key (你的密钥)
  apiKey: "sk-nlgtqylojkbbetmlkwqfafkiraocamlgfnmavbjgngccipff",
  
  // API 端点
  apiEndpoint: "https://api.siliconflow.cn/v1/chat/completions",
  
  // 使用的模型 (SiliconFlow 免费模型)
  model: "Qwen/Qwen2.5-7B-Instruct", // 通义千问，免费且效果好
  // 其他可选: "deepseek-ai/DeepSeek-V2.5", "THUDM/glm-4-9b-chat"
};

// ============================================
// 在线 AI 处理 (SiliconFlow API)
// ============================================

const SYSTEM_PROMPT = `你是一个音乐推荐助手。用户会用自然语言描述他们想听的音乐。
你需要从用户的描述中提取关键标签，用于在音乐库中搜索匹配的歌曲。

可用的标签（请只使用这些标签）：

情绪(mood): relaxing, energetic, melancholic, happy, romantic, nostalgic, peaceful, intense
场景(scene): commute, workout, study, sleep, party, cafe, rain, night, morning, driving
流派(genre): pop, rock, jazz, classical, electronic, r&b, hip-hop, folk, city-pop, ballad, soul
年代(era): 80s, 90s, 2000s, 2010s, 2020s, retro, modern
节奏(tempo): slow, medium, fast
氛围(vibe): chill, upbeat, dreamy, groovy, soulful, acoustic

请严格按照以下 JSON 格式返回，不要添加任何其他内容：
{
  "tags": ["tag1", "tag2", "tag3"],
  "title": "歌单标题（中文，简短有创意）",
  "description": "简短描述（10字以内）"
}

示例：
用户: "周五下班在地铁上，又累又想放松"
返回: {"tags": ["relaxing", "commute", "peaceful", "chill", "night"], "title": "周五下班放松时刻", "description": "通勤 · 治愈 · 放松"}

用户: "80年代复古风格的City Pop"
返回: {"tags": ["city-pop", "80s", "retro", "groovy", "nostalgic"], "title": "霓虹City Pop", "description": "复古 · 80年代 · 律动"}`;

/**
 * 调用 SiliconFlow API 提取标签
 */
const extractTagsWithAI = async (input) => {
  try {
    console.log("🤖 正在调用 SiliconFlow AI...");
    
    const response = await fetch(AI_CONFIG.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("SiliconFlow API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("🤖 AI 返回:", content);

    if (!content) {
      return null;
    }

    // 解析 JSON 响应
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        tags: result.tags || [],
        title: result.title || "为你推荐",
        description: result.description || "",
        originalQuery: input,
        source: "siliconflow",
      };
    }

    return null;
  } catch (error) {
    console.warn("SiliconFlow API call failed:", error.message);
    return null;
  }
};

// ============================================
// 本地关键词匹配（离线备用方案）
// ============================================

// 关键词到标签的映射规则
const KEYWORD_TO_TAGS = {
  // ===== 情绪相关 =====
  放松: ["relaxing", "peaceful", "chill"],
  轻松: ["relaxing", "peaceful", "chill"],
  解压: ["relaxing", "peaceful"],
  累: ["relaxing", "peaceful", "slow"],
  疲惫: ["relaxing", "peaceful", "slow"],
  治愈: ["peaceful", "chill", "dreamy"],
  舒服: ["relaxing", "chill", "peaceful"],
  安静: ["peaceful", "slow", "acoustic"],
  平静: ["peaceful", "slow"],
  
  开心: ["happy", "upbeat", "energetic"],
  快乐: ["happy", "upbeat"],
  高兴: ["happy", "upbeat"],
  嗨: ["energetic", "upbeat", "party"],
  兴奋: ["energetic", "intense", "fast"],
  活力: ["energetic", "upbeat", "fast"],
  
  伤感: ["melancholic", "slow", "ballad"],
  难过: ["melancholic", "slow"],
  悲伤: ["melancholic", "slow", "ballad"],
  失恋: ["melancholic", "romantic", "ballad"],
  分手: ["melancholic", "romantic", "ballad"],
  想哭: ["melancholic", "slow"],
  
  浪漫: ["romantic", "dreamy", "slow"],
  甜蜜: ["romantic", "happy"],
  恋爱: ["romantic", "happy", "dreamy"],
  约会: ["romantic", "chill", "cafe"],
  
  怀旧: ["nostalgic", "retro"],
  回忆: ["nostalgic", "dreamy"],
  青春: ["nostalgic", "happy"],
  童年: ["nostalgic", "peaceful"],

  // ===== 场景相关 =====
  地铁: ["commute", "chill"],
  通勤: ["commute", "medium"],
  上班: ["commute", "morning"],
  下班: ["commute", "relaxing", "night"],
  公交: ["commute", "chill"],
  
  运动: ["workout", "energetic", "fast"],
  健身: ["workout", "energetic", "fast"],
  跑步: ["workout", "fast", "upbeat"],
  锻炼: ["workout", "energetic"],
  
  学习: ["study", "peaceful", "instrumental"],
  读书: ["study", "peaceful", "slow"],
  工作: ["study", "chill", "medium"],
  专注: ["study", "instrumental", "peaceful"],
  
  睡觉: ["sleep", "slow", "peaceful"],
  睡眠: ["sleep", "slow", "peaceful"],
  助眠: ["sleep", "slow", "peaceful", "instrumental"],
  晚安: ["sleep", "slow", "peaceful"],
  
  派对: ["party", "energetic", "fast"],
  聚会: ["party", "happy", "upbeat"],
  蹦迪: ["party", "electronic", "fast"],
  
  咖啡: ["cafe", "chill", "acoustic"],
  咖啡厅: ["cafe", "chill", "acoustic"],
  下午茶: ["cafe", "peaceful", "slow"],
  
  雨天: ["rain", "melancholic", "peaceful"],
  下雨: ["rain", "melancholic", "dreamy"],
  阴天: ["rain", "melancholic"],
  
  夜晚: ["night", "chill", "dreamy"],
  深夜: ["night", "slow", "peaceful"],
  凌晨: ["night", "slow", "melancholic"],
  晚上: ["night", "chill"],
  
  早晨: ["morning", "peaceful", "happy"],
  早上: ["morning", "peaceful"],
  起床: ["morning", "upbeat"],
  
  开车: ["driving", "medium", "groovy"],
  自驾: ["driving", "happy", "upbeat"],
  兜风: ["driving", "happy", "chill"],
  
  周五: ["friday", "relaxing", "happy"],
  周末: ["weekend", "chill", "happy"],
  假期: ["weekend", "relaxing", "happy"],

  // ===== 流派相关 =====
  流行: ["pop"],
  摇滚: ["rock", "energetic"],
  爵士: ["jazz", "chill", "groovy"],
  古典: ["classical", "peaceful", "instrumental"],
  电子: ["electronic", "energetic"],
  嘻哈: ["hip-hop", "groovy"],
  说唱: ["hip-hop", "fast"],
  民谣: ["folk", "acoustic"],
  抒情: ["ballad", "slow"],
  情歌: ["ballad", "romantic"],
  灵魂乐: ["soul", "soulful", "r&b"],
  "r&b": ["r&b", "soulful", "groovy"],
  rnb: ["r&b", "soulful"],
  
  // City Pop 特别处理
  citypop: ["city-pop", "80s", "retro", "groovy"],
  "city pop": ["city-pop", "80s", "retro", "groovy"],
  城市流行: ["city-pop", "80s", "retro"],
  日系: ["japanese", "city-pop"],
  
  纯音乐: ["instrumental", "peaceful"],
  钢琴: ["instrumental", "classical", "peaceful"],
  轻音乐: ["instrumental", "peaceful", "chill"],

  // ===== 年代相关 =====
  "80年代": ["80s", "retro"],
  "90年代": ["90s", "retro"],
  八十年代: ["80s", "retro"],
  九十年代: ["90s", "retro"],
  复古: ["retro", "nostalgic"],
  老歌: ["retro", "nostalgic"],
  经典: ["retro", "nostalgic"],
  新歌: ["modern", "2020s"],
  最新: ["modern", "2020s"],

  // ===== 语言相关 =====
  中文: ["mandarin"],
  国语: ["mandarin"],
  华语: ["mandarin"],
  粤语: ["cantonese"],
  广东话: ["cantonese"],
  英文: ["english"],
  英语: ["english"],
  日文: ["japanese"],
  日语: ["japanese"],
  韩文: ["korean"],
  韩语: ["korean"],

  // ===== 节奏相关 =====
  慢歌: ["slow", "ballad"],
  快歌: ["fast", "upbeat"],
  节奏感: ["groovy", "medium"],
  律动: ["groovy", "medium"],

  // ===== 氛围相关 =====
  慵懒: ["chill", "slow"],
  欢快: ["upbeat", "happy"],
  梦幻: ["dreamy", "peaceful"],
  迷幻: ["dreamy", "electronic"],
  有感觉: ["soulful", "groovy"],
  原声: ["acoustic"],
  不插电: ["acoustic"],
};

// 场景组合模式（常见的用户表达模式）
const SCENE_PATTERNS = [
  {
    pattern: /周五.*下班|下班.*周五/,
    tags: ["friday", "commute", "relaxing", "chill"],
    title: "周五下班放松时刻",
  },
  {
    pattern: /地铁.*累|累.*地铁|通勤.*疲惫/,
    tags: ["commute", "relaxing", "peaceful", "slow"],
    title: "通勤治愈歌单",
  },
  {
    pattern: /深夜.*一个人|一个人.*深夜|独处.*夜/,
    tags: ["night", "melancholic", "slow", "peaceful"],
    title: "深夜独处时光",
  },
  {
    pattern: /雨天.*读书|读书.*雨天|下雨.*看书/,
    tags: ["rain", "study", "peaceful", "acoustic"],
    title: "雨天阅读时光",
  },
  {
    pattern: /早晨.*起床|起床.*早晨|清晨/,
    tags: ["morning", "peaceful", "happy", "upbeat"],
    title: "元气早晨",
  },
  {
    pattern: /开车.*兜风|自驾|road\s*trip/i,
    tags: ["driving", "happy", "upbeat", "groovy"],
    title: "公路旅行歌单",
  },
  {
    pattern: /失恋|分手|心碎/,
    tags: ["melancholic", "romantic", "ballad", "slow"],
    title: "疗伤情歌",
  },
  {
    pattern: /80.*复古|复古.*80|city\s*pop/i,
    tags: ["city-pop", "80s", "retro", "groovy", "japanese"],
    title: "80年代复古City Pop",
  },
  {
    pattern: /学习.*专注|专注.*学习|写作业/,
    tags: ["study", "instrumental", "peaceful", "chill"],
    title: "专注学习BGM",
  },
  {
    pattern: /睡前|助眠|入睡/,
    tags: ["sleep", "slow", "peaceful", "instrumental"],
    title: "睡前轻音乐",
  },
  {
    pattern: /健身.*运动|运动.*健身|跑步/,
    tags: ["workout", "energetic", "fast", "upbeat"],
    title: "燃脂运动歌单",
  },
  {
    pattern: /约会|恋爱|甜蜜/,
    tags: ["romantic", "happy", "dreamy", "chill"],
    title: "甜蜜约会歌单",
  },
];

/**
 * 本地关键词匹配提取标签
 */
const extractTagsLocally = (input) => {
  if (!input || typeof input !== "string") {
    return { tags: [], title: "为你推荐", description: "" };
  }

  const normalizedInput = input.toLowerCase().trim();
  const extractedTags = new Set();
  let matchedPattern = null;

  // 1. 首先检查场景组合模式
  for (const pattern of SCENE_PATTERNS) {
    if (pattern.pattern.test(normalizedInput)) {
      pattern.tags.forEach((tag) => extractedTags.add(tag));
      matchedPattern = pattern;
      break;
    }
  }

  // 2. 关键词匹配
  for (const [keyword, tags] of Object.entries(KEYWORD_TO_TAGS)) {
    if (normalizedInput.includes(keyword.toLowerCase())) {
      tags.forEach((tag) => extractedTags.add(tag));
    }
  }

  // 3. 生成标题和描述
  const tagsArray = Array.from(extractedTags);
  let title = matchedPattern?.title || generatePlaylistTitle(tagsArray);
  let description = generatePlaylistDescription(tagsArray, input);

  return {
    tags: tagsArray,
    title,
    description,
    originalQuery: input,
    source: "local",
  };
};

/**
 * 根据标签生成歌单标题
 */
const generatePlaylistTitle = (tags) => {
  if (tags.length === 0) return "为你推荐";

  const sceneTags = ["commute", "workout", "study", "sleep", "party", "cafe", "rain", "night", "morning", "driving"];
  const moodTags = ["relaxing", "energetic", "melancholic", "happy", "romantic", "nostalgic", "peaceful"];
  const genreTags = ["city-pop", "r&b", "rock", "jazz", "electronic", "folk", "ballad"];

  let sceneWord = "";
  let moodWord = "";
  let genreWord = "";

  for (const tag of tags) {
    if (sceneTags.includes(tag) && !sceneWord) {
      sceneWord = TAG_LABELS[tag]?.zh || tag;
    }
    if (moodTags.includes(tag) && !moodWord) {
      moodWord = TAG_LABELS[tag]?.zh || tag;
    }
    if (genreTags.includes(tag) && !genreWord) {
      genreWord = TAG_LABELS[tag]?.zh || tag;
    }
  }

  if (sceneWord && moodWord) {
    return `${sceneWord}${moodWord}歌单`;
  } else if (genreWord && moodWord) {
    return `${moodWord}${genreWord}精选`;
  } else if (sceneWord) {
    return `${sceneWord}音乐`;
  } else if (moodWord) {
    return `${moodWord}时刻`;
  } else if (genreWord) {
    return `${genreWord}精选`;
  }

  return "为你精选";
};

/**
 * 根据标签生成歌单描述
 */
const generatePlaylistDescription = (tags, originalQuery) => {
  if (tags.length === 0) {
    return "根据你的喜好推荐";
  }

  const tagLabels = tags
    .slice(0, 4)
    .map((tag) => TAG_LABELS[tag]?.zh || tag)
    .join(" · ");

  return `${tagLabels}`;
};

// ============================================
// 主要导出函数
// ============================================

/**
 * 从自然语言中提取标签（主函数）
 * 优先使用在线 AI，失败时降级到本地匹配
 */
export const extractTagsFromNaturalLanguage = async (input) => {
  // 检查是否启用在线 AI 且配置了有效的 API Key
  if (
    AI_CONFIG.useOnlineAI &&
    AI_CONFIG.apiKey &&
    AI_CONFIG.apiKey.startsWith("sk-")
  ) {
    const onlineResult = await extractTagsWithAI(input);
    if (onlineResult && onlineResult.tags.length > 0) {
      return onlineResult;
    }
  }

  // 降级到本地匹配
  return extractTagsLocally(input);
};

/**
 * 同步版本（用于不支持 async 的场景）
 */
export const extractTagsFromNaturalLanguageSync = (input) => {
  return extractTagsLocally(input);
};

/**
 * 分析用户意图
 */
export const analyzeIntent = (input) => {
  const normalizedInput = input.toLowerCase();

  if (/推荐|找|听|想要|来点|给我|播放|放|搜/.test(normalizedInput)) {
    return { intent: "recommend", confidence: 0.9 };
  }

  if (/什么|怎么|如何|为什么|是不是/.test(normalizedInput)) {
    return { intent: "question", confidence: 0.8 };
  }

  if (/你好|嗨|hi|hello|早|晚/.test(normalizedInput)) {
    return { intent: "greeting", confidence: 0.9 };
  }

  return { intent: "recommend", confidence: 0.6 };
};

/**
 * 生成 AI 回复文本
 */
export const generateAIResponse = (tags, songCount, playlistTitle, source = "local") => {
  const aiEmoji = source === "siliconflow" ? "🤖" : "🐱";
  
  const responses = [
    `喵~ 根据你的心情，我找到了 ${songCount} 首歌！这个「${playlistTitle}」应该很合你胃口 ${aiEmoji}🎵`,
    `呼噜呼噜~ 捕获到你的需求了！为你准备了 ${songCount} 首歌的「${playlistTitle}」${aiEmoji}`,
    `喵呜！这 ${songCount} 首歌组成的「${playlistTitle}」，是本猫精心挑选的~ 🎶`,
    `找到啦！「${playlistTitle}」共 ${songCount} 首歌，快来听听看~ 🐾`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * 生成无结果时的回复
 */
export const generateNoResultResponse = () => {
  const responses = [
    "喵...这个有点难倒我了，换个说法试试？比如告诉我你现在的心情或者想听什么风格的歌~",
    "呼噜...没找到完全匹配的歌，要不要换个方式描述？比如「下班想放松」或「想听复古的歌」",
    "喵呜~ 我的曲库里暂时没有完全符合的，试试其他关键词？比如情绪、场景或者风格~",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * 检查 AI 配置状态
 */
export const getAIStatus = () => {
  const hasValidKey = AI_CONFIG.apiKey && AI_CONFIG.apiKey.startsWith("sk-");
  return {
    mode: AI_CONFIG.useOnlineAI && hasValidKey ? "online" : "local",
    provider: hasValidKey ? "SiliconFlow (Qwen)" : "本地关键词匹配",
    model: AI_CONFIG.model,
  };
};

export default {
  extractTagsFromNaturalLanguage,
  extractTagsFromNaturalLanguageSync,
  analyzeIntent,
  generateAIResponse,
  generateNoResultResponse,
  getAIStatus,
};
