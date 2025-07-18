// Mock for react-native-game-engine
import React from 'react';
import { View } from 'react-native';

export const GameEngine = ({ children, systems, entities, style, ...props }) => {
  return (
    <View style={[{ flex: 1 }, style]} {...props}>
      {children}
    </View>
  );
};

export default GameEngine;