import {createStackNavigator} from "@react-navigation/stack";
import ElectionScreen from "../ElectionScreen.jsx";
import CalculatorScreen from "../CalculatorScreen.jsx";
import CalendarScreen from "../CalendarScreen.jsx";
import ElectoralDistrictsScreen from "../ElectoralDistrictsScreen.jsx";
import ElectionExplanationScreen from "../ElectionExplanationScreen.jsx";
import SejmExplanationScreen from "../SejmExplanationScreen.jsx";
import PrezydentExplanationScreen from "../PrezydentExplanationScreen.jsx";
import EuExplanationScreen from "../EuExplanationScreen.jsx";
import DhondtExplanationScreen from "../DhondtExplanationScreen.jsx";



const Stack = createStackNavigator();

export default function ElectionNavigation({route}) {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={ElectionScreen}
        options={() => ({
          title: "Wybory",
          // headerShown: false,
          headerTitleStyle: {
            fontSize: 24
          },
          headerTitleAlign: "center",
          headerLeft: () => null,
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
          headerTitle: "Kalkulator mandatów do Sejmu",
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
        component={ElectionExplanationScreen}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="SejmExplanation"
        component={SejmExplanationScreen}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="PrezydentExplanation"
        component={PrezydentExplanationScreen}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="EuExplanation"
        component={EuExplanationScreen}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="DhondtExplanation"
        component={DhondtExplanationScreen}
        options={() => ({
          headerTitle: "Wytłumaczenie wyborów",
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
    </Stack.Navigator>
  );
}
