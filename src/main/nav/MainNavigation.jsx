import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ElectionNavigation from "../election/nav/ElectionNavigation";
import HomeNavigation from "../home/nav/HomeNavigation";
import { getAllPoliticians } from "../../backend/database/Politicians.js";
import { GlobalContext } from "./GlobalContext.jsx";
import ExtrasNavigation from "../extras/nav/ExtrasNavigation";
import { Icon, useTheme } from "react-native-paper";

const Tab = createBottomTabNavigator();

export default function MainNavigation({ route }) {
  const { _title, userId } = route.params;

  const theme = useTheme();

  return (
    <GlobalContext.Provider value={{ userId }}>
      <Tab.Navigator
        backBehavior="initialRoute"
        initialRouteName="HomeNav"
        screenOptions={{
          tabBarShowLabel: false,
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarActiveBackgroundColor: theme.colors.secondaryContainer,
          // tabBarActiveBackgroundColor: "#00000010",
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarInactiveBackgroundColor: theme.colors.background,
          tabBarStyle: {
            height: "5.5%",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: "absolute",
            // zIndex: 1,
          },
          tabBarItemStyle: {
            borderRadius: 8,
            paddingTop: 5,
            paddingBottom: 10,
          },
        }}
      >
        <Tab.Screen
          name="ElectionNav"
          component={ElectionNavigation}
          options={{
            headerShown: false,
            // title: "Wybory",
            // headerTitleAlign: "center",
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: ({ color }) => <Icon color={color} source="email-newsletter" size={32} />,
            tabBarIconStyle: { top: 4 },
          }}
        />
        <Tab.Screen
          name="HomeNav"
          component={HomeNavigation}
          initialParams={{ _title }}
          options={{
            headerShown: false,
            // title: "Strona główna",
            // headerTitleAlign: "center",
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: ({ color }) => <Icon color={color} source="home" size={36} />,
            tabBarIconStyle: { top: 1 },
          }}
        />
        <Tab.Screen
          name="ExtrasNav"
          component={ExtrasNavigation}
          options={{
            headerShown: false,
            // title: "Więcej",
            // headerTitleAlign: "center",
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: ({ color }) => <Icon color={color} source="menu" size={36} />,
            tabBarIconStyle: { top: 2 },
          }}
        />
      </Tab.Navigator>
    </GlobalContext.Provider>
  );
}
