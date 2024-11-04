import { useRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../home/HomeScreen";
import ElectionNavigation from "../election/nav/ElectionNavigation";
import SearchNavigation from "../search/nav/SearchNavigation";
import TrendingScreen from "../trending/TrendingScreen";
import ExtrasNavigation from "../extras/nav/ExtrasNavigation";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  const route = useRoute();
  const _title = route.params?._title;

  return (
    <Tab.Navigator backBehavior="initialRoute" initialRouteName="Home">
      <Tab.Screen
        name="SearchNav"
        component={SearchNavigation}
        initialParams={{ _title }}
        options={() => ({
          title: "Wyszukaj",
          headerShown: false,
          gestureEnabled: false,
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
          gestureEnabled: false,
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
          gestureEnabled: false,
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
          gestureEnabled: false,
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
          gestureEnabled: false,
        })}
      />
    </Tab.Navigator>
  );
}
