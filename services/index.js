/**
 * 服务层索引文件
 * 统一导出所有服务
 */

// AI 服务
export {
  extractTagsFromNaturalLanguage,
  analyzeIntent,
  generateAIResponse,
  generateNoResultResponse,
} from "./aiService";

// 歌曲匹配服务
export {
  matchSongsByTags,
  generateSmartPlaylist,
  searchByArtist,
  searchByTitle,
  searchSongs,
  getSimilarSongs,
  getRandomRecommendations,
  getSongsByGenre,
  getSongsByMood,
} from "./songMatcher";
