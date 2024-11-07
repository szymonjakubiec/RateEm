import { useRoute, useLayoutEffect } from "@react-navigation/native";
import { createContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../home/HomeScreen";
import ElectionNavigation from "../election/nav/ElectionNavigation";
import SearchNavigation from "../search/nav/SearchNavigation";
import {
  getAllPoliticianNames,
  getAllPoliticians,
} from "../../backend/database/Politicians.js";
import { PoliticianNameContext } from "../search/PoliticianNameContext.jsx";
import TrendingScreen from "../trending/TrendingScreen";
import ExtrasNavigation from "../extras/nav/ExtrasNavigation";

const Tab = createBottomTabNavigator();

export default function MainNavigation({ route }) {
  const _title = route.params?._title;
  const [namesData, setNamesData] = useState();

  /**
   * Asynchronously gets names of all politicians and passes it to the namesData.
   * @async
   */
  async function init() {
    const data = await getAllPoliticianNames();
    setNamesData(data);
  }

  /**
   * Runs right after user navigates to this component. It's sole purpose is to call init function.
   */
  useEffect(() => {
    init();
  }, []);

  return (
    <PoliticianNameContext.Provider value={namesData}>
      <Tab.Navigator>
        <Tab.Screen
          name="SearchNav"
          component={SearchNavigation}
          initialParams={{ _title }}
          options={() => ({
            title: "Wyszukaj", // tytuł na dole ekranu
            headerShown: false,
            // headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name="Election"
          component={ElectionNavigation}
          options={() => ({
            title: "Wybory",
            headerTitle: _title,
            headerTitleAlign: "center",
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={() => ({
            title: "Strona główna",
            headerTitle: _title,
            headerTitleAlign: "center",
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name="Trending"
          component={TrendingScreen}
          options={() => ({
            title: "Na czasie",
            headerTitle: _title,
            headerTitleAlign: "center",
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name="ExtrasNav"
          component={ExtrasNavigation}
          options={() => ({
            title: "Więcej",
            headerTitle: _title,
            headerTitleAlign: "center",
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
      </Tab.Navigator>
    </PoliticianNameContext.Provider>
  );
}
