import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoggingScreen from "./src/main/login/LoggingScreen";
import MainNavigation from "./src/main/nav/MainNavigation";
import RegisterNavigation from "./src/main/login/nav/RegisterNavigation";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Logging"
          component={LoggingScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="MainNav"
          component={MainNavigation}
          options={() => ({
            headerShown: false,
            headerLeft: () => null,
            gestureEnabled: false,
          })}
        />
        <Stack.Screen
          name="RegisterNav"
          component={RegisterNavigation}
          // initialParams={{_title}}
          options={() => ({
            title: "Zarejestruj", // tytuł na dole ekranu
            headerShown: false,
            // headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
