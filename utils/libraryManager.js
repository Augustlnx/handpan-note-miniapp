// utils/libraryManager.js
// 曲库数据管理工具

const STORAGE_KEY = 'music_library_data';
const RECENT_FILES_KEY = 'recent_files';
const MAX_RECENT_FILES = 10;

// 为同路径下的文件名去重，自动追加 (1)、(2)... 后缀
function resolveDuplicateFileName(path, name, data) {
  const targetPath = JSON.stringify(path || []);
  const existing = (data.files || []).filter(f => JSON.stringify(f.path || []) === targetPath)
    .map(f => f.file_name || '');
  if (!existing.includes(name)) return name;

  const baseMatch = name.match(/^(.*?)(\((\d+)\))?$/);
  const base = (baseMatch && baseMatch[1]) ? baseMatch[1].trim() : name;
  let counter = baseMatch && baseMatch[3] ? parseInt(baseMatch[3], 10) : 1;
  let candidate = '';
  do {
    candidate = `${base} (${counter})`;
    counter += 1;
  } while (existing.includes(candidate));
  return candidate;
}

// 生成唯一ID
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 获取存储的数据结构
function getStorageData() {
  try {
    const data = wx.getStorageSync(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('读取数据失败', e);
  }
  
  // 返回默认数据结构
  return {
    folders: [],
    files: [],
    version: '1.0.0'
  };
}

// 保存数据
function saveStorageData(data) {
  try {
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('保存数据失败', e);
    return false;
  }
}

// ========== 文件夹操作 ==========

// 根据路径获取项目列表
function getItemsByPath(path = []) {
  const data = getStorageData();
  
  // 获取当前路径下的所有文件夹
  const folders = data.folders.filter(folder => {
    if (!folder.path) folder.path = [];
    return JSON.stringify(folder.path) === JSON.stringify(path);
  });

  // 获取当前路径下的所有文件
  const files = data.files.filter(file => {
    if (!file.path) file.path = [];
    return JSON.stringify(file.path) === JSON.stringify(path);
  });

  // 计算每个文件夹的文件数量
  folders.forEach(folder => {
    folder.fileCount = countFolderItems(folder.id, data);
  });

  return [...folders, ...files];
}

// 计算文件夹内的项目数量（递归）
function countFolderItems(folderId, data) {
  let count = 0;
  
  // 查找直接子项
  data.folders.forEach(folder => {
    if (folder.path && folder.path[folder.path.length - 1] === folderId) {
      count += 1 + countFolderItems(folder.id, data);
    }
  });
  
  data.files.forEach(file => {
    if (file.path && file.path[file.path.length - 1] === folderId) {
      count += 1;
    }
  });
  
  return count;
}

// 添加文件夹
function addFolder(path, name) {
  const data = getStorageData();
  
  const newFolder = {
    id: generateId(),
    type: 'folder',
    name: name,
    path: path,
    createTime: Date.now(),
    modifyTime: Date.now()
  };
  
  data.folders.push(newFolder);
  saveStorageData(data);
  
  return newFolder;
}

// 重命名文件夹
function renameFolder(folderId, newName) {
  const data = getStorageData();
  
  const folder = data.folders.find(f => f.id === folderId);
  if (folder) {
    folder.name = newName;
    folder.modifyTime = Date.now();
    saveStorageData(data);
    return true;
  }
  
  return false;
}

// 删除文件夹（递归删除所有子项）
function deleteFolder(folderId) {
  const data = getStorageData();
  
  // 递归删除所有子文件夹
  const subFolders = data.folders.filter(f => 
    f.path && f.path[f.path.length - 1] === folderId
  );
  subFolders.forEach(subFolder => {
    deleteFolder(subFolder.id);
  });
  
  // 删除该文件夹下的所有文件
  data.files = data.files.filter(f => 
    !(f.path && f.path[f.path.length - 1] === folderId)
  );
  
  // 删除该文件夹
  data.folders = data.folders.filter(f => f.id !== folderId);
  
  saveStorageData(data);
  return true;
}

// 根据ID获取文件夹
function getFolderById(folderId) {
  const data = getStorageData();
  return data.folders.find(f => f.id === folderId);
}

// 获取所有文件夹（用于移动功能）
function getAllFolders() {
  const data = getStorageData();
  
  return data.folders.map(folder => {
    // 生成显示路径
    const pathNames = folder.path.map(id => {
      const parentFolder = data.folders.find(f => f.id === id);
      return parentFolder ? parentFolder.name : '未知';
    });
    pathNames.push(folder.name);
    
    return {
      id: folder.id,
      name: folder.name,
      path: [...folder.path, folder.id],
      displayPath: pathNames.join(' / ')
    };
  });
}

// ========== 文件操作 ==========

// 添加文件
function addFile(path, fileData) {
  const data = getStorageData();
  const dedupedName = resolveDuplicateFileName(path, fileData.file_name || '未命名', data);
  
  const newFile = {
    id: generateId(),
    type: 'file',
    path: path,
    createTime: Date.now(),
    modifyTime: Date.now(),
    starred: false,
    ...fileData,
    file_name: dedupedName
  };
  
  data.files.push(newFile);
  saveStorageData(data);
  
  return newFile;
}

// 重命名文件
function renameFile(fileId, newName) {
  const data = getStorageData();
  
  const file = data.files.find(f => f.id === fileId);
  if (file) {
    file.file_name = newName;
    file.modifyTime = Date.now();
    saveStorageData(data);
    return true;
  }
  
  return false;
}

// 删除文件
function deleteFile(fileId) {
  const data = getStorageData();
  
  data.files = data.files.filter(f => f.id !== fileId);
  saveStorageData(data);
  
  // 同时从最近打开中删除
  removeRecentFile(fileId);
  
  return true;
}

// 移动文件
function moveFile(fileId, targetPath) {
  const data = getStorageData();
  
  const file = data.files.find(f => f.id === fileId);
  if (file) {
    file.path = targetPath;
    file.modifyTime = Date.now();
    saveStorageData(data);
    return true;
  }
  
  return false;
}

// 切换文件收藏状态
function toggleFileStar(fileId) {
  const data = getStorageData();
  
  const file = data.files.find(f => f.id === fileId);
  if (file) {
    file.starred = !file.starred;
    file.modifyTime = Date.now();
    saveStorageData(data);
    return file.starred;
  }
  
  return false;
}

// 更新文件数据
function updateFile(fileId, fileData) {
  const data = getStorageData();
  
  const file = data.files.find(f => f.id === fileId);
  if (file) {
    Object.assign(file, fileData);
    file.modifyTime = Date.now();
    saveStorageData(data);
    return true;
  }
  
  return false;
}

// 根据ID获取文件
function getFileById(fileId) {
  const data = getStorageData();
  return data.files.find(f => f.id === fileId);
}

// ========== 最近打开 ==========

// 获取最近打开的文件
function getRecentFiles() {
  try {
    const recentIds = wx.getStorageSync(RECENT_FILES_KEY);
    if (!recentIds) return [];
    
    const ids = JSON.parse(recentIds);
    const data = getStorageData();
    
    // 根据ID获取文件，并过滤掉已删除的文件
    const files = ids
      .map(id => data.files.find(f => f.id === id))
      .filter(f => f !== undefined)
      .slice(0, MAX_RECENT_FILES);
    
    return files;
  } catch (e) {
    console.error('读取最近文件失败', e);
    return [];
  }
}

// 添加到最近打开
function addRecentFile(file) {
  try {
    let recentIds = [];
    const stored = wx.getStorageSync(RECENT_FILES_KEY);
    if (stored) {
      recentIds = JSON.parse(stored);
    }
    
    // 移除已存在的记录
    recentIds = recentIds.filter(id => id !== file.id);
    
    // 添加到开头
    recentIds.unshift(file.id);
    
    // 限制数量
    recentIds = recentIds.slice(0, MAX_RECENT_FILES);
    
    wx.setStorageSync(RECENT_FILES_KEY, JSON.stringify(recentIds));
    return true;
  } catch (e) {
    console.error('保存最近文件失败', e);
    return false;
  }
}

// 从最近打开中移除
function removeRecentFile(fileId) {
  try {
    const stored = wx.getStorageSync(RECENT_FILES_KEY);
    if (!stored) return true;
    
    let recentIds = JSON.parse(stored);
    recentIds = recentIds.filter(id => id !== fileId);
    
    wx.setStorageSync(RECENT_FILES_KEY, JSON.stringify(recentIds));
    return true;
  } catch (e) {
    console.error('删除最近文件失败', e);
    return false;
  }
}

// ========== 导入导出 ==========

// 导出所有数据
function exportAllData() {
  const data = getStorageData();
  const recentIds = wx.getStorageSync(RECENT_FILES_KEY);
  
  return {
    library: data,
    recentFiles: recentIds ? JSON.parse(recentIds) : [],
    exportTime: Date.now(),
    version: data.version
  };
}

// 导入数据
function importData(importedData) {
  try {
    if (!importedData.library) {
      throw new Error('数据格式错误');
    }
    
    // 保存曲库数据
    saveStorageData(importedData.library);
    
    // 保存最近文件
    if (importedData.recentFiles) {
      wx.setStorageSync(RECENT_FILES_KEY, JSON.stringify(importedData.recentFiles));
    }
    
    return true;
  } catch (e) {
    console.error('导入数据失败', e);
    return false;
  }
}

// 清空所有数据
function clearAllData() {
  try {
    wx.removeStorageSync(STORAGE_KEY);
    wx.removeStorageSync(RECENT_FILES_KEY);
    return true;
  } catch (e) {
    console.error('清空数据失败', e);
    return false;
  }
}

// ========== 初始化示例数据 ==========

// 初始化示例数据（仅用于演示）
function initSampleData() {
  const data = getStorageData();
  
  // 如果已有数据，不初始化
  if (data.folders.length > 0 || data.files.length > 0) {
    return false;
  }
  
  // 创建示例文件夹
  const folder1 = {
    id: generateId(),
    type: 'folder',
    name: '流行歌曲',
    path: [],
    createTime: Date.now() - 86400000 * 7,
    modifyTime: Date.now() - 86400000 * 3
  };
  
  const folder2 = {
    id: generateId(),
    type: 'folder',
    name: '古典音乐',
    path: [],
    createTime: Date.now() - 86400000 * 5,
    modifyTime: Date.now() - 86400000 * 2
  };
  
  const folder3 = {
    id: generateId(),
    type: 'folder',
    name: '我的收藏',
    path: [],
    createTime: Date.now() - 86400000 * 10,
    modifyTime: Date.now() - 86400000 * 1
  };
  
  data.folders.push(folder1, folder2, folder3);
  
  // 创建示例文件
  const sampleFiles = [
    {
      id: generateId(),
      type: 'file',
      path: [folder1.id],
      file_name: "晴天",
      title: '晴天',
      subtitle: 'Author: 周杰伦',
      tempo: 120,
      rotation: "手机竖屏（默认）",
      timing: "4/4",
      code: "C G Am F | C G Am F | ...",
      createTime: Date.now() - 86400000 * 6,
      modifyTime: Date.now() - 86400000 * 2,
      starred: true
    },
    {
      id: generateId(),
      type: 'file',
      path: [folder1.id],
      file_name: "七里香",
      title: '七里香',
      subtitle: 'Author: 周杰伦',
      tempo: 110,
      rotation: "手机竖屏（默认）",
      timing: "4/4",
      code: "G D Em C | G D Em C | ...",
      createTime: Date.now() - 86400000 * 5,
      modifyTime: Date.now() - 86400000 * 1,
      starred: false
    },
    {
      id: generateId(),
      type: 'file',
      path: [folder2.id],
      file_name: "卡农",
      title: 'Canon in D',
      subtitle: 'Author: Pachelbel',
      tempo: 80,
      rotation: "手机竖屏（默认）",
      timing: "4/4",
      code: "D A Bm F#m | G D G A | ...",
      createTime: Date.now() - 86400000 * 4,
      modifyTime: Date.now() - 86400000 * 4,
      starred: true
    },
    {
      id: generateId(),
      type: 'file',
      path: [],
      file_name: "练习曲1",
      title: '练习曲',
      subtitle: 'Author: Unknown',
      tempo: 100,
      rotation: "手机竖屏（默认）",
      timing: "3/4",
      code: "C Am F G | C Am F G | ...",
      createTime: Date.now() - 86400000 * 2,
      modifyTime: Date.now(),
      starred: false
    }
  ];
  
  data.files.push(...sampleFiles);
  
  saveStorageData(data);
  return true;
}

module.exports = {
  // 文件夹操作
  getItemsByPath,
  addFolder,
  renameFolder,
  deleteFolder,
  getFolderById,
  getAllFolders,
  
  // 文件操作
  addFile,
  renameFile,
  deleteFile,
  moveFile,
  toggleFileStar,
  updateFile,
  getFileById,
  
  // 最近打开
  getRecentFiles,
  addRecentFile,
  removeRecentFile,
  
  // 导入导出
  exportAllData,
  importData,
  clearAllData,
  
  // 初始化
  initSampleData
};
