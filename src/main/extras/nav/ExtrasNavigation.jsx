import {createStackNavigator} from "@react-navigation/stack";
import ExtrasScreen from "../ExtrasScreen";
import GuideScreen from "../GuideScreen";
import SettingsScreen from "../SettingsScreen";
import SummaryScreen from "../SummaryScreen";



const Stack = createStackNavigator();

export default function ExtrasNavigation({route}) {


  const _title = route.params?._title;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Extras"
        component={ExtrasScreen}
        options={() => ({
          // headerTitle: "Więcej",
          // headerTitleAlign: "center",
          headerShown: false,
          // headerLeft: () => null,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={() => ({
          headerTitle: "Ustawienia",
          headerTitleAlign: "center",
        })}

      />
      <Stack.Screen
        name="Guide"
        component={GuideScreen}
        options={() => ({
          headerTitle: "Przewodnik",
          headerLeft: () => null,
          headerTitleAlign: "center",
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={() => ({
          headerTitle: "Podsumowanie",
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}
