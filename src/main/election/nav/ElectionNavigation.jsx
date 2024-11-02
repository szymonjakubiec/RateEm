import { useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ElectionScreen from "../ElectionScreen.jsx";
import CalculatorScreen from "../CalculatorScreen.jsx";
import CalendarScreen from "../CalendarScreen.jsx";

var Stack = createStackNavigator();

export default function ElectionNavigation({ route }) {
  // const route = useRoute();
  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={ElectionScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}
