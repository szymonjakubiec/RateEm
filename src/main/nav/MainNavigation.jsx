import {useEffect, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ElectionNavigation from "../election/nav/ElectionNavigation";
import HomeNavigation from "../home/nav/HomeNavigation";
import {getAllPoliticians} from "../../backend/database/Politicians.js";
import {GlobalContext} from "./GlobalContext.jsx";
import ExtrasNavigation from "../extras/nav/ExtrasNavigation";
import {Icon, useTheme} from "react-native-paper";



const Tab = createBottomTabNavigator();

export default function MainNavigation({route}) {
  const {_title, userId} = route.params;
  const [namesData, setNamesData] = useState([]);
  const [updateDataTrigger, setUpdateDataTrigger] = useState(true);

  /**
   * Initialization - Asynchronously gets names of all politicians and passes it to the namesData.
   * @async
   */
  useEffect(() => {
    (async () => {
      const data = await getAllPoliticians("surname", false);
      setNamesData(data);
    })();
  }, []);

  const theme = useTheme();

  return (
    <GlobalContext.Provider value={{namesData, setNamesData, userId, updateDataTrigger, setUpdateDataTrigger}}>
      <Tab.Navigator
        backBehavior="initialRoute"
        initialRouteName="Home"
        activeColor="red"
        screenOptions={{
          tabBarShowLabel: false,
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: theme.colors.primary,
          // tabBarActiveBackgroundColor: theme.colors.primaryContainer,
          tabBarActiveBackgroundColor: "#00000016",
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarInactiveBackgroundColor: theme.colors.background,
          tabBarStyle: {
            height: "5.5%",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          tabBarItemStyle: {
            borderRadius: 8,
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
            tabBarIcon: ({color}) => (
              // <Icon source="draw" size={36}/>
              <Icon color={color} source="email-newsletter" size={32}/>
            ),
            tabBarIconStyle: {top: 4},
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeNavigation}
          options={{
            title: "Strona główna",
            headerTitle: _title,
            headerTitleAlign: "center",
            headerShown: false,
            gestureEnabled: false, // wyłącza swipe back na IOS
            tabBarIcon: ({color}) => <Icon color={color} source="home" size={36}/>,
            tabBarIconStyle: {top: 1},
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
            tabBarIcon: ({color}) => <Icon color={color} source="menu" size={36}/>,
            tabBarIconStyle: {top: 2},
          }}
        />
      </Tab.Navigator>
    </GlobalContext.Provider>
  );
}
