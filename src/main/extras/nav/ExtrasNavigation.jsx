import { useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ExtrasScreen from "../ExtrasScreen";
import GuideScreen from "../GuideScreen";
import SettingsScreen from "../SettingsScreen";
import SummaryScreen from "../SummaryScreen";

var Stack = createStackNavigator();

export default function ExtrasNavigation({ route }) {
  // const route = useRoute();
  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Extras"
        component={ExtrasScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
        })}
      />
      <Stack.Screen
        name="Guide"
        component={GuideScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
        })}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}
