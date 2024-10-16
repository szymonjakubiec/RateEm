import { useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../home/HomeScreen";
import SearchScreen from "../search/SearchScreen";
import ElectionScreen from "../election/ElectionScreen";
import SearchNavigation from "../search/nav/SearchNavigation";
import TrendingScreen from '../trending/TrendingScreen';
import ExtrasScreen from "../extras/ExtrasScreen";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  
  const route = useRoute();
  const _title = route.params?._title;
  
    return(
      <Tab.Navigator>
        <Tab.Screen
          name='SearchNav'
          component={SearchNavigation}
          initialParams={{_title}} 
          options={() => ({
            title: 'Wyszukaj', // tytuł na dole ekranu
            headerShown: false,
            // headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name='Election'
          component={ElectionScreen}
          options={() => ({
            title: 'Wybory',
            headerTitle: _title,
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={() => ({
            title: 'Strona główna',
            headerTitle: _title,
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />        
        <Tab.Screen
          name='Trending'
          component={TrendingScreen}
          options={() => ({
            title: 'Na czasie',
            headerTitle: _title,
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
        <Tab.Screen
          name='Extras'
          component={ExtrasScreen}
          options={() => ({
            title: 'Więcej',
            headerTitle: _title,
            headerTitleAlign: 'center',
            headerLeft: () => null,
            gestureEnabled: false, // wyłącza swipe back na IOS
          })}
        />
      </Tab.Navigator>
    )
  }
  