/**
 * 个性化推荐服务
 * 基于用户播放历史和收藏来推荐歌曲
 */

import { MUSIC_DATABASE } from "../data/musicDatabase";

/**
 * 分析用户偏好
 * @param {Array} recentlyPlayed - 最近播放的歌曲
 * @param {Array} favorites - 收藏的歌曲
 * @returns {Object} 用户偏好分析结果
 */
export function analyzeUserPreferences(recentlyPlayed = [], favorites = []) {
  const preferences = {
    genres: {},
    moods: {},
    artists: {},
    eras: {},
    languages: {},
    tempos: {},
  };

  // 合并最近播放和收藏，收藏权重更高
  const allSongs = [
    ...favorites.map((s) => ({ ...s, weight: 2 })),
    ...recentlyPlayed.map((s) => ({ ...s, weight: 1 })),
  ];

  allSongs.forEach((song) => {
    const weight = song.weight || 1;

    // 统计流派偏好
    if (song.tags?.genre) {
      song.tags.genre.forEach((genre) => {
        preferences.genres[genre] = (preferences.genres[genre] || 0) + weight;
      });
    }

    // 统计心情偏好
    if (song.tags?.mood) {
      song.tags.mood.forEach((mood) => {
        preferences.moods[mood] = (preferences.moods[mood] || 0) + weight;
      });
    }

    // 统计歌手偏好
    if (song.artist) {
      preferences.artists[song.artist] =
        (preferences.artists[song.artist] || 0) + weight;
    }

    // 统计年代偏好
    if (song.tags?.era) {
      song.tags.era.forEach((era) => {
        preferences.eras[era] = (preferences.eras[era] || 0) + weight;
      });
    }

    // 统计语言偏好
    if (song.tags?.language) {
      song.tags.language.forEach((lang) => {
        preferences.languages[lang] =
          (preferences.languages[lang] || 0) + weight;
      });
    }

    // 统计节奏偏好
    if (song.tags?.tempo) {
      song.tags.tempo.forEach((tempo) => {
        preferences.tempos[tempo] = (preferences.tempos[tempo] || 0) + weight;
      });
    }
  });

  return preferences;
}

/**
 * 获取排名靠前的偏好
 * @param {Object} prefObj - 偏好对象
 * @param {number} topN - 返回前N个
 * @returns {Array} 排名靠前的偏好
 */
function getTopPreferences(prefObj, topN = 3) {
  return Object.entries(prefObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key]) => key);
}

/**
 * 计算歌曲与用户偏好的匹配度
 * @param {Object} song - 歌曲
 * @param {Object} preferences - 用户偏好
 * @returns {number} 匹配分数
 */
function calculateMatchScore(song, preferences) {
  let score = 0;

  // 流派匹配
  const topGenres = getTopPreferences(preferences.genres, 5);
  if (song.tags?.genre) {
    song.tags.genre.forEach((genre) => {
      if (topGenres.includes(genre)) {
        score += 3;
      }
    });
  }

  // 心情匹配
  const topMoods = getTopPreferences(preferences.moods, 5);
  if (song.tags?.mood) {
    song.tags.mood.forEach((mood) => {
      if (topMoods.includes(mood)) {
        score += 2;
      }
    });
  }

  // 歌手匹配
  const topArtists = getTopPreferences(preferences.artists, 10);
  if (topArtists.includes(song.artist)) {
    score += 4;
  }

  // 年代匹配
  const topEras = getTopPreferences(preferences.eras, 3);
  if (song.tags?.era) {
    song.tags.era.forEach((era) => {
      if (topEras.includes(era)) {
        score += 1;
      }
    });
  }

  // 语言匹配
  const topLanguages = getTopPreferences(preferences.languages, 3);
  if (song.tags?.language) {
    song.tags.language.forEach((lang) => {
      if (topLanguages.includes(lang)) {
        score += 2;
      }
    });
  }

  // 节奏匹配
  const topTempos = getTopPreferences(preferences.tempos, 2);
  if (song.tags?.tempo) {
    song.tags.tempo.forEach((tempo) => {
      if (topTempos.includes(tempo)) {
        score += 1;
      }
    });
  }

  return score;
}

/**
 * 获取个性化推荐歌曲
 * @param {Array} recentlyPlayed - 最近播放
 * @param {Array} favorites - 收藏
 * @param {number} limit - 返回数量
 * @returns {Array} 推荐歌曲列表
 */
export function getPersonalizedRecommendations(
  recentlyPlayed = [],
  favorites = [],
  limit = 10
) {
  // 如果没有历史数据，返回热门歌曲
  if (recentlyPlayed.length === 0 && favorites.length === 0) {
    return getPopularSongs(limit);
  }

  const preferences = analyzeUserPreferences(recentlyPlayed, favorites);

  // 获取已听过的歌曲ID
  const listenedIds = new Set([
    ...recentlyPlayed.map((s) => s.id),
    ...favorites.map((s) => s.id),
  ]);

  // 计算所有未听过歌曲的匹配分数
  const scoredSongs = MUSIC_DATABASE.filter((song) => !listenedIds.has(song.id))
    .map((song) => ({
      ...song,
      matchScore: calculateMatchScore(song, preferences),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  // 添加一些随机性，避免推荐过于单一
  const topSongs = scoredSongs.slice(0, Math.min(limit * 2, scoredSongs.length));
  const shuffled = topSongs.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}

/**
 * 获取热门歌曲（默认推荐）
 * @param {number} limit - 返回数量
 * @returns {Array} 热门歌曲列表
 */
export function getPopularSongs(limit = 10) {
  // 随机选择一些歌曲作为热门推荐
  const shuffled = [...MUSIC_DATABASE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

/**
 * 获取相似歌曲推荐
 * @param {Object} song - 当前歌曲
 * @param {number} limit - 返回数量
 * @returns {Array} 相似歌曲列表
 */
export function getSimilarSongs(song, limit = 5) {
  if (!song) return [];

  const scoredSongs = MUSIC_DATABASE.filter((s) => s.id !== song.id)
    .map((s) => {
      let score = 0;

      // 同一歌手
      if (s.artist === song.artist) {
        score += 5;
      }

      // 相同流派
      if (song.tags?.genre && s.tags?.genre) {
        const commonGenres = song.tags.genre.filter((g) =>
          s.tags.genre.includes(g)
        );
        score += commonGenres.length * 3;
      }

      // 相同心情
      if (song.tags?.mood && s.tags?.mood) {
        const commonMoods = song.tags.mood.filter((m) =>
          s.tags.mood.includes(m)
        );
        score += commonMoods.length * 2;
      }

      // 相同年代
      if (song.tags?.era && s.tags?.era) {
        const commonEras = song.tags.era.filter((e) => s.tags.era.includes(e));
        score += commonEras.length;
      }

      // 相同语言
      if (song.tags?.language && s.tags?.language) {
        const commonLangs = song.tags.language.filter((l) =>
          s.tags.language.includes(l)
        );
        score += commonLangs.length * 2;
      }

      return { ...s, similarityScore: score };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);

  return scoredSongs.slice(0, limit);
}

/**
 * 获取每日推荐
 * @param {Array} recentlyPlayed - 最近播放
 * @param {Array} favorites - 收藏
 * @returns {Object} 每日推荐数据
 */
export function getDailyRecommendation(recentlyPlayed = [], favorites = []) {
  const recommendations = getPersonalizedRecommendations(
    recentlyPlayed,
    favorites,
    20
  );

  // 根据时间段推荐不同风格
  const hour = new Date().getHours();
  let timeBasedFilter = null;

  if (hour >= 6 && hour < 9) {
    // 早晨：轻快、积极
    timeBasedFilter = (song) =>
      song.tags?.mood?.some((m) => ["轻快", "积极", "温暖", "治愈"].includes(m));
  } else if (hour >= 9 && hour < 12) {
    // 上午：专注、平静
    timeBasedFilter = (song) =>
      song.tags?.mood?.some((m) => ["平静", "舒缓", "清新"].includes(m));
  } else if (hour >= 12 && hour < 14) {
    // 午休：放松
    timeBasedFilter = (song) =>
      song.tags?.mood?.some((m) => ["放松", "慵懒", "舒缓"].includes(m));
  } else if (hour >= 14 && hour < 18) {
    // 下午：活力
    timeBasedFilter = (song) =>
      song.tags?.mood?.some((m) => ["活力", "积极", "轻快"].includes(m));
  } else if (hour >= 18 && hour < 22) {
    // 晚上：浪漫、感性
    timeBasedFilter = (song) =>
      song.tags?.mood?.some((m) =>
        ["浪漫", "感性", "温暖", "怀旧"].includes(m)
      );
  } else {
    // 深夜：安静、治愈
    timeBasedFilter = (song) =>
      song.tags?.mood?.some((m) =>
        ["安静", "治愈", "忧郁", "深沉"].includes(m)
      );
  }

  // 应用时间过滤
  let filtered = timeBasedFilter
    ? recommendations.filter(timeBasedFilter)
    : recommendations;

  // 如果过滤后太少，补充一些
  if (filtered.length < 10) {
    const remaining = recommendations.filter((s) => !filtered.includes(s));
    filtered = [...filtered, ...remaining.slice(0, 10 - filtered.length)];
  }

  return {
    title: getTimeBasedTitle(hour),
    description: getTimeBasedDescription(hour),
    songs: filtered.slice(0, 15),
  };
}

function getTimeBasedTitle(hour) {
  if (hour >= 6 && hour < 9) return "清晨唤醒";
  if (hour >= 9 && hour < 12) return "专注时刻";
  if (hour >= 12 && hour < 14) return "午后小憩";
  if (hour >= 14 && hour < 18) return "活力下午";
  if (hour >= 18 && hour < 22) return "夜晚心情";
  return "深夜陪伴";
}

function getTimeBasedDescription(hour) {
  if (hour >= 6 && hour < 9) return "用音乐开启美好的一天";
  if (hour >= 9 && hour < 12) return "让音乐陪伴你专注工作";
  if (hour >= 12 && hour < 14) return "放松一下，享受午后时光";
  if (hour >= 14 && hour < 18) return "充满活力的下午茶时间";
  if (hour >= 18 && hour < 22) return "夜幕降临，让音乐温暖你";
  return "夜深了，让音乐陪伴你";
}

export default {
  analyzeUserPreferences,
  getPersonalizedRecommendations,
  getPopularSongs,
  getSimilarSongs,
  getDailyRecommendation,
};
