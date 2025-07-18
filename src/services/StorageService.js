import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  constructor() {
    this.isInitialized = true;
    this.storageKeys = {
      GAME_DATA: 'gameData',
      SETTINGS: 'settings',
      NICKNAME: 'nickname',
      BEST_SCORE: 'bestScore',
      PLAY_STATS: 'playStats',
      FRUIT_COLLECTION: 'fruitCollection',
      AUDIO_SETTINGS: 'audioSettings',
      PREFERENCES: 'preferences'
    };
    
    console.log('✅ StorageService 초기화 완료');
  }

  // 기본 저장 함수
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`💾 저장 완료: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ 저장 실패: ${key}`, error);
      return false;
    }
  }

  // 기본 불러오기 함수
  async getItem(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const value = jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
      console.log(`📂 불러오기 완료: ${key}`);
      return value;
    } catch (error) {
      console.error(`❌ 불러오기 실패: ${key}`, error);
      return defaultValue;
    }
  }

  // 기본 삭제 함수
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ 삭제 완료: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ 삭제 실패: ${key}`, error);
      return false;
    }
  }

  // 닉네임 저장/불러오기
  async saveNickname(nickname) {
    return await this.setItem(this.storageKeys.NICKNAME, nickname);
  }

  async getNickname() {
    return await this.getItem(this.storageKeys.NICKNAME, '');
  }

  // 최고 점수 저장/불러오기
  async saveBestScore(score) {
    const currentBest = await this.getBestScore();
    if (score > currentBest) {
      return await this.setItem(this.storageKeys.BEST_SCORE, score);
    }
    return false;
  }

  async getBestScore() {
    return await this.getItem(this.storageKeys.BEST_SCORE, 0);
  }

  // 플레이 통계 저장/불러오기
  async savePlayStats(stats) {
    const currentStats = await this.getPlayStats();
    const updatedStats = {
      ...currentStats,
      ...stats,
      gamesPlayed: (currentStats.gamesPlayed || 0) + (stats.gamesPlayed || 0),
      totalPlayTime: (currentStats.totalPlayTime || 0) + (stats.totalPlayTime || 0),
      totalMerges: (currentStats.totalMerges || 0) + (stats.totalMerges || 0),
      highestFruit: Math.max(currentStats.highestFruit || 0, stats.highestFruit || 0),
      lastPlayDate: new Date().toISOString()
    };
    
    return await this.setItem(this.storageKeys.PLAY_STATS, updatedStats);
  }

  async getPlayStats() {
    return await this.getItem(this.storageKeys.PLAY_STATS, {
      gamesPlayed: 0,
      totalPlayTime: 0,
      totalMerges: 0,
      highestFruit: 0,
      lastPlayDate: null
    });
  }

  // 과일 컬렉션 저장/불러오기
  async saveFruitCollection(collection) {
    const collectionArray = Array.isArray(collection) ? collection : Array.from(collection);
    return await this.setItem(this.storageKeys.FRUIT_COLLECTION, collectionArray);
  }

  async getFruitCollection() {
    const collection = await this.getItem(this.storageKeys.FRUIT_COLLECTION, []);
    return new Set(collection);
  }

  async addToFruitCollection(fruitId) {
    const collection = await this.getFruitCollection();
    collection.add(fruitId);
    return await this.saveFruitCollection(collection);
  }

  // 오디오 설정 저장/불러오기
  async saveAudioSettings(settings) {
    return await this.setItem(this.storageKeys.AUDIO_SETTINGS, settings);
  }

  async getAudioSettings() {
    return await this.getItem(this.storageKeys.AUDIO_SETTINGS, {
      musicVolume: 0.3,
      effectVolume: 0.5,
      isMusicEnabled: true,
      isEffectEnabled: true
    });
  }

  // 게임 설정 저장/불러오기
  async saveSettings(settings) {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    return await this.setItem(this.storageKeys.SETTINGS, updatedSettings);
  }

  async getSettings() {
    return await this.getItem(this.storageKeys.SETTINGS, {
      difficulty: 'normal',
      showTutorial: true,
      enableHapticFeedback: true,
      enableScreenWake: true,
      theme: 'light'
    });
  }

  // 사용자 선호 설정 저장/불러오기
  async savePreferences(preferences) {
    const currentPrefs = await this.getPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    return await this.setItem(this.storageKeys.PREFERENCES, updatedPrefs);
  }

  async getPreferences() {
    return await this.getItem(this.storageKeys.PREFERENCES, {
      language: 'ko',
      notifications: true,
      autoSave: true,
      cloudSync: false
    });
  }

  // 전체 게임 데이터 저장/불러오기
  async saveGameData(gameData) {
    const dataToSave = {
      ...gameData,
      lastSaved: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return await this.setItem(this.storageKeys.GAME_DATA, dataToSave);
  }

  async getGameData() {
    return await this.getItem(this.storageKeys.GAME_DATA, {
      nickname: '',
      bestScore: 0,
      playStats: {
        gamesPlayed: 0,
        totalPlayTime: 0,
        totalMerges: 0,
        highestFruit: 0
      },
      fruitCollection: [],
      audioSettings: {
        musicVolume: 0.3,
        effectVolume: 0.5,
        isMusicEnabled: true,
        isEffectEnabled: true
      },
      settings: {
        difficulty: 'normal',
        showTutorial: true,
        enableHapticFeedback: true,
        enableScreenWake: true,
        theme: 'light'
      },
      preferences: {
        language: 'ko',
        notifications: true,
        autoSave: true,
        cloudSync: false
      },
      lastSaved: null,
      version: '1.0.0'
    });
  }

  // 모든 저장소 키 조회
  async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('📋 모든 저장소 키:', keys);
      return keys;
    } catch (error) {
      console.error('❌ 키 조회 실패:', error);
      return [];
    }
  }

  // 다중 항목 저장
  async multiSet(keyValuePairs) {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
      await AsyncStorage.multiSet(pairs);
      console.log('💾 다중 저장 완료');
      return true;
    } catch (error) {
      console.error('❌ 다중 저장 실패:', error);
      return false;
    }
  }

  // 다중 항목 불러오기
  async multiGet(keys, defaultValues = {}) {
    try {
      const results = await AsyncStorage.multiGet(keys);
      const data = {};
      
      results.forEach(([key, value]) => {
        data[key] = value != null ? JSON.parse(value) : (defaultValues[key] || null);
      });
      
      console.log('📂 다중 불러오기 완료');
      return data;
    } catch (error) {
      console.error('❌ 다중 불러오기 실패:', error);
      return defaultValues;
    }
  }

  // 전체 데이터 초기화
  async clearAll() {
    try {
      await AsyncStorage.clear();
      console.log('🗑️ 전체 데이터 초기화 완료');
      return true;
    } catch (error) {
      console.error('❌ 데이터 초기화 실패:', error);
      return false;
    }
  }

  // 게임 데이터만 초기화 (설정 유지)
  async clearGameData() {
    try {
      const keysToRemove = [
        this.storageKeys.BEST_SCORE,
        this.storageKeys.PLAY_STATS,
        this.storageKeys.FRUIT_COLLECTION,
        this.storageKeys.GAME_DATA
      ];
      
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('🗑️ 게임 데이터 초기화 완료');
      return true;
    } catch (error) {
      console.error('❌ 게임 데이터 초기화 실패:', error);
      return false;
    }
  }

  // 저장소 상태 확인
  async getStorageInfo() {
    try {
      const keys = await this.getAllKeys();
      const gameKeys = keys.filter(key => Object.values(this.storageKeys).includes(key));
      
      const info = {
        totalKeys: keys.length,
        gameKeys: gameKeys.length,
        storageKeys: gameKeys,
        lastChecked: new Date().toISOString()
      };
      
      console.log('ℹ️ 저장소 정보:', info);
      return info;
    } catch (error) {
      console.error('❌ 저장소 정보 조회 실패:', error);
      return null;
    }
  }

  // 데이터 백업
  async backupData() {
    try {
      const gameData = await this.getGameData();
      const audioSettings = await this.getAudioSettings();
      const settings = await this.getSettings();
      const preferences = await this.getPreferences();
      
      const backup = {
        gameData,
        audioSettings,
        settings,
        preferences,
        backupDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      console.log('💾 데이터 백업 완료');
      return backup;
    } catch (error) {
      console.error('❌ 데이터 백업 실패:', error);
      return null;
    }
  }

  // 데이터 복원
  async restoreData(backup) {
    try {
      if (!backup || !backup.version) {
        throw new Error('유효하지 않은 백업 데이터');
      }
      
      const { gameData, audioSettings, settings, preferences } = backup;
      
      await this.multiSet([
        [this.storageKeys.GAME_DATA, gameData],
        [this.storageKeys.AUDIO_SETTINGS, audioSettings],
        [this.storageKeys.SETTINGS, settings],
        [this.storageKeys.PREFERENCES, preferences]
      ]);
      
      console.log('📂 데이터 복원 완료');
      return true;
    } catch (error) {
      console.error('❌ 데이터 복원 실패:', error);
      return false;
    }
  }

  // 리소스 정리
  dispose() {
    this.isInitialized = false;
    console.log('🗄️ StorageService 리소스 해제');
  }
}

// 싱글톤 인스턴스
let storageServiceInstance = null;

export const getStorageService = () => {
  if (!storageServiceInstance) {
    storageServiceInstance = new StorageService();
  }
  return storageServiceInstance;
};

export const disposeStorageService = () => {
  if (storageServiceInstance) {
    storageServiceInstance.dispose();
    storageServiceInstance = null;
  }
};