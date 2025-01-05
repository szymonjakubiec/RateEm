import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import LoggingScreen from "./src/main/login/LoggingScreen";
import MainNavigation from "./src/main/nav/MainNavigation";
import RegisterNavigation from "./src/main/login/register/nav/RegisterNavigation";
import {DefaultTheme, PaperProvider} from "react-native-paper";
import ResetPassNavigation from "./src/main/login/resetPass/nav/ResetPassNavigation";



const Stack = createStackNavigator();


global.SERVER_URL = "http://10.0.2.2:3000/api";
console.log(global["SERVER_URL"]);


export default function App() {

  // PK: Theme to change
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      buttonPress: "#6750A4B2",
      primaryContainer2: "#C6A8F3",
      secondaryContainer2: "#D2BBEF",
      sejm: "#11DFE8",
      prezydent: "#F24726",
      parlament: "#8FD14F",
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
            options={() => ({
              title: "Zarejestruj",
              headerShown: false,
              gestureEnabled: false,
            })}
          />
          <Stack.Screen
            name="ResetNav"
            component={ResetPassNavigation}
            options={() => ({
              title: "Zresetuj hasło",
              headerShown: false,
              gestureEnabled: false,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
