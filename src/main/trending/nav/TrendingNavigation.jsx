import {createStackNavigator} from "@react-navigation/stack";
import TrendingScreen from "../TrendingScreen";
import ProfileScreen from "../../search/ProfileScreen";



var Stack = createStackNavigator();

export default function TrendingNavigation({route}) {
  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TrendingScreen"
        component={TrendingScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}
