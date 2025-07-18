import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Linking } from 'react-native';
import { GAME_CONSTANTS, DIFFICULTY_SETTINGS } from '../constants/gameConstants';
import { FRUITS_BASE } from '../constants/fruits';
import { getAudioService } from '../services/AudioService';
import { NICKNAME_WORDS } from '../constants/nicknameWords';

// 플랫폼별 저장소 처리
const Storage = {
  async getItem(key: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // 웹 환경
        return localStorage.getItem(key);
      }
      // 모바일 환경에서는 AsyncStorage를 사용해야 함
      return null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  
  async setItem(key: string, value: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // 웹 환경
        localStorage.setItem(key, value);
        return true;
      }
      // 모바일 환경에서는 AsyncStorage를 사용해야 함
      return false;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }
};

interface GameAppProps {
  isWeb?: boolean;
}

const GameApp: React.FC<GameAppProps> = ({ isWeb = false }) => {
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    timeLeft: 0,
    isPlaying: false,
    gameMode: 'normal',
    currentFruit: null,
    fruits: []
  });

  const [showMenu, setShowMenu] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [audioService] = useState(() => getAudioService());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(0.5);
  const [effectVolume, setEffectVolume] = useState(0.7);
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const [isEffectMuted, setIsEffectMuted] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [todayBestScore, setTodayBestScore] = useState(0);

  // 앱 시작 시 닉네임 체크
  useEffect(() => {
    const loadPlayerName = async () => {
      const savedName = await Storage.getItem('playerName');
      if (!savedName) {
        setShowNicknameModal(true);
        setTempNickname('');
      } else {
        setPlayerName(savedName);
      }
    };
    
    loadPlayerName();
  }, []);

  const generateRandomNickname = () => {
    const adjectives = NICKNAME_WORDS.adjectives;
    const nouns = NICKNAME_WORDS.nouns;
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `${randomAdj}${randomNoun}${randomNum}`;
  };

  const savePlayerName = async (name: string) => {
    if (!name.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    
    if (name === playerName) {
      setNicknameError('동일한 닉네임입니다.');
      return;
    }
    
    const success = await Storage.setItem('playerName', name);
    if (success) {
      setPlayerName(name);
      setShowNicknameModal(false);
      setNicknameError('');
      setTempNickname('');
    } else {
      setNicknameError('닉네임 저장에 실패했습니다.');
    }
  };

  const openDeveloperPage = (platform: string) => {
    const urls = {
      instagram: 'https://www.instagram.com/your_developer_account',
      youtube: 'https://www.youtube.com/@your_developer_channel'
    };
    
    if (isWeb) {
      window.open(urls[platform as keyof typeof urls], '_blank');
    } else {
      Linking.openURL(urls[platform as keyof typeof urls]);
    }
  };

  const clearCache = async () => {
    const confirmDelete = isWeb 
      ? confirm('캐시를 삭제하시겠습니까? 모든 설정과 기록이 초기화됩니다.')
      : await new Promise(resolve => {
          Alert.alert(
            '캐시 삭제',
            '캐시를 삭제하시겠습니까? 모든 설정과 기록이 초기화됩니다.',
            [
              { text: '취소', style: 'cancel', onPress: () => resolve(false) },
              { text: '삭제', style: 'destructive', onPress: () => resolve(true) }
            ]
          );
        });

    if (confirmDelete) {
      await Storage.setItem('playerName', '');
      setPlayerName('');
      setBgmVolume(0.5);
      setEffectVolume(0.7);
      setIsBgmMuted(false);
      setIsEffectMuted(false);
      setTodayBestScore(0);
      setShowMenuModal(false);
      setShowNicknameModal(true);
      
      if (isWeb) {
        alert('캐시가 삭제되었습니다.');
      } else {
        Alert.alert('완료', '캐시가 삭제되었습니다.');
      }
    }
  };

  // 웹과 모바일 공통 UI 로직
  // 실제 렌더링은 각 플랫폼에서 구현
  return {
    gameState,
    showMenu,
    showMenuModal,
    setShowMenuModal,
    showNicknameModal,
    setShowNicknameModal,
    playerName,
    tempNickname,
    setTempNickname,
    nicknameError,
    todayBestScore,
    bgmVolume,
    effectVolume,
    isBgmMuted,
    isEffectMuted,
    generateRandomNickname,
    savePlayerName,
    openDeveloperPage,
    clearCache,
    // 기타 필요한 함수들...
  };
};

export default GameApp;