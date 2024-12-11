import { useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../HomeScreen";
import ProfileScreen from "../ProfileScreen";

var Stack = createStackNavigator();

export default function HomeNavigation({ route }) {
  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={() => ({
          headerTitle: _title,
          headerShown: false,
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
