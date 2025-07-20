import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GameProvider } from './src/services/GameContext';
import MainScreen from './src/screens/MainScreen';
import GameScreen from './src/screens/GameScreen';

type RootStackParamList = {
  Main: undefined;
  GameScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          {...({ initialRouteName: "Main" } as any)}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="GameScreen" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
};

export default App;