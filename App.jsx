import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoggingScreen from './src/login/LoggingScreen';
import HomeScreen from './src/home/HomeScreen';
import HomeNavigation from './src/home/nav/HomeNavigation';
import RegisterScreen from './src/login/RegisterScreen';

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
          name='HomeNav'
          component={HomeNavigation}
          options={() => ({
            headerShown: false,
            headerLeft: () => null,
            gestureEnabled: false, 
          })}
        />
        <Stack.Screen
          name='Register'
          component={RegisterScreen}
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