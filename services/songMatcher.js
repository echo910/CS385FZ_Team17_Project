/**
 * 歌曲匹配引擎
 * 
 * 负责根据 AI 提取的标签在曲库中搜索匹配的歌曲
 * 支持多种匹配策略和排序方式
 */

import { MUSIC_DATABASE, getSongsByTagsWithScore } from "../data/musicDatabase";

/**
 * 匹配配置
 */
const MATCH_CONFIG = {
  // 最少匹配标签数（低于此数量不返回）
  minMatchScore: 1,
  // 默认返回歌曲数量
  defaultLimit: 20,
  // 最大返回数量
  maxLimit: 50,
  // 是否启用随机打乱（同分数的歌曲）
  shuffleSameScore: true,
};

/**
 * 根据标签匹配歌曲
 * @param {string[]} tags - 要匹配的标签数组
 * @param {Object} options - 配置选项
 * @returns {Object} - { songs: Array, totalMatched: number, tags: string[] }
 */
export const matchSongsByTags = (tags, options = {}) => {
  const {
    limit = MATCH_CONFIG.defaultLimit,
    minScore = MATCH_CONFIG.minMatchScore,
    shuffle = MATCH_CONFIG.shuffleSameScore,
  } = options;

  if (!tags || tags.length === 0) {
    // 没有标签时返回随机推荐
    const shuffled = [...MUSIC_DATABASE].sort(() => Math.random() - 0.5);
    return {
      songs: shuffled.slice(0, limit),
      totalMatched: MUSIC_DATABASE.length,
      tags: [],
      matchType: "random",
    };
  }

  // 获取带评分的歌曲
  let scoredSongs = getSongsByTagsWithScore(tags);

  // 过滤低分歌曲
  scoredSongs = scoredSongs.filter((song) => song.matchScore >= minScore);

  // 同分数随机打乱
  if (shuffle) {
    scoredSongs = shuffleSameScoreSongs(scoredSongs);
  }

  // 限制返回数量
  const limitedSongs = scoredSongs.slice(0, Math.min(limit, MATCH_CONFIG.maxLimit));

  return {
    songs: limitedSongs,
    totalMatched: scoredSongs.length,
    tags,
    matchType: scoredSongs.length > 0 ? "tagged" : "none",
  };
};

/**
 * 同分数歌曲随机打乱
 */
const shuffleSameScoreSongs = (songs) => {
  if (songs.length <= 1) return songs;

  // 按分数分组
  const scoreGroups = {};
  songs.forEach((song) => {
    const score = song.matchScore;
    if (!scoreGroups[score]) {
      scoreGroups[score] = [];
    }
    scoreGroups[score].push(song);
  });

  // 每组内随机打乱
  Object.keys(scoreGroups).forEach((score) => {
    scoreGroups[score].sort(() => Math.random() - 0.5);
  });

  // 按分数降序重新组合
  const sortedScores = Object.keys(scoreGroups)
    .map(Number)
    .sort((a, b) => b - a);

  const result = [];
  sortedScores.forEach((score) => {
    result.push(...scoreGroups[score]);
  });

  return result;
};

/**
 * 智能歌单生成
 * 根据标签生成一个平衡的歌单（考虑多样性）
 */
export const generateSmartPlaylist = (tags, options = {}) => {
  const { targetLength = 15, diversityFactor = 0.3 } = options;

  const matchResult = matchSongsByTags(tags, { limit: 50 });

  if (matchResult.songs.length === 0) {
    return matchResult;
  }

  // 如果匹配的歌曲少于目标长度，直接返回
  if (matchResult.songs.length <= targetLength) {
    return matchResult;
  }

  // 应用多样性算法：确保不同艺术家的歌曲分布
  const diversifiedSongs = applyDiversityFilter(
    matchResult.songs,
    targetLength,
    diversityFactor
  );

  return {
    ...matchResult,
    songs: diversifiedSongs,
    totalMatched: matchResult.totalMatched,
  };
};

/**
 * 多样性过滤器
 * 确保歌单中艺术家分布均匀
 */
const applyDiversityFilter = (songs, targetLength, diversityFactor) => {
  const result = [];
  const artistCount = {};
  const maxPerArtist = Math.ceil(targetLength * diversityFactor);

  for (const song of songs) {
    const artist = song.artist;
    const currentCount = artistCount[artist] || 0;

    if (currentCount < maxPerArtist) {
      result.push(song);
      artistCount[artist] = currentCount + 1;

      if (result.length >= targetLength) {
        break;
      }
    }
  }

  // 如果还没达到目标长度，继续添加（忽略多样性限制）
  if (result.length < targetLength) {
    for (const song of songs) {
      if (!result.includes(song)) {
        result.push(song);
        if (result.length >= targetLength) {
          break;
        }
      }
    }
  }

  return result;
};

/**
 * 根据艺术家搜索
 */
export const searchByArtist = (artistName, limit = 20) => {
  const normalizedName = artistName.toLowerCase().trim();

  const matchedSongs = MUSIC_DATABASE.filter((song) =>
    song.artist.toLowerCase().includes(normalizedName)
  );

  return {
    songs: matchedSongs.slice(0, limit),
    totalMatched: matchedSongs.length,
    searchType: "artist",
    query: artistName,
  };
};

/**
 * 根据歌曲名搜索
 */
export const searchByTitle = (title, limit = 20) => {
  const normalizedTitle = title.toLowerCase().trim();

  const matchedSongs = MUSIC_DATABASE.filter((song) =>
    song.title.toLowerCase().includes(normalizedTitle)
  );

  return {
    songs: matchedSongs.slice(0, limit),
    totalMatched: matchedSongs.length,
    searchType: "title",
    query: title,
  };
};

/**
 * 综合搜索（标题 + 艺术家）
 */
export const searchSongs = (query, limit = 20) => {
  const normalizedQuery = query.toLowerCase().trim();

  const matchedSongs = MUSIC_DATABASE.filter(
    (song) =>
      song.title.toLowerCase().includes(normalizedQuery) ||
      song.artist.toLowerCase().includes(normalizedQuery) ||
      song.album?.toLowerCase().includes(normalizedQuery)
  );

  return {
    songs: matchedSongs.slice(0, limit),
    totalMatched: matchedSongs.length,
    searchType: "general",
    query,
  };
};

/**
 * 获取相似歌曲推荐
 * 基于当前歌曲的标签找相似的歌
 */
export const getSimilarSongs = (songId, limit = 10) => {
  const currentSong = MUSIC_DATABASE.find((s) => s.id === songId);

  if (!currentSong) {
    return { songs: [], totalMatched: 0 };
  }

  // 获取当前歌曲的所有标签
  const currentTags = Object.values(currentSong.tags).flat();

  // 找相似歌曲（排除当前歌曲）
  const scoredSongs = MUSIC_DATABASE.filter((s) => s.id !== songId).map((song) => {
    const songTags = Object.values(song.tags).flat();
    let score = 0;

    currentTags.forEach((tag) => {
      if (songTags.includes(tag)) {
        score += 1;
      }
    });

    // 同艺术家加分
    if (song.artist === currentSong.artist) {
      score += 2;
    }

    return { ...song, similarityScore: score };
  });

  const sortedSongs = scoredSongs
    .filter((s) => s.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return {
    songs: sortedSongs,
    totalMatched: sortedSongs.length,
    basedOn: currentSong,
  };
};

/**
 * 获取热门/随机推荐
 */
export const getRandomRecommendations = (limit = 10) => {
  const shuffled = [...MUSIC_DATABASE].sort(() => Math.random() - 0.5);
  return {
    songs: shuffled.slice(0, limit),
    totalMatched: MUSIC_DATABASE.length,
    type: "random",
  };
};

/**
 * 按流派获取歌曲
 */
export const getSongsByGenre = (genre, limit = 20) => {
  const matchedSongs = MUSIC_DATABASE.filter((song) =>
    song.tags.genre?.includes(genre.toLowerCase())
  );

  return {
    songs: matchedSongs.slice(0, limit),
    totalMatched: matchedSongs.length,
    genre,
  };
};

/**
 * 按情绪获取歌曲
 */
export const getSongsByMood = (mood, limit = 20) => {
  const matchedSongs = MUSIC_DATABASE.filter((song) =>
    song.tags.mood?.includes(mood.toLowerCase())
  );

  return {
    songs: matchedSongs.slice(0, limit),
    totalMatched: matchedSongs.length,
    mood,
  };
};

export default {
  matchSongsByTags,
  generateSmartPlaylist,
  searchByArtist,
  searchByTitle,
  searchSongs,
  getSimilarSongs,
  getRandomRecommendations,
  getSongsByGenre,
  getSongsByMood,
};
