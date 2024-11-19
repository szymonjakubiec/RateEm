import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import LoggingScreen from "./src/main/login/LoggingScreen";
import MainNavigation from "./src/main/nav/MainNavigation";
import RegisterNavigation from "./src/main/login/nav/RegisterNavigation";
import {PaperProvider} from "react-native-paper";



const Stack = createStackNavigator();

// (() =>
//   fetch("https://api.ipify.org?format=json")
//     .then((response) => response.json())

//     .then((data) => {
//       global.SERVER_URL = "http://" + data.ip + ":3000/api";
//     })

//     .catch((error) => {
//       console.error("Error fetching IP:", error);
//     }))();

// PK: Setting global parameters
global.SERVER_URL = "http://157.158.168.62:3000/api"; // aka
// global.SERVER_URL = "http://192.168.1.22:3000/api"; // cn

global.xD = "YAAAA";


export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Logging"
            component={ LoggingScreen }
            options={ () => ({
              headerShown: false,
            }) }
          />
          <Stack.Screen
            name="MainNav"
            component={ MainNavigation }
            options={ () => ({
              headerShown: false,
              headerLeft: () => null,
              gestureEnabled: false,
            }) }
          />
          <Stack.Screen
            name="RegisterNav"
            component={ RegisterNavigation }
            // initialParams={{_title}}
            options={ () => ({
              title: "Zarejestruj", // tytuł na dole ekranu
              headerShown: false,
              // headerLeft: () => null,
              gestureEnabled: false, // wyłącza swipe back na IOS
            }) }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
