/**
 * 公开曲库数据服务层
 * 封装所有数据获取逻辑，使用 Promise 模拟异步请求
 * 方便未来接入后端 API
 * 
 * @author Orbit Note Team
 * @version 1.0.0
 * 
 * API 接口预留说明：
 * - 当前使用本地 JS 模块数据（小程序分包不支持直接 require JSON）
 * - 未来可替换为真实 API 请求
 * - 所有方法均返回 Promise，保持接口一致性
 */

// 导入本地数据（使用 JS 模块导出，解决分包 require JSON 的问题）
const songsData = require('../data/songs.js');
const artistsData = require('../data/artists.js');
const collectionsData = require('../data/collections.js');
const bannersData = require('../data/banners.js');

// 搜索历史存储 Key
const SEARCH_HISTORY_KEY = 'open_library_search_history';
const MAX_HISTORY_COUNT = 20;

// 收藏存储 Key
const FAVORITES_KEY = 'open_library_favorites';

// 收藏合集存储 Key
const FAVORITE_COLLECTIONS_KEY = 'open_library_favorite_collections';

// 用户歌单存储 Key
const USER_PLAYLISTS_KEY = 'open_library_user_playlists';

// 默认"我喜欢"歌单ID
const DEFAULT_PLAYLIST_ID = 'playlist_favorites';

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
 * 获取所有歌曲（用于精选「更多」页等，展示全曲库）
 * @param {number} limit 限制数量，不传或 0 表示不限制
 * @returns {Promise<Array>}
 */
const getAllSongs = async (limit = 0) => {
  await delay(50);
  const list = songsData.sort((a, b) => b.playCount - a.playCount);
  return limit > 0 ? list.slice(0, limit) : list;
};

/**
 * 获取精选歌曲列表（仅主页面栏目展示用，是否在主页「精选推荐」栏展示）
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
  
  // 附加制谱人信息；发布者名取 artistId 指向的艺术家名字
  const artist = artistsData.find(a => a.id === song.artistId);
  const publisherName = artist ? artist.name : (song.artistName || '');
  
  return { ...song, artist, publisherName };
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

/**
 * 获取所有歌手（从 subtitle 提取）
 * @returns {Promise<Array>}
 */
const getAllSingers = async () => {
  await delay(50);
  const singers = [...new Set(songsData.map(s => s.subtitle).filter(Boolean))];
  return singers.sort();
};

/**
 * 按歌手筛选歌曲
 * @param {string} singer 歌手名称（subtitle）
 * @returns {Promise<Array>}
 */
const getSongsBySinger = async (singer) => {
  await delay(50);
  return songsData
    .filter(s => s.subtitle === singer)
    .sort((a, b) => b.playCount - a.playCount);
};

/**
 * 获取所有制谱人名称（从 artistName 提取）
 * @returns {Promise<Array>}
 */
const getAllArtistNames = async () => {
  await delay(50);
  const artistNames = [...new Set(songsData.map(s => s.artistName).filter(Boolean))];
  return artistNames.sort();
};

/**
 * 按制谱人名称筛选歌曲
 * @param {string} artistName 制谱人名称
 * @returns {Promise<Array>}
 */
const getSongsByArtistName = async (artistName) => {
  await delay(50);
  return songsData
    .filter(s => s.artistName === artistName)
    .sort((a, b) => b.playCount - a.playCount);
};

// 常见音位数分类
const COMMON_NOTE_COUNTS = [10, 12, 14, 16, 18, 20];

/**
 * 获取所有音位数分类
 * 常见分类：10、12、14、16、18、20，其他归为"其他"
 * @returns {Promise<Array>}
 */
const getAllNoteCounts = async () => {
  await delay(50);
  // 获取所有唯一的音位数
  const allNoteCounts = [...new Set(songsData.map(s => s.noteCount).filter(Boolean))];
  
  // 分类：常见的和其他
  const categories = [];
  
  // 添加常见的音位数（按顺序）
  COMMON_NOTE_COUNTS.forEach(count => {
    if (allNoteCounts.includes(count)) {
      categories.push(count.toString());
    }
  });
  
  // 检查是否有"其他"类别的数据
  const hasOther = allNoteCounts.some(count => !COMMON_NOTE_COUNTS.includes(count));
  if (hasOther) {
    categories.push('其他');
  }
  
  return categories;
};

/**
 * 按音位数筛选歌曲
 * @param {string} noteCountFilter 音位数筛选值（数字字符串或"其他"）
 * @returns {Promise<Array>}
 */
const getSongsByNoteCount = async (noteCountFilter) => {
  await delay(50);
  
  if (noteCountFilter === '其他') {
    // 返回不在常见音位数中的歌曲
    return songsData
      .filter(s => s.noteCount && !COMMON_NOTE_COUNTS.includes(s.noteCount))
      .sort((a, b) => b.playCount - a.playCount);
  }
  
  const noteCount = parseInt(noteCountFilter);
  return songsData
    .filter(s => s.noteCount === noteCount)
    .sort((a, b) => b.playCount - a.playCount);
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

// ============ 收藏合集功能 ============

/**
 * 获取收藏的合集ID列表
 * @returns {Array}
 */
const getFavoriteCollections = () => {
  try {
    return wx.getStorageSync(FAVORITE_COLLECTIONS_KEY) || [];
  } catch (e) {
    console.error('获取收藏合集列表失败', e);
    return [];
  }
};

/**
 * 添加合集收藏
 * @param {string} collectionId 合集ID
 */
const addFavoriteCollection = (collectionId) => {
  try {
    const favorites = getFavoriteCollections();
    if (!favorites.includes(collectionId)) {
      favorites.unshift(collectionId);
      wx.setStorageSync(FAVORITE_COLLECTIONS_KEY, favorites);
    }
  } catch (e) {
    console.error('添加合集收藏失败', e);
  }
};

/**
 * 移除合集收藏
 * @param {string} collectionId 合集ID
 */
const removeFavoriteCollection = (collectionId) => {
  try {
    let favorites = getFavoriteCollections();
    favorites = favorites.filter(id => id !== collectionId);
    wx.setStorageSync(FAVORITE_COLLECTIONS_KEY, favorites);
  } catch (e) {
    console.error('移除合集收藏失败', e);
  }
};

/**
 * 检查合集是否已收藏
 * @param {string} collectionId 合集ID
 * @returns {boolean}
 */
const isCollectionFavorite = (collectionId) => {
  return getFavoriteCollections().includes(collectionId);
};

/**
 * 切换合集收藏状态
 * @param {string} collectionId 合集ID
 * @returns {boolean} 新的收藏状态
 */
const toggleCollectionFavorite = (collectionId) => {
  if (isCollectionFavorite(collectionId)) {
    removeFavoriteCollection(collectionId);
    return false;
  } else {
    addFavoriteCollection(collectionId);
    return true;
  }
};

/**
 * 获取收藏的合集详情列表
 * @returns {Promise<Array>}
 */
const getFavoriteCollectionDetails = async () => {
  await delay(50);
  const favoriteIds = getFavoriteCollections();
  return favoriteIds
    .map(id => collectionsData.find(c => c.id === id))
    .filter(Boolean);
};

// ============ 用户歌单管理 ============

/**
 * 初始化用户歌单（确保有默认"我喜欢"歌单）
 */
const initUserPlaylists = () => {
  try {
    let playlists = wx.getStorageSync(USER_PLAYLISTS_KEY) || [];
    
    // 确保有默认的"我喜欢"歌单
    const hasDefault = playlists.some(p => p.id === DEFAULT_PLAYLIST_ID);
    if (!hasDefault) {
      const defaultPlaylist = {
        id: DEFAULT_PLAYLIST_ID,
        name: '我喜欢',
        description: '收藏的歌曲会自动出现在这里',
        coverGradient: ['#FF6B6B', '#FFE66D'],
        songIds: [],
        isDefault: true,
        createTime: Date.now(),
        updateTime: Date.now()
      };
      playlists.unshift(defaultPlaylist);
      wx.setStorageSync(USER_PLAYLISTS_KEY, playlists);
    }
    
    return playlists;
  } catch (e) {
    console.error('初始化用户歌单失败', e);
    return [];
  }
};

/**
 * 获取所有用户歌单
 * @returns {Array}
 */
const getUserPlaylists = () => {
  try {
    return initUserPlaylists();
  } catch (e) {
    console.error('获取用户歌单失败', e);
    return [];
  }
};

/**
 * 创建新歌单
 * @param {string} name 歌单名称
 * @param {string} description 歌单描述（可选）
 * @returns {Object} 新创建的歌单
 */
const createPlaylist = (name, description = '') => {
  try {
    const playlists = getUserPlaylists();
    
    // 生成随机渐变色
    const gradients = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
      ['#a8edea', '#fed6e3'],
      ['#d299c2', '#fef9d7'],
      ['#89f7fe', '#66a6ff']
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    const newPlaylist = {
      id: 'playlist_' + Date.now(),
      name,
      description,
      coverGradient: randomGradient,
      songIds: [],
      isDefault: false,
      createTime: Date.now(),
      updateTime: Date.now()
    };
    
    playlists.push(newPlaylist);
    wx.setStorageSync(USER_PLAYLISTS_KEY, playlists);
    
    return newPlaylist;
  } catch (e) {
    console.error('创建歌单失败', e);
    return null;
  }
};

/**
 * 删除歌单
 * @param {string} playlistId 歌单ID
 * @returns {boolean} 是否成功删除
 */
const deletePlaylist = (playlistId) => {
  try {
    // 不允许删除默认歌单
    if (playlistId === DEFAULT_PLAYLIST_ID) {
      return false;
    }
    
    let playlists = getUserPlaylists();
    playlists = playlists.filter(p => p.id !== playlistId);
    wx.setStorageSync(USER_PLAYLISTS_KEY, playlists);
    return true;
  } catch (e) {
    console.error('删除歌单失败', e);
    return false;
  }
};

/**
 * 重命名歌单
 * @param {string} playlistId 歌单ID
 * @param {string} newName 新名称
 * @returns {boolean} 是否成功
 */
const renamePlaylist = (playlistId, newName) => {
  try {
    const playlists = getUserPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist) {
      playlist.name = newName;
      playlist.updateTime = Date.now();
      wx.setStorageSync(USER_PLAYLISTS_KEY, playlists);
      return true;
    }
    return false;
  } catch (e) {
    console.error('重命名歌单失败', e);
    return false;
  }
};

/**
 * 获取歌单详情
 * @param {string} playlistId 歌单ID
 * @returns {Promise<Object|null>}
 */
const getPlaylistDetail = async (playlistId) => {
  await delay(50);
  
  const playlists = getUserPlaylists();
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist) return null;
  
  // 如果是"我喜欢"歌单，使用全局收藏列表
  let songIds = playlist.songIds || [];
  if (playlistId === DEFAULT_PLAYLIST_ID) {
    songIds = getFavorites();
  }
  
  // 获取歌曲详情
  const songs = songIds
    .map(id => songsData.find(s => s.id === id))
    .filter(Boolean)
    .map(song => ({
      ...song,
      isFavorite: isFavorite(song.id)
    }));
  
  return {
    ...playlist,
    songIds,
    songs,
    songCount: songs.length
  };
};

/**
 * 添加歌曲到歌单
 * @param {string} playlistId 歌单ID
 * @param {string} songId 歌曲ID
 * @returns {boolean} 是否成功
 */
const addSongToPlaylist = (playlistId, songId) => {
  try {
    // 如果是"我喜欢"歌单，使用全局收藏
    if (playlistId === DEFAULT_PLAYLIST_ID) {
      addFavorite(songId);
      return true;
    }
    
    const playlists = getUserPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist && !playlist.songIds.includes(songId)) {
      playlist.songIds.unshift(songId);
      playlist.updateTime = Date.now();
      wx.setStorageSync(USER_PLAYLISTS_KEY, playlists);
      return true;
    }
    return false;
  } catch (e) {
    console.error('添加歌曲到歌单失败', e);
    return false;
  }
};

/**
 * 从歌单移除歌曲
 * @param {string} playlistId 歌单ID
 * @param {string} songId 歌曲ID
 * @returns {boolean} 是否成功
 */
const removeSongFromPlaylist = (playlistId, songId) => {
  try {
    // 如果是"我喜欢"歌单，使用全局收藏
    if (playlistId === DEFAULT_PLAYLIST_ID) {
      removeFavorite(songId);
      return true;
    }
    
    const playlists = getUserPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist) {
      playlist.songIds = playlist.songIds.filter(id => id !== songId);
      playlist.updateTime = Date.now();
      wx.setStorageSync(USER_PLAYLISTS_KEY, playlists);
      return true;
    }
    return false;
  } catch (e) {
    console.error('从歌单移除歌曲失败', e);
    return false;
  }
};

/**
 * 获取用户统计数据
 * @returns {Object}
 */
const getUserStats = () => {
  const playlists = getUserPlaylists();
  const favorites = getFavorites();
  const favoriteCollections = getFavoriteCollections();
  
  return {
    playlistCount: playlists.length,
    favoriteCount: favorites.length,
    collectionCount: favoriteCollections.length
  };
};

// 导出所有方法
module.exports = {
  // 轮播图
  getBanners,
  
  // 歌曲相关
  getAllSongs,
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
  
  // 歌手筛选（按subtitle）
  getAllSingers,
  getSongsBySinger,
  
  // 制谱人名称筛选（按artistName）
  getAllArtistNames,
  getSongsByArtistName,
  
  // 音位数筛选
  getAllNoteCounts,
  getSongsByNoteCount,
  
  // 搜索历史
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  removeSearchHistory,
  
  // 歌曲收藏功能
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  getFavoriteSongs,
  
  // 合集收藏功能
  getFavoriteCollections,
  addFavoriteCollection,
  removeFavoriteCollection,
  isCollectionFavorite,
  toggleCollectionFavorite,
  getFavoriteCollectionDetails,
  
  // 用户歌单管理
  initUserPlaylists,
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  renamePlaylist,
  getPlaylistDetail,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserStats,
  
  // 常量
  DEFAULT_PLAYLIST_ID: 'playlist_favorites'
};
