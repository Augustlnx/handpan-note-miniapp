#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Orbit Note 公开曲库 - 后台管理工具

功能说明：
- 管理曲谱数据（增删改查）
- 管理制谱人数据
- 管理合集数据
- 管理轮播Banner
- 导入新曲谱
- 数据验证与修复

使用方式：
    python admin_tool.py

注意：
    - 此工具直接操作 data/ 目录下的 JSON 文件
    - 未来接入真后端时，可替换为 API 调用
    - 当前为纯本地操作，无网络依赖

作者：Orbit Note Team
版本：1.0.0
"""

import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Optional, Any
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
import webbrowser
import threading

# ============ 配置 ============
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
SONGS_FILE = os.path.join(DATA_DIR, 'songs.json')
ARTISTS_FILE = os.path.join(DATA_DIR, 'artists.json')
COLLECTIONS_FILE = os.path.join(DATA_DIR, 'collections.json')
BANNERS_FILE = os.path.join(DATA_DIR, 'banners.json')

# ============ 数据操作类 ============

class DataManager:
    """
    数据管理器
    
    负责所有 JSON 数据文件的读写操作
    未来对接真后端时，可将此类的方法改为 API 调用
    
    TODO: 后端对接时需修改的方法：
    - load_data() -> GET /api/v1/{resource}
    - save_data() -> POST/PUT /api/v1/{resource}
    - add_item() -> POST /api/v1/{resource}
    - update_item() -> PUT /api/v1/{resource}/{id}
    - delete_item() -> DELETE /api/v1/{resource}/{id}
    """
    
    def __init__(self):
        self.ensure_data_dir()
    
    def ensure_data_dir(self):
        """确保数据目录存在"""
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)
    
    def load_data(self, filepath: str) -> List[Dict]:
        """
        加载 JSON 数据
        
        TODO: 后端对接
        将此方法改为:
        response = requests.get(f"{API_BASE_URL}/api/v1/{resource}")
        return response.json()
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
        except json.JSONDecodeError:
            print(f"警告: {filepath} 格式错误，返回空列表")
            return []
    
    def save_data(self, filepath: str, data: List[Dict]) -> bool:
        """
        保存 JSON 数据
        
        TODO: 后端对接
        将此方法改为:
        response = requests.put(f"{API_BASE_URL}/api/v1/{resource}", json=data)
        return response.status_code == 200
        """
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"保存失败: {e}")
            return False
    
    def generate_id(self, prefix: str) -> str:
        """生成唯一ID"""
        return f"{prefix}_{uuid.uuid4().hex[:8]}"
    
    def get_timestamp(self) -> int:
        """获取当前时间戳（毫秒）"""
        return int(datetime.now().timestamp() * 1000)


class SongManager(DataManager):
    """曲谱管理器"""
    
    def __init__(self):
        super().__init__()
        self.filepath = SONGS_FILE
    
    def get_all(self) -> List[Dict]:
        """获取所有曲谱"""
        return self.load_data(self.filepath)
    
    def get_by_id(self, song_id: str) -> Optional[Dict]:
        """根据ID获取曲谱"""
        songs = self.get_all()
        for song in songs:
            if song.get('id') == song_id:
                return song
        return None
    
    def add(self, song_data: Dict) -> Dict:
        """
        添加新曲谱
        
        TODO: 后端对接
        将此方法改为:
        response = requests.post(f"{API_BASE_URL}/api/v1/songs", json=song_data)
        return response.json()
        """
        songs = self.get_all()
        
        # 生成ID和时间戳
        song_data['id'] = self.generate_id('song')
        song_data['createTime'] = self.get_timestamp()
        song_data['updateTime'] = self.get_timestamp()
        
        # 设置默认值
        song_data.setdefault('playCount', 0)
        song_data.setdefault('likeCount', 0)
        song_data.setdefault('isVip', False)
        song_data.setdefault('isFeatured', False)
        song_data.setdefault('isNew', True)
        song_data.setdefault('collectionIds', [])
        song_data.setdefault('tags', [])
        song_data.setdefault('coverGradient', ['#667eea', '#764ba2'])
        
        songs.append(song_data)
        self.save_data(self.filepath, songs)
        return song_data
    
    def update(self, song_id: str, updates: Dict) -> Optional[Dict]:
        """
        更新曲谱
        
        TODO: 后端对接
        将此方法改为:
        response = requests.put(f"{API_BASE_URL}/api/v1/songs/{song_id}", json=updates)
        return response.json()
        """
        songs = self.get_all()
        for i, song in enumerate(songs):
            if song.get('id') == song_id:
                song.update(updates)
                song['updateTime'] = self.get_timestamp()
                songs[i] = song
                self.save_data(self.filepath, songs)
                return song
        return None
    
    def delete(self, song_id: str) -> bool:
        """
        删除曲谱
        
        TODO: 后端对接
        将此方法改为:
        response = requests.delete(f"{API_BASE_URL}/api/v1/songs/{song_id}")
        return response.status_code == 200
        """
        songs = self.get_all()
        filtered = [s for s in songs if s.get('id') != song_id]
        if len(filtered) < len(songs):
            self.save_data(self.filepath, filtered)
            return True
        return False
    
    def search(self, keyword: str) -> List[Dict]:
        """搜索曲谱"""
        songs = self.get_all()
        keyword = keyword.lower()
        return [
            s for s in songs
            if keyword in s.get('title', '').lower()
            or keyword in s.get('subtitle', '').lower()
            or keyword in s.get('artistName', '').lower()
            or any(keyword in tag.lower() for tag in s.get('tags', []))
        ]


class ArtistManager(DataManager):
    """制谱人管理器"""
    
    def __init__(self):
        super().__init__()
        self.filepath = ARTISTS_FILE
    
    def get_all(self) -> List[Dict]:
        """获取所有制谱人"""
        return self.load_data(self.filepath)
    
    def get_by_id(self, artist_id: str) -> Optional[Dict]:
        """根据ID获取制谱人"""
        artists = self.get_all()
        for artist in artists:
            if artist.get('id') == artist_id:
                return artist
        return None
    
    def add(self, artist_data: Dict) -> Dict:
        """添加新制谱人"""
        artists = self.get_all()
        
        artist_data['id'] = self.generate_id('artist')
        artist_data['createTime'] = self.get_timestamp()
        artist_data['updateTime'] = self.get_timestamp()
        
        artist_data.setdefault('followers', 0)
        artist_data.setdefault('songCount', 0)
        artist_data.setdefault('collectionCount', 0)
        artist_data.setdefault('isVerified', False)
        artist_data.setdefault('isVip', False)
        artist_data.setdefault('tags', [])
        artist_data.setdefault('backgroundGradient', ['#667eea', '#764ba2'])
        
        artists.append(artist_data)
        self.save_data(self.filepath, artists)
        return artist_data
    
    def update(self, artist_id: str, updates: Dict) -> Optional[Dict]:
        """更新制谱人"""
        artists = self.get_all()
        for i, artist in enumerate(artists):
            if artist.get('id') == artist_id:
                artist.update(updates)
                artist['updateTime'] = self.get_timestamp()
                artists[i] = artist
                self.save_data(self.filepath, artists)
                return artist
        return None
    
    def delete(self, artist_id: str) -> bool:
        """删除制谱人"""
        artists = self.get_all()
        filtered = [a for a in artists if a.get('id') != artist_id]
        if len(filtered) < len(artists):
            self.save_data(self.filepath, filtered)
            return True
        return False


class CollectionManager(DataManager):
    """合集管理器"""
    
    def __init__(self):
        super().__init__()
        self.filepath = COLLECTIONS_FILE
    
    def get_all(self) -> List[Dict]:
        """获取所有合集"""
        return self.load_data(self.filepath)
    
    def get_by_id(self, collection_id: str) -> Optional[Dict]:
        """根据ID获取合集"""
        collections = self.get_all()
        for collection in collections:
            if collection.get('id') == collection_id:
                return collection
        return None
    
    def add(self, collection_data: Dict) -> Dict:
        """添加新合集"""
        collections = self.get_all()
        
        collection_data['id'] = self.generate_id('col')
        collection_data['createTime'] = self.get_timestamp()
        collection_data['updateTime'] = self.get_timestamp()
        
        collection_data.setdefault('playCount', 0)
        collection_data.setdefault('likeCount', 0)
        collection_data.setdefault('songIds', [])
        collection_data.setdefault('songCount', len(collection_data.get('songIds', [])))
        collection_data.setdefault('isFeatured', False)
        collection_data.setdefault('isOfficial', False)
        collection_data.setdefault('tags', [])
        collection_data.setdefault('coverGradient', ['#667eea', '#764ba2'])
        
        collections.append(collection_data)
        self.save_data(self.filepath, collections)
        return collection_data
    
    def update(self, collection_id: str, updates: Dict) -> Optional[Dict]:
        """更新合集"""
        collections = self.get_all()
        for i, collection in enumerate(collections):
            if collection.get('id') == collection_id:
                collection.update(updates)
                collection['updateTime'] = self.get_timestamp()
                if 'songIds' in updates:
                    collection['songCount'] = len(updates['songIds'])
                collections[i] = collection
                self.save_data(self.filepath, collections)
                return collection
        return None
    
    def delete(self, collection_id: str) -> bool:
        """删除合集"""
        collections = self.get_all()
        filtered = [c for c in collections if c.get('id') != collection_id]
        if len(filtered) < len(collections):
            self.save_data(self.filepath, filtered)
            return True
        return False
    
    def add_song(self, collection_id: str, song_id: str) -> bool:
        """向合集添加曲谱"""
        collection = self.get_by_id(collection_id)
        if collection:
            song_ids = collection.get('songIds', [])
            if song_id not in song_ids:
                song_ids.append(song_id)
                self.update(collection_id, {'songIds': song_ids})
                return True
        return False
    
    def remove_song(self, collection_id: str, song_id: str) -> bool:
        """从合集移除曲谱"""
        collection = self.get_by_id(collection_id)
        if collection:
            song_ids = collection.get('songIds', [])
            if song_id in song_ids:
                song_ids.remove(song_id)
                self.update(collection_id, {'songIds': song_ids})
                return True
        return False


class BannerManager(DataManager):
    """Banner管理器"""
    
    def __init__(self):
        super().__init__()
        self.filepath = BANNERS_FILE
    
    def get_all(self) -> List[Dict]:
        """获取所有Banner"""
        return self.load_data(self.filepath)
    
    def get_active(self) -> List[Dict]:
        """获取激活的Banner"""
        banners = self.get_all()
        return sorted(
            [b for b in banners if b.get('isActive', True)],
            key=lambda x: x.get('order', 0)
        )
    
    def add(self, banner_data: Dict) -> Dict:
        """添加新Banner"""
        banners = self.get_all()
        
        banner_data['id'] = self.generate_id('banner')
        banner_data['createTime'] = self.get_timestamp()
        
        banner_data.setdefault('isActive', True)
        banner_data.setdefault('order', len(banners) + 1)
        banner_data.setdefault('gradient', ['#667eea', '#764ba2'])
        
        banners.append(banner_data)
        self.save_data(self.filepath, banners)
        return banner_data
    
    def update(self, banner_id: str, updates: Dict) -> Optional[Dict]:
        """更新Banner"""
        banners = self.get_all()
        for i, banner in enumerate(banners):
            if banner.get('id') == banner_id:
                banner.update(updates)
                banners[i] = banner
                self.save_data(self.filepath, banners)
                return banner
        return None
    
    def delete(self, banner_id: str) -> bool:
        """删除Banner"""
        banners = self.get_all()
        filtered = [b for b in banners if b.get('id') != banner_id]
        if len(filtered) < len(banners):
            self.save_data(self.filepath, filtered)
            return True
        return False


# ============ Web 管理界面 ============

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>星轨乐库 - 后台管理</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #314D63 0%, #1E3A4C 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px; }
        .header h1 { font-size: 28px; margin-bottom: 8px; }
        .header p { opacity: 0.8; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 12px 24px; border-radius: 8px; cursor: pointer; background: white; border: 2px solid #e0e0e0; }
        .tab.active { background: #314D63; color: white; border-color: #314D63; }
        .card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .card-title { font-size: 18px; font-weight: 600; }
        .btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #314D63; color: white; }
        .btn-danger { background: #ef4444; color: white; }
        .btn-secondary { background: #e5e7eb; color: #374151; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: #e5e7eb; margin-right: 4px; }
        .tag.vip { background: #fef3c7; color: #d97706; }
        .tag.featured { background: #dbeafe; color: #2563eb; }
        .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; }
        .modal.active { display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; border-radius: 16px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; }
        .form-row { display: flex; gap: 15px; }
        .form-row .form-group { flex: 1; }
        .actions { display: flex; gap: 10px; }
        .stats { display: flex; gap: 20px; margin-bottom: 30px; }
        .stat-card { flex: 1; background: white; padding: 20px; border-radius: 12px; text-align: center; }
        .stat-value { font-size: 36px; font-weight: 700; color: #314D63; }
        .stat-label { color: #6b7280; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 星轨乐库 - 后台管理</h1>
            <p>管理曲谱、制谱人、合集和轮播Banner数据</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value" id="songCount">-</div>
                <div class="stat-label">曲谱总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="artistCount">-</div>
                <div class="stat-label">制谱人数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="collectionCount">-</div>
                <div class="stat-label">合集数量</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="bannerCount">-</div>
                <div class="stat-label">Banner数</div>
            </div>
        </div>
        
        <div class="tabs">
            <div class="tab active" onclick="switchTab('songs')">曲谱管理</div>
            <div class="tab" onclick="switchTab('artists')">制谱人管理</div>
            <div class="tab" onclick="switchTab('collections')">合集管理</div>
            <div class="tab" onclick="switchTab('banners')">Banner管理</div>
        </div>
        
        <div id="content">
            <!-- 动态内容 -->
        </div>
    </div>
    
    <!-- 新建/编辑曲谱弹窗 -->
    <div class="modal" id="songModal">
        <div class="modal-content">
            <h2 style="margin-bottom: 20px;">新建曲谱</h2>
            <form id="songForm">
                <input type="hidden" name="id">
                <div class="form-row">
                    <div class="form-group">
                        <label>曲名 *</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>副标题</label>
                        <input type="text" name="subtitle">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>制谱人ID *</label>
                        <select name="artistId" required></select>
                    </div>
                    <div class="form-group">
                        <label>制谱人名</label>
                        <input type="text" name="artistName" readonly>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>主音</label>
                        <select name="rootNote">
                            <option>C</option><option>C#</option><option selected>D</option><option>D#</option>
                            <option>E</option><option>F</option><option>F#</option><option>G</option>
                            <option>G#</option><option>A</option><option>A#</option><option>B</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>音阶</label>
                        <input type="text" name="scaleType" value="Kurd">
                    </div>
                    <div class="form-group">
                        <label>音位数</label>
                        <input type="number" name="noteCount" value="10" min="7" max="25">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>速度 (BPM)</label>
                        <input type="number" name="tempo" value="60" min="20" max="300">
                    </div>
                    <div class="form-group">
                        <label>难度</label>
                        <select name="difficulty">
                            <option value="1">1 - 入门</option>
                            <option value="2">2 - 简单</option>
                            <option value="3" selected>3 - 中等</option>
                            <option value="4">4 - 进阶</option>
                            <option value="5">5 - 高级</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>时长</label>
                        <input type="text" name="duration" placeholder="3:45">
                    </div>
                </div>
                <div class="form-group">
                    <label>标签 (逗号分隔)</label>
                    <input type="text" name="tags" placeholder="冥想, 治愈, 入门">
                </div>
                <div class="form-group">
                    <label>简介</label>
                    <textarea name="introduction" rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><input type="checkbox" name="isVip"> VIP曲谱</label>
                    </div>
                    <div class="form-group">
                        <label><input type="checkbox" name="isFeatured"> 精选推荐</label>
                    </div>
                    <div class="form-group">
                        <label><input type="checkbox" name="isNew" checked> 标记为新曲</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>谱面代码</label>
                    <textarea name="code" rows="5" placeholder="\\begin{module}{A-1}..."></textarea>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('songModal')">取消</button>
                    <button type="submit" class="btn btn-primary">保存</button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        let currentTab = 'songs';
        let data = { songs: [], artists: [], collections: [], banners: [] };
        
        // 初始化
        async function init() {
            await loadAllData();
            updateStats();
            renderContent();
        }
        
        // 加载所有数据
        async function loadAllData() {
            const response = await fetch('/api/data');
            data = await response.json();
        }
        
        // 更新统计
        function updateStats() {
            document.getElementById('songCount').textContent = data.songs.length;
            document.getElementById('artistCount').textContent = data.artists.length;
            document.getElementById('collectionCount').textContent = data.collections.length;
            document.getElementById('bannerCount').textContent = data.banners.length;
        }
        
        // 切换标签
        function switchTab(tab) {
            currentTab = tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
            renderContent();
        }
        
        // 渲染内容
        function renderContent() {
            const content = document.getElementById('content');
            
            switch(currentTab) {
                case 'songs':
                    renderSongs(content);
                    break;
                case 'artists':
                    renderArtists(content);
                    break;
                case 'collections':
                    renderCollections(content);
                    break;
                case 'banners':
                    renderBanners(content);
                    break;
            }
        }
        
        // 渲染曲谱列表
        function renderSongs(container) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">曲谱列表 (${data.songs.length})</span>
                        <button class="btn btn-primary" onclick="openSongModal()">+ 新建曲谱</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>曲名</th>
                                <th>制谱人</th>
                                <th>调式</th>
                                <th>难度</th>
                                <th>标签</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.songs.map(song => `
                                <tr>
                                    <td>
                                        <strong>${song.title}</strong>
                                        <br><small style="color:#666">${song.subtitle || ''}</small>
                                    </td>
                                    <td>${song.artistName || '-'}</td>
                                    <td>${song.rootNote}-${song.scaleType}</td>
                                    <td>${'★'.repeat(song.difficulty || 1)}${'☆'.repeat(5-(song.difficulty || 1))}</td>
                                    <td>
                                        ${song.isVip ? '<span class="tag vip">VIP</span>' : ''}
                                        ${song.isFeatured ? '<span class="tag featured">精选</span>' : ''}
                                        ${(song.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                                    </td>
                                    <td class="actions">
                                        <button class="btn btn-secondary" onclick="editSong('${song.id}')">编辑</button>
                                        <button class="btn btn-danger" onclick="deleteSong('${song.id}')">删除</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // 渲染制谱人列表
        function renderArtists(container) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">制谱人列表 (${data.artists.length})</span>
                        <button class="btn btn-primary" onclick="alert('TODO: 新建制谱人')">+ 新建制谱人</button>
                    </div>
                    <table>
                        <thead>
                            <tr><th>名称</th><th>头衔</th><th>曲谱数</th><th>关注数</th><th>认证</th><th>操作</th></tr>
                        </thead>
                        <tbody>
                            ${data.artists.map(a => `
                                <tr>
                                    <td><strong>${a.name}</strong></td>
                                    <td>${a.title || '-'}</td>
                                    <td>${a.songCount || 0}</td>
                                    <td>${a.followers || 0}</td>
                                    <td>${a.isVerified ? '✓ 已认证' : '-'}</td>
                                    <td class="actions">
                                        <button class="btn btn-secondary" onclick="alert('TODO')">编辑</button>
                                        <button class="btn btn-danger" onclick="deleteArtist('${a.id}')">删除</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // 渲染合集列表
        function renderCollections(container) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">合集列表 (${data.collections.length})</span>
                        <button class="btn btn-primary" onclick="alert('TODO: 新建合集')">+ 新建合集</button>
                    </div>
                    <table>
                        <thead>
                            <tr><th>名称</th><th>曲谱数</th><th>播放量</th><th>状态</th><th>操作</th></tr>
                        </thead>
                        <tbody>
                            ${data.collections.map(c => `
                                <tr>
                                    <td><strong>${c.title}</strong></td>
                                    <td>${c.songCount || 0}首</td>
                                    <td>${c.playCount || 0}</td>
                                    <td>
                                        ${c.isFeatured ? '<span class="tag featured">精选</span>' : ''}
                                        ${c.isOfficial ? '<span class="tag">官方</span>' : ''}
                                    </td>
                                    <td class="actions">
                                        <button class="btn btn-secondary" onclick="alert('TODO')">编辑</button>
                                        <button class="btn btn-danger" onclick="deleteCollection('${c.id}')">删除</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // 渲染Banner列表
        function renderBanners(container) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Banner列表 (${data.banners.length})</span>
                        <button class="btn btn-primary" onclick="alert('TODO: 新建Banner')">+ 新建Banner</button>
                    </div>
                    <table>
                        <thead>
                            <tr><th>标题</th><th>类型</th><th>排序</th><th>状态</th><th>操作</th></tr>
                        </thead>
                        <tbody>
                            ${data.banners.map(b => `
                                <tr>
                                    <td><strong>${b.title}</strong><br><small>${b.subtitle || ''}</small></td>
                                    <td>${b.type || '-'}</td>
                                    <td>${b.order || 0}</td>
                                    <td>${b.isActive ? '<span class="tag featured">激活</span>' : '<span class="tag">未激活</span>'}</td>
                                    <td class="actions">
                                        <button class="btn btn-secondary" onclick="alert('TODO')">编辑</button>
                                        <button class="btn btn-danger" onclick="deleteBanner('${b.id}')">删除</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // 打开新建曲谱弹窗
        function openSongModal(songId) {
            const modal = document.getElementById('songModal');
            const form = document.getElementById('songForm');
            const artistSelect = form.querySelector('[name="artistId"]');
            
            // 填充制谱人选项
            artistSelect.innerHTML = data.artists.map(a => 
                `<option value="${a.id}">${a.name}</option>`
            ).join('');
            
            // 制谱人选择变化时自动填充名称
            artistSelect.onchange = function() {
                const artist = data.artists.find(a => a.id === this.value);
                form.querySelector('[name="artistName"]').value = artist ? artist.name : '';
            };
            artistSelect.dispatchEvent(new Event('change'));
            
            // 如果是编辑模式，填充数据
            if (songId) {
                const song = data.songs.find(s => s.id === songId);
                if (song) {
                    form.querySelector('[name="id"]').value = song.id;
                    form.querySelector('[name="title"]').value = song.title || '';
                    form.querySelector('[name="subtitle"]').value = song.subtitle || '';
                    form.querySelector('[name="artistId"]').value = song.artistId || '';
                    form.querySelector('[name="artistName"]').value = song.artistName || '';
                    form.querySelector('[name="rootNote"]').value = song.rootNote || 'D';
                    form.querySelector('[name="scaleType"]').value = song.scaleType || 'Kurd';
                    form.querySelector('[name="noteCount"]').value = song.noteCount || 10;
                    form.querySelector('[name="tempo"]').value = song.tempo || 60;
                    form.querySelector('[name="difficulty"]').value = song.difficulty || 3;
                    form.querySelector('[name="duration"]').value = song.duration || '';
                    form.querySelector('[name="tags"]').value = (song.tags || []).join(', ');
                    form.querySelector('[name="introduction"]').value = song.introduction || '';
                    form.querySelector('[name="isVip"]').checked = song.isVip || false;
                    form.querySelector('[name="isFeatured"]').checked = song.isFeatured || false;
                    form.querySelector('[name="isNew"]').checked = song.isNew || false;
                    form.querySelector('[name="code"]').value = song.code || '';
                }
            } else {
                form.reset();
                form.querySelector('[name="id"]').value = '';
            }
            
            modal.classList.add('active');
        }
        
        function editSong(id) {
            openSongModal(id);
        }
        
        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
        }
        
        // 表单提交
        document.getElementById('songForm').onsubmit = async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const songData = {
                title: formData.get('title'),
                subtitle: formData.get('subtitle'),
                artistId: formData.get('artistId'),
                artistName: formData.get('artistName'),
                rootNote: formData.get('rootNote'),
                scaleType: formData.get('scaleType'),
                noteCount: parseInt(formData.get('noteCount')) || 10,
                tempo: parseInt(formData.get('tempo')) || 60,
                difficulty: parseInt(formData.get('difficulty')) || 3,
                duration: formData.get('duration'),
                tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t),
                introduction: formData.get('introduction'),
                isVip: formData.get('isVip') === 'on',
                isFeatured: formData.get('isFeatured') === 'on',
                isNew: formData.get('isNew') === 'on',
                code: formData.get('code')
            };
            
            const id = formData.get('id');
            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/songs/${id}` : '/api/songs';
            
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(songData)
            });
            
            closeModal('songModal');
            await loadAllData();
            updateStats();
            renderContent();
        };
        
        // 删除操作
        async function deleteSong(id) {
            if (!confirm('确定要删除这首曲谱吗？')) return;
            await fetch(`/api/songs/${id}`, { method: 'DELETE' });
            await loadAllData();
            updateStats();
            renderContent();
        }
        
        async function deleteArtist(id) {
            if (!confirm('确定要删除这个制谱人吗？')) return;
            await fetch(`/api/artists/${id}`, { method: 'DELETE' });
            await loadAllData();
            updateStats();
            renderContent();
        }
        
        async function deleteCollection(id) {
            if (!confirm('确定要删除这个合集吗？')) return;
            await fetch(`/api/collections/${id}`, { method: 'DELETE' });
            await loadAllData();
            updateStats();
            renderContent();
        }
        
        async function deleteBanner(id) {
            if (!confirm('确定要删除这个Banner吗？')) return;
            await fetch(`/api/banners/${id}`, { method: 'DELETE' });
            await loadAllData();
            updateStats();
            renderContent();
        }
        
        // 启动
        init();
    </script>
</body>
</html>
'''


class AdminRequestHandler(BaseHTTPRequestHandler):
    """HTTP请求处理器"""
    
    song_manager = SongManager()
    artist_manager = ArtistManager()
    collection_manager = CollectionManager()
    banner_manager = BannerManager()
    
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        if path == '/':
            self.send_html(HTML_TEMPLATE)
        elif path == '/api/data':
            self.send_json({
                'songs': self.song_manager.get_all(),
                'artists': self.artist_manager.get_all(),
                'collections': self.collection_manager.get_all(),
                'banners': self.banner_manager.get_all()
            })
        elif path.startswith('/api/songs'):
            self.send_json(self.song_manager.get_all())
        elif path.startswith('/api/artists'):
            self.send_json(self.artist_manager.get_all())
        elif path.startswith('/api/collections'):
            self.send_json(self.collection_manager.get_all())
        elif path.startswith('/api/banners'):
            self.send_json(self.banner_manager.get_all())
        else:
            self.send_error(404)
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = json.loads(body) if body else {}
        
        if self.path == '/api/songs':
            result = self.song_manager.add(data)
            self.send_json(result)
        elif self.path == '/api/artists':
            result = self.artist_manager.add(data)
            self.send_json(result)
        elif self.path == '/api/collections':
            result = self.collection_manager.add(data)
            self.send_json(result)
        elif self.path == '/api/banners':
            result = self.banner_manager.add(data)
            self.send_json(result)
        else:
            self.send_error(404)
    
    def do_PUT(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = json.loads(body) if body else {}
        
        parts = self.path.split('/')
        if len(parts) >= 4:
            resource = parts[2]
            item_id = parts[3]
            
            if resource == 'songs':
                result = self.song_manager.update(item_id, data)
            elif resource == 'artists':
                result = self.artist_manager.update(item_id, data)
            elif resource == 'collections':
                result = self.collection_manager.update(item_id, data)
            elif resource == 'banners':
                result = self.banner_manager.update(item_id, data)
            else:
                self.send_error(404)
                return
            
            if result:
                self.send_json(result)
            else:
                self.send_error(404)
        else:
            self.send_error(400)
    
    def do_DELETE(self):
        parts = self.path.split('/')
        if len(parts) >= 4:
            resource = parts[2]
            item_id = parts[3]
            
            if resource == 'songs':
                success = self.song_manager.delete(item_id)
            elif resource == 'artists':
                success = self.artist_manager.delete(item_id)
            elif resource == 'collections':
                success = self.collection_manager.delete(item_id)
            elif resource == 'banners':
                success = self.banner_manager.delete(item_id)
            else:
                self.send_error(404)
                return
            
            if success:
                self.send_json({'success': True})
            else:
                self.send_error(404)
        else:
            self.send_error(400)
    
    def send_html(self, content):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(content.encode('utf-8'))
    
    def send_json(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def log_message(self, format, *args):
        pass  # 禁止日志输出


def run_server(port=8888):
    """启动管理后台服务器"""
    server = HTTPServer(('localhost', port), AdminRequestHandler)
    print(f"\n{'='*50}")
    print(f"🎵 星轨乐库 - 后台管理系统")
    print(f"{'='*50}")
    print(f"\n服务已启动: http://localhost:{port}")
    print(f"\n按 Ctrl+C 停止服务\n")
    
    # 自动打开浏览器
    threading.Timer(1, lambda: webbrowser.open(f'http://localhost:{port}')).start()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已停止")
        server.server_close()


if __name__ == '__main__':
    run_server()
