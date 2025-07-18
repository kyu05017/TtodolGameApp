// Mock for react-native-reanimated
import React from 'react';
import { View, Text, Animated } from 'react-native';

export const useSharedValue = (initialValue) => {
  return { value: initialValue };
};

export const useAnimatedStyle = (callback) => {
  return {};
};

export const withSpring = (value, config) => {
  return value;
};

export const withTiming = (value, config) => {
  return value;
};

export const runOnJS = (fn) => {
  return fn;
};

export const interpolate = (value, inputRange, outputRange) => {
  return value;
};

export default {
  View: Animated.View,
  Text: Animated.Text,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
};