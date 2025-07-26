import React, { useState } from 'react';
import { GameProvider } from './src/services/GameContext.simple';
import MainScreen from './src/screens/MainScreen.simple';
import GameScreen from './src/screens/GameScreen.simple';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'Main' | 'GameScreen'>('Main');

  const navigation = {
    navigate: (screen: 'Main' | 'GameScreen') => {
      setCurrentScreen(screen);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'Main':
        return <MainScreen navigation={navigation} />;
      case 'GameScreen':
        return <GameScreen navigation={navigation} />;
      default:
        return <MainScreen navigation={navigation} />;
    }
  };

  return (
    <GameProvider>
      {renderCurrentScreen()}
    </GameProvider>
  );
};

export default App;