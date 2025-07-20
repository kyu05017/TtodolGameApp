import React, { useState } from 'react';
import { GameProvider } from './src/services/GameContext.web';
import MainScreen from './src/screens/MainScreen';
import GameScreen from './src/screens/GameScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Main');

  // 웹용 간단한 네비게이션 객체
  const navigation = {
    navigate: (screenName: string) => {
      setCurrentScreen(screenName);
    },
    goBack: () => {
      setCurrentScreen('Main');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'GameScreen':
        return <GameScreen navigation={navigation} />;
      case 'Main':
      default:
        return <MainScreen navigation={navigation} />;
    }
  };

  return (
    <GameProvider>
      {renderScreen()}
    </GameProvider>
  );
};

export default App;