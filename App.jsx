import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoggingScreen from "./src/main/login/LoggingScreen";
import MainNavigation from "./src/main/nav/MainNavigation";

const Stack = createStackNavigator();

(() =>
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())

    .then((data) => {
      global.SERVER_URL = "http://" + data.ip + ":3000/api"; // dla telefonu
      // global.SERVER_URL = "http://10.0.2.2:3000/api"; // dla emulatora
    })

    .catch((error) => {
      console.error("Error fetching IP:", error);
    }))();

console.log(global.SERVER_URL);
global.xD = "YAAAA";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
