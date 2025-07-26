// Mock for react-native-reanimated
import React from 'react';
import { View, Text, Animated } from 'react-native';

const useSharedValue = (initialValue) => {
  return { value: initialValue };
};

const useAnimatedStyle = (callback) => {
  return {};
};

const withSpring = (value, config) => {
  return value;
};

const withTiming = (value, config) => {
  return value;
};

const runOnJS = (fn) => {
  return fn;
};

const interpolate = (value, inputRange, outputRange) => {
  return value;
};

export {
  View: Animated.View,
  Text: Animated.Text,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
};

