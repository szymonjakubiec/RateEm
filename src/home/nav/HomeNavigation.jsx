import { useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../HomeScreen";
import SearchScreen from "../../search/SearchScreen";
import ElectionScreen from "../../election/ElectionScreen";
import OptionsScreen from "../../options/OptionsScreen";
import SearchNavigation from "../../search/nav/SearchNavigation";

const Tab = createBottomTabNavigator();

export default function HomeNavigation() {
  
  const route = useRoute();
  const _title = route.params?._title;
  
    return(
      <Tab.Navigator>
        <Tab.Screen
          name='SearchNav'
          component={SearchNavigation}
          initialParams={{_title}} 
          options={() => ({
            headerShown: false,
            // headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={() => ({
            headerTitle: _title,
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />        
        <Tab.Screen
          name='Election'
          component={ElectionScreen}
          options={() => ({
            headerTitle: _title,
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name='Options'
          component={OptionsScreen}
          options={() => ({
            headerTitle: _title,
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
      </Tab.Navigator>
    )
  }
  