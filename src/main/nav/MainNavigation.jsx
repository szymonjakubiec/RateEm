import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../home/HomeScreen";
import ElectionNavigation from "../election/nav/ElectionNavigation";
import HomeNavigation from "../home/nav/HomeNavigation";
import { getAllPoliticianNames } from "../../backend/database/Politicians.js";
import { GlobalContext } from "./GlobalContext.jsx";
import ExtrasNavigation from "../extras/nav/ExtrasNavigation";
import { Icon } from "react-native-paper";
import TrendingNavigation from "../trending/nav/TrendingNavigation";

const Tab = createBottomTabNavigator();

export default function MainNavigation({ route }) {
  const { _title, userId } = route.params;
  const [namesData, setNamesData] = useState();

  /**
   * Asynchronously gets names of all politicians and passes it to the namesData.
   * @async
   */
  async function init() {
    const data = await getAllPoliticianNames();
    setNamesData(data);
    console.log("updated all politicians");
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <GlobalContext.Provider value={{ namesData, setNamesData, userId }}>
      <Tab.Navigator
        backBehavior="initialRoute"
        initialRouteName="Home"
        screenOptions={{
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
          tabBarActiveBackgroundColor: "#00000012",
          tabBarInactiveBackgroundColor: "#00000002",
          tabBarStyle: {
            height: 65,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          tabBarItemStyle: {
            borderRadius: 5,
            paddingTop: 5,
            paddingBottom: 10,
          },
        }}
      >
        <Tab.Screen
          name="Election"
          component={ElectionNavigation}
          options={{
            title: "Wybory",
            headerShown: false,
            headerTitleAlign: "center",
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: () => (
              // <Icon source="draw" size={36}/>
              <Icon source="email-newsletter" size={32} />
            ),
            tabBarIconStyle: { top: 4 },
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeNavigation}
          options={{
            title: "Strona główna",
            headerTitle: _title,
            headerTitleAlign: "center",
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: () => <Icon source="home" size={36} />,
            tabBarIconStyle: { top: 1 },
          }}
        />
        <Tab.Screen
          name="Trending"
          component={TrendingNavigation}
          options={{
            title: "Na czasie",
            headerTitle: _title,
            headerShown: false,
            headerTitleAlign: "center",
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: () => <Icon source="trending-up" size={36} />,
            tabBarIconStyle: { top: 1 },
          }}
        />
        <Tab.Screen
          name="ExtrasNav"
          component={ExtrasNavigation}
          options={{
            title: "Więcej",
            headerTitle: _title,
            headerTitleAlign: "center",
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: () => <Icon source="menu" size={36} />,
            tabBarIconStyle: { top: 2 },
          }}
        />
      </Tab.Navigator>
    </GlobalContext.Provider>
  );
}
