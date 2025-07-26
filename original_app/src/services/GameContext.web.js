import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Web용 Storage 구현
const Storage = {
  async getItem(key) {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Storage getItem error:', error)
      return null;
    }
  },
  
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value)
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error)
      return false;
    }
  }
};

// 초기 상태 정의
const initialState = {
  // 게임 상태
  score: 0,
  playTime: 0,
  isGameStarted: false,
  isPaused: false,
  gameMode: 'normal',
  difficulty: 1,
  
  // 게임 데이터
  fruitCount: {},
  fruitCollection: new Set(),
  bestScore: 0,
  totalPlayTime: 0,
  
  // 사용자 설정
  nickname: '',
  musicVolume: 0.5,
  effectVolume: 0.5,
  settings: {
    soundEnabled: true,
    hapticEnabled: true,
    musicVolume: 0.5,
    effectVolume: 0.5,
  },
  
  // 특수 기능
  shakeCountdown: 30,
  isShakeAvailable: false,
  
  // UI 상태
  showNicknameModal: false,
  showGameOverModal: false,
  showPauseModal: false,
  showMainMenu: false,
  showSettings: false,
  showGameStartModal: true,
  
  // 게임 통계
  gamesPlayed: 0,
  totalMerges: 0,
  highestFruit: 0
};

// 액션 타입 정의
const ActionTypes = {
  // 게임 상태
  START_GAME: 'START_GAME',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  END_GAME: 'END_GAME',
  RESET_GAME: 'RESET_GAME',
  
  // 점수 및 시간
  UPDATE_SCORE: 'UPDATE_SCORE',
  UPDATE_TIME: 'UPDATE_TIME',
  
  // 과일 관련
  UPDATE_FRUIT_COUNT: 'UPDATE_FRUIT_COUNT',
  ADD_TO_COLLECTION: 'ADD_TO_COLLECTION',
  
  // 사용자 설정
  SET_NICKNAME: 'SET_NICKNAME',
  SET_MUSIC_VOLUME: 'SET_MUSIC_VOLUME',
  SET_EFFECT_VOLUME: 'SET_EFFECT_VOLUME',
  
  // 특수 기능
  UPDATE_SHAKE_COUNTDOWN: 'UPDATE_SHAKE_COUNTDOWN',
  TOGGLE_SHAKE_AVAILABLE: 'TOGGLE_SHAKE_AVAILABLE',
  
  // UI 상태
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  
  // 데이터 로드
  LOAD_SAVED_DATA: 'LOAD_SAVED_DATA',
  SAVE_GAME_DATA: 'SAVE_GAME_DATA'
};

// 리듀서 함수
const gameReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.START_GAME:
      return {
        ...state,
        isGameStarted: true,
        isPaused: false,
        gameMode: action.payload.mode || 'normal',
        difficulty: action.payload.difficulty || 1,
        score: 0,
        playTime: 0,
        fruitCount: {},
        shakeCountdown: 30,
        isShakeAvailable: false,
        showGameStartModal: false
      };
      
    case ActionTypes.PAUSE_GAME:
      return {
        ...state,
        isPaused: true
      };
      
    case ActionTypes.RESUME_GAME:
      return {
        ...state,
        isPaused: false
      };
      
    case ActionTypes.END_GAME:
      const newBestScore = Math.max(state.bestScore, state.score)
      const newGamesPlayed = state.gamesPlayed + 1;
      const newTotalPlayTime = state.totalPlayTime + state.playTime;
      
      return {
        ...state,
        isGameStarted: false,
        isPaused: false,
        bestScore: newBestScore,
        gamesPlayed: newGamesPlayed,
        totalPlayTime: newTotalPlayTime,
        showGameOverModal: true
      };
      
    case ActionTypes.RESET_GAME:
      return {
        ...state,
        isGameStarted: false,
        isPaused: false,
        score: 0,
        playTime: 0,
        fruitCount: {},
        shakeCountdown: 30,
        isShakeAvailable: false,
        showGameOverModal: false,
        showPauseModal: false,
        showGameStartModal: true
      };
      
    case ActionTypes.UPDATE_SCORE:
      return {
        ...state,
        score: state.score + action.payload.points,
        totalMerges: state.totalMerges + (action.payload.isMerge ? 1 : 0)
      };
      
    case ActionTypes.UPDATE_TIME:
      return {
        ...state,
        playTime: state.playTime + 1
      };
      
    case ActionTypes.UPDATE_FRUIT_COUNT:
      return {
        ...state,
        fruitCount: {
          ...state.fruitCount,
          [action.payload.fruitId]: (state.fruitCount[action.payload.fruitId] || 0) + 1
        }
      };
      
    case ActionTypes.ADD_TO_COLLECTION:
      const newCollection = new Set(state.fruitCollection)
      newCollection.add(action.payload.fruitId)
      return {
        ...state,
        fruitCollection: newCollection,
        highestFruit: Math.max(state.highestFruit, action.payload.fruitId)
      };
      
    case ActionTypes.SET_NICKNAME:
      return {
        ...state,
        nickname: action.payload.nickname
      };
      
    case ActionTypes.SET_MUSIC_VOLUME:
      console.log('🔄 GameContext.web Reducer - SET_MUSIC_VOLUME:', action.payload.volume)
      return {
        ...state,
        musicVolume: action.payload.volume
      };
      
    case ActionTypes.SET_EFFECT_VOLUME:
      console.log('🔄 GameContext.web Reducer - SET_EFFECT_VOLUME:', action.payload.volume)
      return {
        ...state,
        effectVolume: action.payload.volume
      };
      
    case ActionTypes.UPDATE_SHAKE_COUNTDOWN:
      const newCountdown = Math.max(0, state.shakeCountdown - 1)
      return {
        ...state,
        shakeCountdown: newCountdown,
        isShakeAvailable: newCountdown === 0
      };
      
    case ActionTypes.TOGGLE_SHAKE_AVAILABLE:
      return {
        ...state,
        isShakeAvailable: action.payload.available,
        shakeCountdown: action.payload.available ? 0 : 30
      };
      
    case ActionTypes.SHOW_MODAL:
      return {
        ...state,
        [action.payload.modalName]: true
      };
      
    case ActionTypes.HIDE_MODAL:
      return {
        ...state,
        [action.payload.modalName]: false
      };
      
    case ActionTypes.LOAD_SAVED_DATA:
      return {
        ...state,
        ...action.payload.data
      };
      
    default:
      return state;
  }
};

// Context 생성
const GameContext = createContext()

// Provider 컴포넌트
const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  
  // 데이터 로드
  useEffect(() => {
    loadSavedData()
  }, [])
  
  // 데이터 저장
  useEffect(() => {
    saveGameData()
  }, [state.nickname, state.musicVolume, state.effectVolume, state.bestScore, state.gamesPlayed, state.totalPlayTime])
  
  // 저장된 데이터 로드
  const loadSavedData = async () => {
    try {
      const savedData = await Storage.getItem('gameData')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        dispatch({
          type: ActionTypes.LOAD_SAVED_DATA,
          payload: { data: parsedData }
        })
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    }
  };
  
  // 게임 데이터 저장
  const saveGameData = async () => {
    try {
      const dataToSave = {
        nickname: state.nickname,
        musicVolume: state.musicVolume,
        effectVolume: state.effectVolume,
        bestScore: state.bestScore,
        gamesPlayed: state.gamesPlayed,
        totalPlayTime: state.totalPlayTime,
        fruitCollection: Array.from(state.fruitCollection),
        highestFruit: state.highestFruit,
        totalMerges: state.totalMerges
      };
      
      await Storage.setItem('gameData', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('데이터 저장 실패:', error)
    }
  };
  
  // 액션 생성 함수들
  const actions = {
    startGame: (mode, difficulty) => dispatch({
      type: ActionTypes.START_GAME,
      payload: { mode, difficulty }
    }),
    
    pauseGame: () => dispatch({ type: ActionTypes.PAUSE_GAME }),
    resumeGame: () => dispatch({ type: ActionTypes.RESUME_GAME }),
    endGame: () => dispatch({ type: ActionTypes.END_GAME }),
    resetGame: () => dispatch({ type: ActionTypes.RESET_GAME }),
    
    updateScore: (points, isMerge = false) => dispatch({
      type: ActionTypes.UPDATE_SCORE,
      payload: { points, isMerge }
    }),
    
    updateTime: () => dispatch({ type: ActionTypes.UPDATE_TIME }),
    
    updateFruitCount: (fruitId) => dispatch({
      type: ActionTypes.UPDATE_FRUIT_COUNT,
      payload: { fruitId }
    }),
    
    addToCollection: (fruitId) => dispatch({
      type: ActionTypes.ADD_TO_COLLECTION,
      payload: { fruitId }
    }),
    
    setNickname: (nickname) => dispatch({
      type: ActionTypes.SET_NICKNAME,
      payload: { nickname }
    }),
    
    setMusicVolume: (volume) => {
      console.log('🎵 GameContext.web - setMusicVolume 호출:', volume)
      dispatch({
        type: ActionTypes.SET_MUSIC_VOLUME,
        payload: { volume }
      })
    },
    
    setEffectVolume: (volume) => {
      console.log('🔊 GameContext.web - setEffectVolume 호출:', volume)
      dispatch({
        type: ActionTypes.SET_EFFECT_VOLUME,
        payload: { volume }
      })
    },
    
    updateShakeCountdown: () => dispatch({ type: ActionTypes.UPDATE_SHAKE_COUNTDOWN }),
    
    toggleShakeAvailable: (available) => dispatch({
      type: ActionTypes.TOGGLE_SHAKE_AVAILABLE,
      payload: { available }
    }),
    
    showModal: (modalName) => dispatch({
      type: ActionTypes.SHOW_MODAL,
      payload: { modalName }
    }),
    
    hideModal: (modalName) => dispatch({
      type: ActionTypes.HIDE_MODAL,
      payload: { modalName }
    })
  };
  
  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  )
};

// Hook for using the context
const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context;
};

// Export using ES Module syntax
export { GameProvider, useGame };



