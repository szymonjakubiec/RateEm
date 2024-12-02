import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import LoggingScreen from "./src/main/login/LoggingScreen";
import MainNavigation from "./src/main/nav/MainNavigation";
import RegisterNavigation from "./src/main/login/register/nav/RegisterNavigation";
import {DefaultTheme, PaperProvider} from "react-native-paper";
import ResetPassNavigation from "./src/main/login/resetPass/nav/ResetPassNavigation";



const Stack = createStackNavigator();

// Setting global parameters

// PK
// global.SERVER_URL = "http://10.10.17.22:3000/api"; // ms
// global.SERVER_URL = "http://157.158.168.62:3000/api"; // aka
// global.SERVER_URL = "http://192.168.1.20:3000/api"; // cn

// MS
//global.SERVER_URL = "http://157.158.168.61:3000/api"; // aka
// global.SERVER_URL = "http://192.168.1.136:3000/api"; // home

// MM
global.SERVER_URL = "http://10.0.2.2:3000/api"; // emu

console.log(global["SERVER_URL"]);

export default function App() {

  // PK: Theme to change
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // primary: "#00ffd9",
      // onPrimary: "#fff",
      // secondary: "#f1c40f",
    },
  };

  return (
    <PaperProvider theme={theme}>
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
          <Stack.Screen
            name="ResetNav"
            component={ResetPassNavigation}
            // initialParams={{_title}}
            options={() => ({
              title: "Zresetuj hasło", // tytuł na dole ekranu
              headerShown: false,
              // headerLeft: () => null,
              gestureEnabled: false, // wyłącza swipe back na IOS
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
