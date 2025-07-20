import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { isWeb, platformStyle, createTouchHandler } from '../../utils/platform';

const MenuButton = ({ onPress, style, size = 48 }) => {
  const handlePress = () => {
    console.log('🔧 MenuButton 클릭됨 - isWeb:', isWeb);
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.menuBtn, { width: size, height: size, borderRadius: size / 2 }, style]} 
      onPress={handlePress}
      {...(isWeb ? {} : createTouchHandler(handlePress))}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.menuBtnGradient}
      >
        <View style={styles.menuIconContainer}>
          <View style={[styles.menuLine, { width: size * 0.6 }]} />
          <View style={[styles.menuLine, { width: size * 0.6 }]} />
          <View style={[styles.menuLine, { width: size * 0.6 }]} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuBtn: {
    overflow: 'hidden',
    ...platformStyle(
      { 
        cursor: 'pointer',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
      },
      {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }
    ),
  },
  menuBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  menuLine: {
    height: 3,
    backgroundColor: 'white',
    marginVertical: 2,
    borderRadius: 1.5,
  },
});

export default MenuButton;