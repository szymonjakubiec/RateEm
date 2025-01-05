import {createStackNavigator} from "@react-navigation/stack";
import ExtrasScreen from "../ExtrasScreen";
import GuideScreen from "../GuideScreen";
import SettingsScreen from "../SettingsScreen";
import SummaryScreen from "../SummaryScreen";
import ConfirmScreen from "../../login/register/ConfirmScreen";



const Stack = createStackNavigator();

export default function ExtrasNavigation({route}) {

  const _title = route.params?._title;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Extras"
        component={ExtrasScreen}
        options={() => ({
          title: "Więcej",
          // headerShown: false,
          headerTitleStyle: {
            fontSize: 24
          },
          headerTitleAlign: "center",
          headerLeft: () => null,
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
        name="Confirm"
        component={ConfirmScreen}
        options={() => ({
          headerTitle: _title,
          headerLeft: () => null,
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
          headerTitle: "Podsumowanie ocen",
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}
