// Mock for react-native-gesture-handler
import React from 'react';
import { View } from 'react-native';

const GestureHandlerRootView = ({ children, style, ...props }) => {
  return (
    <View style={[{ flex: 1 }, style]} {...props}>
      {children}
    </View>
  )
};

const PanGestureHandler = ({ children, onGestureEvent, ...props }) => {
  return (
    <View {...props}>
      {children}
    </View>
  )
};

const State = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5,
};

export {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
};

