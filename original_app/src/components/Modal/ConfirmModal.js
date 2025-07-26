import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Temporarily disabled
import { platformStyle, isWeb } from '../../utils/platform';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const ConfirmModal = ({ 
  visible, 
  title = "확인",
  message = "정말로 실행하시겠습니까?",
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  confirmColor = ['#ef4444', '#dc2626'],
  cancelColor = ['#6b7280', '#4b5563']
}) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [visible])

  const handleConfirm = () => {
    onConfirm && onConfirm()
  };

  const handleCancel = () => {
    onCancel && onCancel()
  };

  // 웹에서는 Modal 대신 조건부 렌더링 사용
  const renderModal = () => (
    <Animated.View 
      style={[
        styles.modalOverlay,
        { opacity: fadeAnim }
      ]}
    >
      <TouchableOpacity 
        style={styles.modalBackdrop} 
        activeOpacity={1} 
        onPress={handleCancel}
      />
      
      <Animated.View 
        style={[
          styles.modalContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim
          }
        ]}
      >
        {isWeb ? (
          <View style={[styles.modalContent, { backgroundColor: '#ffffff' }]}>
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 메시지 */}
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>

            {/* 버튼들 */}
            <View style={styles.buttonContainer}>
              {/* 취소 버튼 */}
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <View style={[styles.buttonGradient, { backgroundColor: cancelColor[0] }]}>
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </View>
              </TouchableOpacity>

              {/* 확인 버튼 */}
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]} 
                onPress={handleConfirm}
              >
                <View style={[styles.buttonGradient, { backgroundColor: confirmColor[0] }]}>
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            
            style={styles.modalContent}
          >
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 메시지 */}
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>

            {/* 버튼들 */}
            <View style={styles.buttonContainer}>
              {/* 취소 버튼 */}
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <View 
                  colors={cancelColor} 
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </View>
              </TouchableOpacity>

              {/* 확인 버튼 */}
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]} 
                onPress={handleConfirm}
              >
                <View 
                  colors={confirmColor} 
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        </Animated.View>
      </Animated.View>
  )

  return (
    <>
      {isWeb ? (
        // 웹에서는 조건부 렌더링
        visible && renderModal()
      ) : (
        // 모바일에서는 Modal 컴포넌트 사용
        <Modal
          visible={visible}
          transparent={true}
          animationType="none"
          onRequestClose={handleCancel}
        >
          {renderModal()}
        </Modal>
      )}
    </>
  )
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 적절한 딤 효과
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
        zIndex: 999999, // MenuModal보다 높게 설정
        display: 'flex',
      },
      {}
    ),
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: Math.min(screenWidth * 0.85, 350),
    borderRadius: 24,
    overflow: 'hidden',
    ...platformStyle(
      { boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)' },
      {
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
      }
    ),
  },
  modalContent: {
    padding: 24,
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
    color: '#333',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  messageContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...platformStyle(
      { cursor: 'pointer' },
      {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }
    ),
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButton: {
    // 추가 스타일링이 필요한 경우
  },
  confirmButton: {
    // 추가 스타일링이 필요한 경우
  },
})

export default ConfirmModal;