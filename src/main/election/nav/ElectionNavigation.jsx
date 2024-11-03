import { useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ElectionScreen from "../ElectionScreen.jsx";
import CalculatorScreen from "../CalculatorScreen.jsx";
import CalendarScreen from "../CalendarScreen.jsx";
import ElectoralDistrictsScreen from "../ElectoralDistrictsScreen.jsx";
import ElectoralCommitteeScrean from "../ElectoralCommitteeScrean.jsx";
import ElectionExplanationScrean from "../ElectionExplanationScrean.jsx";
import SejmExplanationScrean from "../SejmExplanationScrean.jsx";
import PrezydentExplanationScrean from "../PrezydentExplanationScrean.jsx";
import EuExplanationScrean from "../EuExplanationScrean.jsx";

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
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="ElectoralDistricts"
        component={ElectoralDistrictsScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="ElectoralCommittee"
        component={ElectoralCommitteeScrean}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="ElectionExplanation"
        component={ElectionExplanationScrean}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="SejmExplanation"
        component={SejmExplanationScrean}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="PrezydentExplanation"
        component={PrezydentExplanationScrean}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="EuExplanation"
        component={EuExplanationScrean}
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
