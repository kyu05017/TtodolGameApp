// Mock for react-native-modal
import React from 'react';
import { View, Modal as RNModal } from 'react-native';

const Modal = ({ children, isVisible, onBackdropPress, style, ...props }) => {
  return (
    <RNModal
      visible={isVisible}
      transparent={true}
      onRequestClose={onBackdropPress}
      {...props}
    >
      <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }, style]}>
        {children}
      </View>
    </RNModal>
  )
};

export default Modal;