import { createStackNavigator } from "@react-navigation/stack";
import ElectionScreen from "../ElectionScreen.jsx";
import CalculatorScreen from "../CalculatorScreen.jsx";
import CalendarScreen from "../CalendarScreen.jsx";
import ElectoralDistrictsScreen from "../ElectoralDistrictsScreen.jsx";
import ElectionExplanationScrean from "../ElectionExplanationScrean.jsx";
import SejmExplanationScrean from "../SejmExplanationScrean.jsx";
import PrezydentExplanationScrean from "../PrezydentExplanationScrean.jsx";
import EuExplanationScrean from "../EuExplanationScrean.jsx";

var Stack = createStackNavigator();

export default function ElectionNavigation({ route }) {
  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={ElectionScreen}
        options={() => ({
          headerTitle: "Wybory",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={() => ({
          headerTitle: "Kalendarz",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={() => ({
          headerTitle: "Kalkulator mandatów",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="ElectoralDistricts"
        component={ElectoralDistrictsScreen}
        options={() => ({
          headerTitle: "Okręgi wyborcze",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="ElectionExplanation"
        component={ElectionExplanationScrean}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="SejmExplanation"
        component={SejmExplanationScrean}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów - sejm",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="PrezydentExplanation"
        component={PrezydentExplanationScrean}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów - prezydent",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="EuExplanation"
        component={EuExplanationScrean}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów - eu",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
    </Stack.Navigator>
  );
}
