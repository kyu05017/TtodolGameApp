import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { useGame } from '../../services/GameContext';
import { useGame as useGameWeb } from '../../services/GameContext.web';
import { NICKNAME_WORDS } from '../../constants/nicknameWords';
import { isWeb, platformStyle } from '../../utils/platform';

const { width: screenWidth } = Dimensions.get('window');

const NicknameModal = ({ visible, onClose }) => {
  // 플랫폼별 컨텍스트 사용
  const { state, actions } = isWeb ? useGameWeb() : useGame();
  const [inputNickname, setInputNickname] = useState('');
  const [isValidNickname, setIsValidNickname] = useState(true);
  
  // 애니메이션 상태
  const [modalTranslateY] = useState(new Animated.Value(300)); // 모달 시작 위치 (아래쪽)
  const [dimOpacity] = useState(new Animated.Value(0)); // 딤 시작 투명도 (투명)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // 모달이 열릴 때 현재 닉네임으로 초기화 및 애니메이션
  useEffect(() => {
    if (visible) {
      setInputNickname(state.nickname || '');
      setIsValidNickname(true);
      setIsAnimationComplete(false);
      
      // 모달 올라오는 애니메이션 시작
      Animated.sequence([
        // 1. 모달이 올라오는 애니메이션
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: !isWeb,
        }),
        // 2. 애니메이션 완료 후 딤 적용
        Animated.timing(dimOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: !isWeb,
        })
      ]).start(() => {
        setIsAnimationComplete(true);
      });
    } else {
      // 모달이 닫힐 때 초기화
      Animated.parallel([
        Animated.timing(modalTranslateY, {
          toValue: 300,
          duration: 300,
          useNativeDriver: !isWeb,
        }),
        Animated.timing(dimOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: !isWeb,
        })
      ]).start(() => {
        setIsAnimationComplete(false);
      });
    }
  }, [visible, state.nickname]);
  
  // 닉네임 유효성 검사
  const validateNickname = (nickname) => {
    if (!nickname.trim()) {
      return false;
    }
    
    // 한글, 영문, 숫자, 공백만 허용
    const regex = /^[가-힣a-zA-Z0-9\s]+$/;
    if (!regex.test(nickname)) {
      return false;
    }
    
    // 길이 제한 (1-10자)
    if (nickname.trim().length < 1 || nickname.trim().length > 10) {
      return false;
    }
    
    return true;
  };
  
  // 입력값 변경 핸들러
  const handleNicknameChange = (text) => {
    setInputNickname(text);
    setIsValidNickname(validateNickname(text));
  };
  
  // 랜덤 닉네임 생성
  const generateRandomNickname = () => {
    const randomAdj = NICKNAME_WORDS.adjectives[Math.floor(Math.random() * NICKNAME_WORDS.adjectives.length)];
    const randomNoun = NICKNAME_WORDS.nouns[Math.floor(Math.random() * NICKNAME_WORDS.nouns.length)];
    const randomNickname = `${randomAdj} ${randomNoun}`;
    
    setInputNickname(randomNickname);
    setIsValidNickname(true);
  };
  
  // 닉네임 저장
  const handleSaveNickname = () => {
    if (!validateNickname(inputNickname)) {
      Alert.alert(
        '닉네임 오류',
        '닉네임은 1-10자의 한글, 영문, 숫자만 사용할 수 있습니다.',
        [{ text: '확인' }]
      );
      return;
    }
    
    actions.setNickname(inputNickname.trim());
    onClose();
  };
  
  // 닉네임 초기화
  const handleClearNickname = () => {
    Alert.alert(
      '닉네임 초기화',
      '닉네임을 초기화하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '초기화', 
          style: 'destructive',
          onPress: () => {
            setInputNickname('');
            setIsValidNickname(false);
          }
        }
      ]
    );
  };
  
  // 모달 닫기
  const handleClose = () => {
    // 변경사항이 있으면 확인
    if (inputNickname.trim() !== state.nickname) {
      Alert.alert(
        '변경사항 확인',
        '변경사항을 저장하지 않고 나가시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '나가기', onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };
  
  // 웹에서는 Modal 대신 조건부 렌더링 사용
  const renderModal = () => (
    <>
      {/* 딤 배경 - 애니메이션 후에 나타남 */}
      <Animated.View 
        style={[
          styles.dimBackground,
          { 
            opacity: dimOpacity,
            // 웹에서만 포인터 이벤트 제어
            ...(isWeb ? { pointerEvents: isAnimationComplete ? 'auto' : 'none' } : {})
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.dimTouchable} 
          activeOpacity={1} 
          onPress={(e) => {
            if (isWeb) {
              e.preventDefault();
              e.stopPropagation();
            }
            // 모든 플랫폼에서 배경 클릭 차단
          }}
          disabled={false} // 이벤트 캐치를 위해 활성화
        />
      </Animated.View>
      
      {/* 모달 컨텐츠 */}
      <Animated.View 
        style={[
          styles.modalContent,
          {
            transform: [{ translateY: modalTranslateY }]
          }
        ]}
      >
          {/* 모달 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>닉네임 설정</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* 닉네임 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>닉네임</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.nicknameInput,
                  !isValidNickname && styles.invalidInput
                ]}
                value={inputNickname}
                onChangeText={handleNicknameChange}
                placeholder="닉네임을 입력하세요"
                placeholderTextColor="#999"
                maxLength={10}
                autoFocus={true}
              />
              {inputNickname.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setInputNickname('')}
                >
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {!isValidNickname && (
              <Text style={styles.errorText}>
                1-10자의 한글, 영문, 숫자만 사용할 수 있습니다.
              </Text>
            )}
          </View>
          
          {/* 랜덤 닉네임 생성 */}
          <TouchableOpacity 
            style={styles.randomButton}
            onPress={generateRandomNickname}
          >
            <Text style={styles.randomButtonText}>🎲 랜덤 닉네임 생성</Text>
          </TouchableOpacity>
          
          {/* 버튼 그룹 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.clearAllButton]}
              onPress={handleClearNickname}
            >
              <Text style={styles.clearAllButtonText}>초기화</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.saveButton,
                !isValidNickname && styles.disabledButton
              ]}
              onPress={handleSaveNickname}
              disabled={!isValidNickname}
            >
              <Text style={[
                styles.saveButtonText,
                !isValidNickname && styles.disabledButtonText
              ]}>
                저장
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 닉네임 정보 */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 닉네임은 게임 내에서 표시되는 이름입니다.
            </Text>
            <Text style={styles.infoText}>
              • 한글, 영문, 숫자 사용 가능
            </Text>
            <Text style={styles.infoText}>
              • 1-10자 제한
            </Text>
          </View>
        </Animated.View>
      </>
  );

  return (
    <>
      {isWeb ? (
        // 웹에서는 조건부 렌더링
        visible && (
          <View style={styles.modalOverlay}>
            {renderModal()}
          </View>
        )
      ) : (
        // 모바일에서는 Modal 컴포넌트 사용
        <Modal
          visible={visible}
          animationType="none" // 커스텀 애니메이션 사용
          transparent={true}
          onRequestClose={handleClose}
        >
          <View style={styles.modalOverlay}>
            {renderModal()}
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // 딤 배경은 별도로 처리
    justifyContent: 'center',
    alignItems: 'center',
    ...platformStyle(
      {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
      },
      {}
    ),
  },
  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...platformStyle(
      {
        width: '100vw',
        height: '100vh',
      },
      {}
    ),
  },
  dimTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxWidth: 400,
    width: '90%',
    position: 'relative',
    zIndex: 1,
    ...platformStyle(
      { 
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)',
        alignSelf: 'center',
      },
      {
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }
    ),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5A3C',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5A3C',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  nicknameInput: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    paddingRight: 40,
    backgroundColor: '#f9f9f9',
  },
  invalidInput: {
    borderColor: '#FF5722',
    backgroundColor: '#FFF5F5',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: '#FF5722',
    fontSize: 12,
    marginTop: 5,
  },
  randomButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  randomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  clearAllButton: {
    backgroundColor: '#FF5722',
  },
  clearAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default NicknameModal;