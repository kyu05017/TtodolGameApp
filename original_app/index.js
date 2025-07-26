/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// React를 전역으로 설정 (JSX 호환성을 위해)
global.React = React;

if (typeof window !== 'undefined') {
  window.React = React;
}

// React Native에서 main 컴포넌트로 등록
AppRegistry.registerComponent('main', () => App);
