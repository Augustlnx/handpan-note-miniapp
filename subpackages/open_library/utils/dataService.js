/**
 * 公开曲库数据服务层
 * 封装所有数据获取逻辑，使用 Promise 模拟异步请求
 * 方便未来接入后端 API
 * 
 * @author Orbit Note Team
 * @version 1.0.0
 * 
 * API 接口预留说明：
 * - 当前使用本地 JSON 数据
 * - 未来可替换为真实 API 请求
 * - 所有方法均返回 Promise，保持接口一致性
 */

// 导入本地数据
const songsData = require('../data/songs.json');
const artistsData = require('../data/artists.json');
const collectionsData = require('../data/collections.json');
const bannersData = require('../data/banners.json');

// 搜索历史存储 Key
const SEARCH_HISTORY_KEY = 'open_library_search_history';
const MAX_HISTORY_COUNT = 20;

// 收藏存储 Key
const FAVORITES_KEY = 'open_library_favorites';

/**
 * 模拟网络延迟（开发环境可配置）
 * @param {number} ms 延迟毫秒数
 */
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取轮播图数据
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/banners
 */
const getBanners = async () => {
  await delay(50);
  return bannersData.filter(b => b.isActive).sort((a, b) => a.order - b.order);
};

/**
 * 获取精选歌曲列表
 * @param {number} limit 限制数量
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs/featured?limit={limit}
 */
const getFeaturedSongs = async (limit = 10) => {
  await delay(50);
  return songsData
    .filter(s => s.isFeatured)
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, limit);
};

/**
 * 获取最新上架歌曲
 * @param {number} limit 限制数量
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs/recent?limit={limit}
 */
const getRecentSongs = async (limit = 10) => {
  await delay(50);
  return songsData
    .filter(s => s.isNew)
    .sort((a, b) => b.createTime - a.createTime)
    .slice(0, limit);
};

/**
 * 获取热门歌曲排行榜
 * @param {number} limit 限制数量
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs/hot?limit={limit}
 */
const getHotSongs = async (limit = 10) => {
  await delay(50);
  return songsData
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, limit);
};

/**
 * 获取精选合集
 * @param {number} limit 限制数量
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/collections/featured?limit={limit}
 */
const getFeaturedCollections = async (limit = 6) => {
  await delay(50);
  return collectionsData
    .filter(c => c.isFeatured)
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, limit);
};

/**
 * 获取所有合集
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/collections
 */
const getAllCollections = async () => {
  await delay(50);
  return collectionsData.sort((a, b) => b.playCount - a.playCount);
};

/**
 * 获取合集详情
 * @param {string} id 合集ID
 * @returns {Promise<Object|null>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/collections/{id}
 */
const getCollectionDetail = async (id) => {
  await delay(50);
  const collection = collectionsData.find(c => c.id === id);
  if (!collection) return null;
  
  // 附加歌曲详情
  const songs = collection.songIds
    .map(songId => songsData.find(s => s.id === songId))
    .filter(Boolean);
  
  return { ...collection, songs };
};

/**
 * 获取推荐制谱人列表
 * @param {number} limit 限制数量
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/artists/recommended?limit={limit}
 */
const getRecommendedArtists = async (limit = 6) => {
  await delay(50);
  return artistsData
    .filter(a => a.isVerified)
    .sort((a, b) => b.followers - a.followers)
    .slice(0, limit);
};

/**
 * 获取所有制谱人
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/artists
 */
const getAllArtists = async () => {
  await delay(50);
  return artistsData.sort((a, b) => b.followers - a.followers);
};

/**
 * 获取制谱人详情
 * @param {string} id 制谱人ID
 * @returns {Promise<Object|null>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/artists/{id}
 */
const getArtistDetail = async (id) => {
  await delay(50);
  const artist = artistsData.find(a => a.id === id);
  if (!artist) return null;
  
  // 获取该制谱人的所有歌曲
  const songs = songsData
    .filter(s => s.artistId === id)
    .sort((a, b) => b.playCount - a.playCount);
  
  // 获取该制谱人的所有合集
  const collections = collectionsData
    .filter(c => c.artistId === id)
    .sort((a, b) => b.playCount - a.playCount);
  
  return { ...artist, songs, collections };
};

/**
 * 获取歌曲详情
 * @param {string} id 歌曲ID
 * @returns {Promise<Object|null>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs/{id}
 */
const getSongDetail = async (id) => {
  await delay(50);
  const song = songsData.find(s => s.id === id);
  if (!song) return null;
  
  // 附加制谱人信息
  const artist = artistsData.find(a => a.id === song.artistId);
  
  return { ...song, artist };
};

/**
 * 搜索歌曲
 * @param {string} keyword 关键词
 * @param {Object} options 筛选选项
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs/search?keyword={keyword}&rootNote={rootNote}&scaleType={scaleType}
 */
const searchSongs = async (keyword, options = {}) => {
  await delay(100);
  
  const { rootNote, scaleType, difficulty, artistId } = options;
  const kw = (keyword || '').toLowerCase().trim();
  
  let results = songsData;
  
  // 关键词搜索
  if (kw) {
    results = results.filter(song => {
      return song.title.toLowerCase().includes(kw) ||
             song.subtitle.toLowerCase().includes(kw) ||
             song.artistName.toLowerCase().includes(kw) ||
             (song.tags || []).some(tag => tag.toLowerCase().includes(kw));
    });
  }
  
  // 筛选条件
  if (rootNote) {
    results = results.filter(s => s.rootNote === rootNote);
  }
  if (scaleType) {
    results = results.filter(s => s.scaleType === scaleType || s.scaleType.includes(scaleType));
  }
  if (difficulty) {
    results = results.filter(s => s.difficulty === parseInt(difficulty));
  }
  if (artistId) {
    results = results.filter(s => s.artistId === artistId);
  }
  
  return results.sort((a, b) => b.playCount - a.playCount);
};

/**
 * 搜索制谱人
 * @param {string} keyword 关键词
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/artists/search?keyword={keyword}
 */
const searchArtists = async (keyword) => {
  await delay(100);
  
  const kw = (keyword || '').toLowerCase().trim();
  if (!kw) return artistsData;
  
  return artistsData.filter(artist => {
    return artist.name.toLowerCase().includes(kw) ||
           artist.bio.toLowerCase().includes(kw) ||
           (artist.tags || []).some(tag => tag.toLowerCase().includes(kw));
  }).sort((a, b) => b.followers - a.followers);
};

/**
 * 综合搜索
 * @param {string} keyword 关键词
 * @returns {Promise<Object>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/search?keyword={keyword}
 */
const search = async (keyword) => {
  await delay(100);
  
  const [songs, artists] = await Promise.all([
    searchSongs(keyword),
    searchArtists(keyword)
  ]);
  
  // 搜索合集
  const kw = (keyword || '').toLowerCase().trim();
  const collections = collectionsData.filter(c => {
    return c.title.toLowerCase().includes(kw) ||
           (c.tags || []).some(tag => tag.toLowerCase().includes(kw));
  });
  
  return { songs, artists, collections };
};

/**
 * 按调式筛选歌曲
 * @param {string} rootNote 主音
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs?rootNote={rootNote}
 */
const getSongsByRootNote = async (rootNote) => {
  await delay(50);
  return songsData
    .filter(s => s.rootNote === rootNote)
    .sort((a, b) => b.playCount - a.playCount);
};

/**
 * 按音阶类型筛选歌曲
 * @param {string} scaleType 音阶类型
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs?scaleType={scaleType}
 */
const getSongsByScaleType = async (scaleType) => {
  await delay(50);
  return songsData
    .filter(s => s.scaleType === scaleType || s.scaleType.includes(scaleType))
    .sort((a, b) => b.playCount - a.playCount);
};

/**
 * 按难度筛选歌曲
 * @param {number} difficulty 难度等级
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs?difficulty={difficulty}
 */
const getSongsByDifficulty = async (difficulty) => {
  await delay(50);
  return songsData
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => b.playCount - a.playCount);
};

/**
 * 按标签筛选歌曲
 * @param {string} tag 标签
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/songs?tag={tag}
 */
const getSongsByTag = async (tag) => {
  await delay(50);
  return songsData
    .filter(s => (s.tags || []).includes(tag))
    .sort((a, b) => b.playCount - a.playCount);
};

/**
 * 获取热门标签
 * @param {number} limit 限制数量
 * @returns {Promise<Array>}
 * 
 * TODO: 替换为 API
 * GET /api/v1/tags/hot?limit={limit}
 */
const getHotTags = async (limit = 10) => {
  await delay(50);
  
  // 统计标签出现次数
  const tagCount = {};
  songsData.forEach(song => {
    (song.tags || []).forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  
  // 转换为数组并排序
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(item => item.tag);
};

/**
 * 获取所有可用调式
 * @returns {Promise<Array>}
 */
const getAllRootNotes = async () => {
  await delay(50);
  const rootNotes = [...new Set(songsData.map(s => s.rootNote))];
  return rootNotes.sort();
};

/**
 * 获取所有可用音阶类型
 * @returns {Promise<Array>}
 */
const getAllScaleTypes = async () => {
  await delay(50);
  const scaleTypes = [...new Set(songsData.map(s => s.scaleType))];
  return scaleTypes.sort();
};

// ============ 本地存储操作 ============

/**
 * 获取搜索历史
 * @returns {Array}
 */
const getSearchHistory = () => {
  try {
    return wx.getStorageSync(SEARCH_HISTORY_KEY) || [];
  } catch (e) {
    console.error('获取搜索历史失败', e);
    return [];
  }
};

/**
 * 添加搜索历史
 * @param {string} keyword 关键词
 */
const addSearchHistory = (keyword) => {
  if (!keyword || !keyword.trim()) return;
  
  try {
    let history = getSearchHistory();
    // 移除重复项
    history = history.filter(h => h !== keyword.trim());
    // 添加到开头
    history.unshift(keyword.trim());
    // 限制数量
    history = history.slice(0, MAX_HISTORY_COUNT);
    wx.setStorageSync(SEARCH_HISTORY_KEY, history);
  } catch (e) {
    console.error('保存搜索历史失败', e);
  }
};

/**
 * 清空搜索历史
 */
const clearSearchHistory = () => {
  try {
    wx.removeStorageSync(SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error('清空搜索历史失败', e);
  }
};

/**
 * 删除单条搜索历史
 * @param {string} keyword 关键词
 */
const removeSearchHistory = (keyword) => {
  try {
    let history = getSearchHistory();
    history = history.filter(h => h !== keyword);
    wx.setStorageSync(SEARCH_HISTORY_KEY, history);
  } catch (e) {
    console.error('删除搜索历史失败', e);
  }
};

/**
 * 获取收藏列表
 * @returns {Array}
 */
const getFavorites = () => {
  try {
    return wx.getStorageSync(FAVORITES_KEY) || [];
  } catch (e) {
    console.error('获取收藏列表失败', e);
    return [];
  }
};

/**
 * 添加收藏
 * @param {string} songId 歌曲ID
 */
const addFavorite = (songId) => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(songId)) {
      favorites.unshift(songId);
      wx.setStorageSync(FAVORITES_KEY, favorites);
    }
  } catch (e) {
    console.error('添加收藏失败', e);
  }
};

/**
 * 移除收藏
 * @param {string} songId 歌曲ID
 */
const removeFavorite = (songId) => {
  try {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== songId);
    wx.setStorageSync(FAVORITES_KEY, favorites);
  } catch (e) {
    console.error('移除收藏失败', e);
  }
};

/**
 * 检查是否已收藏
 * @param {string} songId 歌曲ID
 * @returns {boolean}
 */
const isFavorite = (songId) => {
  return getFavorites().includes(songId);
};

/**
 * 切换收藏状态
 * @param {string} songId 歌曲ID
 * @returns {boolean} 新的收藏状态
 */
const toggleFavorite = (songId) => {
  if (isFavorite(songId)) {
    removeFavorite(songId);
    return false;
  } else {
    addFavorite(songId);
    return true;
  }
};

/**
 * 获取收藏的歌曲详情列表
 * @returns {Promise<Array>}
 */
const getFavoriteSongs = async () => {
  await delay(50);
  const favoriteIds = getFavorites();
  return favoriteIds
    .map(id => songsData.find(s => s.id === id))
    .filter(Boolean);
};

// 导出所有方法
module.exports = {
  // 轮播图
  getBanners,
  
  // 歌曲相关
  getFeaturedSongs,
  getRecentSongs,
  getHotSongs,
  getSongDetail,
  searchSongs,
  getSongsByRootNote,
  getSongsByScaleType,
  getSongsByDifficulty,
  getSongsByTag,
  
  // 合集相关
  getFeaturedCollections,
  getAllCollections,
  getCollectionDetail,
  
  // 制谱人相关
  getRecommendedArtists,
  getAllArtists,
  getArtistDetail,
  searchArtists,
  
  // 综合搜索
  search,
  
  // 标签和筛选
  getHotTags,
  getAllRootNotes,
  getAllScaleTypes,
  
  // 搜索历史
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  removeSearchHistory,
  
  // 收藏功能
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  getFavoriteSongs
};
