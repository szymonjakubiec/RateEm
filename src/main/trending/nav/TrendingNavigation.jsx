import {createStackNavigator} from "@react-navigation/stack";
import TrendingScreen from "../TrendingScreen";



var Stack = createStackNavigator();

export default function TrendingNavigation({route}) {
  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Trending"
        component={TrendingScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
    </Stack.Navigator>
  );
}
