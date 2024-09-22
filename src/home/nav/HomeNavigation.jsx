import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../HomeScreen";
import SearchScreen from "../../search/SearchScreen";
import ElectionScreen from "../../election/ElectionScreen";
import OptionsScreen from "../../options/OptionsScreen";
import SearchNavigation from "../../search/nav/SearchNavigation";

const Tab = createBottomTabNavigator();

export default function HomeNavigation(){
    return(
      <Tab.Navigator>
        <Tab.Screen
          name='SearchNav'
          component={SearchNavigation}
          options={() => ({
            headerShown: false,
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={() => ({
            headerTitle: 'PoliTica',
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />        
        <Tab.Screen
          name='Election'
          component={ElectionScreen}
          options={() => ({
            headerTitle: 'PoliTica',
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name='Options'
          component={OptionsScreen}
          options={() => ({
            headerTitle: 'PoliTica',
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
      </Tab.Navigator>
    )
  }
  