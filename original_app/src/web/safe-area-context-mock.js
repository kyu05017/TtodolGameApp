import React from 'react';

// 웹용 SafeAreaProvider 목업
const SafeAreaProvider = ({ children }) => {
  return React.createElement('div', { style: { height: '100%' } }, children)
};

// 웹용 SafeAreaView 목업
const SafeAreaView = ({ children, style, ...props }) => {
  return React.createElement('div', { style: { ...style }, ...props }, children)
};

// 웹용 useSafeAreaInsets 목업
const useSafeAreaInsets = () => {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
};

export {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
};

