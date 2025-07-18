import React, { useState, useEffect } from 'react';
import { GAME_CONSTANTS, DIFFICULTY_SETTINGS } from './src/constants/gameConstants';
import { FRUITS_BASE } from './src/constants/fruits';
import { getAudioService } from './src/services/AudioService';
import { NICKNAME_WORDS } from './src/constants/nicknameWords';

// 플랫폼별 저장소 처리
const Storage = {
  async getItem(key) {
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
  
  async setItem(key, value) {
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

const App = () => {
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
  const [showGameSelectModal, setShowGameSelectModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
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

  const startGame = (difficulty) => {
    setSelectedDifficulty(difficulty);
    const difficultySettings = DIFFICULTY_SETTINGS[difficulty];
    
    setGameState({
      score: 0,
      level: 1,
      timeLeft: difficultySettings?.timeLimit || 0,
      isPlaying: true,
      gameMode: difficulty,
      currentFruit: FRUITS_BASE[0],
      fruits: []
    });
    
    // 모든 모달 닫기
    setShowMenu(false);
    setShowGameSelectModal(false);
    setShowChallengeModal(false);
    
    // 게임 시작 시 배경음악 재생
    if (audioService && isAudioEnabled) {
      audioService.playBackgroundMusic();
    }
  };

  const openGameSelect = () => {
    setShowGameSelectModal(true);
  };

  const openChallengeSelect = () => {
    setShowChallengeModal(true);
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      timeLeft: 0,
      isPlaying: false,
      gameMode: 'normal',
      currentFruit: null,
      fruits: []
    });
    setShowMenu(true);
    
    // 메뉴로 돌아갈 때 배경음악 정지
    if (audioService) {
      audioService.stopBackgroundMusic();
    }
  };

  const toggleAudio = () => {
    if (audioService) {
      const newState = audioService.toggleEnabled();
      setIsAudioEnabled(newState);
    }
  };

  const handleBgmVolumeChange = (volume) => {
    setBgmVolume(volume);
    if (audioService) {
      audioService.setVolume(isBgmMuted ? 0 : volume);
    }
  };

  const handleEffectVolumeChange = (volume) => {
    setEffectVolume(volume);
    // 효과음 볼륨 설정 (추후 구현)
  };

  const toggleBgmMute = () => {
    const newMuted = !isBgmMuted;
    setIsBgmMuted(newMuted);
    if (audioService) {
      audioService.setVolume(newMuted ? 0 : bgmVolume);
    }
  };

  const toggleEffectMute = () => {
    setIsEffectMuted(!isEffectMuted);
    // 효과음 음소거 설정 (추후 구현)
  };

  const clearCache = async () => {
    if (confirm('캐시를 삭제하시겠습니까? 모든 설정과 기록이 초기화됩니다.')) {
      await Storage.setItem('playerName', '');
      setPlayerName('');
      setBgmVolume(0.5);
      setEffectVolume(0.7);
      setIsBgmMuted(false);
      setIsEffectMuted(false);
      setTodayBestScore(0);
      setShowMenuModal(false);
      setShowNicknameModal(true);
      alert('캐시가 삭제되었습니다.');
    }
  };

  const openDeveloperPage = (platform) => {
    switch (platform) {
      case 'instagram':
        window.open('https://www.instagram.com/your_developer_account', '_blank');
        break;
      case 'youtube':
        window.open('https://www.youtube.com/@your_developer_channel', '_blank');
        break;
      default:
        break;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateRandomNickname = () => {
    const adjectives = NICKNAME_WORDS.adjectives;
    const nouns = NICKNAME_WORDS.nouns;
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `${randomAdj}${randomNoun}${randomNum}`;
  };

  const savePlayerName = async (name) => {
    if (!name.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    
    // 동일한 닉네임 체크 (현재 닉네임과 같은 경우)
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

  const openNicknameModal = () => {
    setTempNickname(playerName);
    setNicknameError('');
    setShowNicknameModal(true);
  };

  const closeNicknameModal = () => {
    // 닉네임이 없는 경우 모달을 닫을 수 없음
    if (!playerName) return;
    
    setShowNicknameModal(false);
    setNicknameError('');
    setTempNickname('');
  };

  if (showMenu) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: GAME_CONSTANTS.COLORS.BACKGROUND,
        backgroundImage: 'url(/src/assets/images/backgrounds/main_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
      }}>
        {/* 우측 상단 메뉴 버튼 */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100
        }}>
          <button
            onClick={() => setShowMenuModal(true)}
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ☰ 메뉴
          </button>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          {/* 타이틀 제거됨 */}
        </div>

        {/* 하단 영역 */}
        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* 닉네임과 최고점수 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '0 20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div 
                onClick={openNicknameModal}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#45a049';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4CAF50';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {playerName || '플레이어'} ✏️
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ color: '#666', fontSize: '14px' }}>오늘 최고점수:</span>
              <div style={{
                backgroundColor: '#FF9800',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {todayBestScore.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 게임 모드 버튼 */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <button
              onClick={openGameSelect}
              style={{
                flex: 1,
                maxWidth: '180px',
                padding: '20px 30px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 12px rgba(76, 175, 80, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 16px rgba(76, 175, 80, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 12px rgba(76, 175, 80, 0.4)';
              }}
            >
              🎮 일반
            </button>
            <button
              onClick={openChallengeSelect}
              style={{
                flex: 1,
                maxWidth: '180px',
                padding: '20px 30px',
                backgroundColor: '#FF5722',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 12px rgba(255, 87, 34, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 16px rgba(255, 87, 34, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 12px rgba(255, 87, 34, 0.4)';
              }}
            >
              🔥 챌린지
            </button>
          </div>

          {/* 배너 광고 영역 */}
          <div style={{
            height: '30px',
            backgroundColor: '#f0f0f0',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #ccc',
            color: '#999',
            fontSize: '12px'
          }}>
            📢 배너 광고
          </div>
        </div>

        {/* 메뉴 모달 */}
        {showMenuModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxWidth: '450px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}>
              {/* 닫기 버튼 */}
              <button
                onClick={() => setShowMenuModal(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '5px',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#f0f0f0';
                  target.style.color = '#333';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = '#999';
                }}
              >
                ✕
              </button>

              <h2 style={{ marginBottom: '25px', color: '#333', textAlign: 'center' }}>게임 설정</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 배경음악 볼륨 설정 */}
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ color: '#333', fontSize: '16px', fontWeight: 'bold' }}>🎵 배경음악</label>
                    <button
                      onClick={toggleBgmMute}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: isBgmMuted ? '#ff4444' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {isBgmMuted ? '🔇' : '🔊'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>0</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={bgmVolume}
                      onChange={(e) => handleBgmVolumeChange(parseFloat(e.target.value))}
                      disabled={isBgmMuted}
                      style={{
                        flex: 1,
                        height: '6px',
                        backgroundColor: '#ddd',
                        outline: 'none',
                        borderRadius: '3px'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#666' }}>100</span>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    {isBgmMuted ? '음소거' : `${Math.round(bgmVolume * 100)}%`}
                  </div>
                </div>

                {/* 효과음 볼륨 설정 */}
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ color: '#333', fontSize: '16px', fontWeight: 'bold' }}>🔊 효과음</label>
                    <button
                      onClick={toggleEffectMute}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: isEffectMuted ? '#ff4444' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {isEffectMuted ? '🔇' : '🔊'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>0</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={effectVolume}
                      onChange={(e) => handleEffectVolumeChange(parseFloat(e.target.value))}
                      disabled={isEffectMuted}
                      style={{
                        flex: 1,
                        height: '6px',
                        backgroundColor: '#ddd',
                        outline: 'none',
                        borderRadius: '3px'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#666' }}>100</span>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    {isEffectMuted ? '음소거' : `${Math.round(effectVolume * 100)}%`}
                  </div>
                </div>

                {/* 개발자 SNS 버튼 */}
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}>
                  <label style={{ color: '#333', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>👨‍💻 개발자 SNS</label>
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button
                      onClick={() => openDeveloperPage('instagram')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#E4405F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = '#C13584';
                        target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = '#E4405F';
                        target.style.transform = 'translateY(0)';
                      }}
                    >
                      📷 Instagram
                    </button>
                    <button
                      onClick={() => openDeveloperPage('youtube')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#FF0000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = '#CC0000';
                        target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = '#FF0000';
                        target.style.transform = 'translateY(0)';
                      }}
                    >
                      🎬 YouTube
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                    개발자의 다른 작품과 소식을 확인해보세요!
                  </div>
                </div>

                {/* 캐시 삭제 버튼 */}
                <div style={{
                  padding: '15px',
                  backgroundColor: '#ffebee',
                  borderRadius: '10px',
                  border: '1px solid #ffcdd2'
                }}>
                  <label style={{ color: '#333', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>🗑️ 데이터 관리</label>
                  <button
                    onClick={clearCache}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    전체 캐시 삭제
                  </button>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px', textAlign: 'center' }}>
                    닉네임, 점수, 설정이 모두 초기화됩니다
                  </div>
                </div>

                {/* 앱 버전 정보 */}
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>뜨돌 수박게임</div>
                  <div style={{ color: '#999', fontSize: '12px' }}>버전 1.0.0</div>
                  <div style={{ color: '#999', fontSize: '10px', marginTop: '5px' }}>© 2024 Ttodol Game</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 닉네임 설정 모달 */}
        {showNicknameModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxWidth: '400px',
              width: '90%',
              position: 'relative'
            }}>
              {/* X 버튼 - 닉네임이 있는 경우에만 표시 */}
              {playerName && (
                <button
                  onClick={closeNicknameModal}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '5px',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.color = '#333';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#999';
                  }}
                >
                  ✕
                </button>
              )}
              
              <h2 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>닉네임 설정</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ color: '#333', fontSize: '16px' }}>닉네임:</label>
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setTempNickname(target.value);
                      setNicknameError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: nicknameError ? '2px solid #ff4444' : '2px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="닉네임을 입력하세요"
                    maxLength="10"
                  />
                </div>
                
                {/* 에러 메시지 */}
                {nicknameError && (
                  <div style={{
                    color: '#ff4444',
                    fontSize: '14px',
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: '#ffebee',
                    borderRadius: '6px',
                    border: '1px solid #ffcdd2'
                  }}>
                    {nicknameError}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => savePlayerName(tempNickname)}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      const randomName = generateRandomNickname();
                      setTempNickname(randomName);
                      setNicknameError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    랜덤
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 게임 셀렉트 모달 (일반 모드) */}
        {showGameSelectModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '20px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                🎮 일반 게임 모드
              </h2>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                난이도를 선택하세요
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                <button
                  onClick={() => startGame('easy')}
                  style={{
                    padding: '20px 25px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    minHeight: '80px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>😊 쉬움</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>여유로운 게임 플레이</div>
                </button>
                
                <button
                  onClick={() => startGame('normal')}
                  style={{
                    padding: '20px 25px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    minHeight: '80px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(33, 150, 243, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>🎯 보통</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>표준 게임 플레이</div>
                </button>
                
                <button
                  onClick={() => startGame('hard')}
                  style={{
                    padding: '20px 25px',
                    backgroundColor: '#FF5722',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    minHeight: '80px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(255, 87, 34, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>🔥 어려움</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>도전적인 게임 플레이</div>
                </button>
              </div>
              
              <button
                onClick={() => setShowGameSelectModal(false)}
                style={{
                  backgroundColor: '#9E9E9E',
                  color: 'white',
                  border: 'none',
                  padding: '12px 40px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 챌린지 모달 */}
        {showChallengeModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '20px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                🔥 챌린지 모드
              </h2>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                시간과 싸워보세요!
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                <button
                  onClick={() => startGame('timeattack')}
                  style={{
                    padding: '20px 25px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    minHeight: '80px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(255, 152, 0, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>⏱️ 2분 챌린지</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>2분 안에 최고 점수 도전</div>
                </button>
                
                <button
                  onClick={() => startGame('speed')}
                  style={{
                    padding: '20px 25px',
                    backgroundColor: '#E91E63',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    minHeight: '80px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(233, 30, 99, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>⚡ 3분 챌린지</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>빠른 속도의 3분 게임</div>
                </button>
                
                <button
                  onClick={() => startGame('expert')}
                  style={{
                    padding: '20px 25px',
                    backgroundColor: '#9C27B0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    minHeight: '80px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(156, 39, 176, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>🚀 5분 챌린지</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>전문가를 위한 5분 게임</div>
                </button>
                
                <button
                  onClick={() => startGame('chaos')}
                  style={{
                    padding: '20px 25px',
                    backgroundColor: '#F44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    minHeight: '80px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(244, 67, 54, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>💥 카오스 모드</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>예측 불가능한 혼돈의 게임</div>
                </button>
              </div>
              
              <button
                onClick={() => setShowChallengeModal(false)}
                style={{
                  backgroundColor: '#9E9E9E',
                  color: 'white',
                  border: 'none',
                  padding: '12px 40px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: GAME_CONSTANTS.COLORS.BACKGROUND,
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 게임 헤더 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ fontWeight: 'bold', color: '#333' }}>
            점수: {gameState.score.toLocaleString()}
          </div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>
            레벨: {gameState.level}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {DIFFICULTY_SETTINGS[selectedDifficulty].timeLimit > 0 && (
            <div style={{ 
              fontWeight: 'bold', 
              color: gameState.timeLeft < 30 ? '#ff4444' : '#333'
            }}>
              시간: {formatTime(gameState.timeLeft)}
            </div>
          )}
          <button
            onClick={toggleAudio}
            style={{
              padding: '8px 15px',
              backgroundColor: isAudioEnabled ? '#4CAF50' : '#999',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isAudioEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={resetGame}
            style={{
              padding: '8px 15px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            메뉴로
          </button>
        </div>
      </div>

      {/* 게임 영역 */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '400px',
          height: '600px',
          backgroundColor: '#fff',
          border: `${GAME_CONSTANTS.PHYSICS.WALL_THICKNESS}px solid ${GAME_CONSTANTS.COLORS.WALL}`,
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 엔드라인 */}
          <div style={{
            position: 'absolute',
            top: `${DIFFICULTY_SETTINGS[selectedDifficulty].topMargin}px`,
            left: '0',
            right: '0',
            height: `${GAME_CONSTANTS.COLORS.LINE_THICKNESS[selectedDifficulty] || 3}px`,
            backgroundColor: GAME_CONSTANTS.COLORS.LINE_COLORS[selectedDifficulty] || '#FF9800',
            zIndex: 10
          }} />
          
          {/* 다음 과일 표시 */}
          {gameState.currentFruit && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              padding: '8px 15px',
              borderRadius: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: gameState.currentFruit.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                backgroundImage: `url(/src/assets/images/fruits/${gameState.currentFruit.name}.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}>
                {!gameState.currentFruit.name && gameState.currentFruit.korean[0]}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                다음: {gameState.currentFruit.korean}
              </span>
            </div>
          )}
          
          {/* 게임 안내 메시지 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#666',
            fontSize: '16px'
          }}>
            <div style={{ marginBottom: '10px' }}>🎮 게임 준비 중...</div>
            <div style={{ fontSize: '14px' }}>
              클릭하여 과일을 떨어뜨려보세요!
            </div>
          </div>
        </div>
      </div>

      {/* 과일 컬렉션 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '15px 20px',
        borderTop: '1px solid #eee',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {FRUITS_BASE.map((fruit, index) => (
          <div
            key={fruit.id}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: fruit.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              opacity: index <= gameState.level ? 1 : 0.3,
              border: '2px solid #ddd',
              transition: 'all 0.3s ease',
              backgroundImage: `url(/src/assets/images/fruits/${fruit.name}.png)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            title={fruit.korean}
          >
            {!fruit.name && fruit.korean[0]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;