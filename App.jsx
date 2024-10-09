import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import LoggingScreen from './src/main/login/LoggingScreen';
import MainNavigation from './src/main/nav/MainNavigation';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Logging' 
          component={LoggingScreen} 
          options={() => ({
            headerShown: false
          })}
        />
        <Stack.Screen
          name='MainNav'
          component={MainNavigation}
          options={() => ({
            headerShown: false,
            headerLeft: () => null,
            gestureEnabled: false, 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}