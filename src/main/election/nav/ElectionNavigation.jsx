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
import {Text, View} from "react-native";
import {Icon, useTheme} from "react-native-paper";



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
          headerTitle: () => (
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Icon color={useTheme().colors.sejm} size={22} source="circle-slice-8"/>
              <Text style={{fontSize: 20, fontWeight: 500, paddingLeft: 5}}>Wybory do Sejmu</Text>
            </View>
          ),
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="PrezydentExplanation"
        component={PrezydentExplanationScreen}
        options={() => ({
          headerTitle: () => (
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Icon color={useTheme().colors.prezydent} size={22} source="circle-slice-8"/>
              <Text style={{fontSize: 20, fontWeight: 500, paddingLeft: 5}}>Wybory Prezydenta RP</Text>
            </View>
          ),
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="EuExplanation"
        component={EuExplanationScreen}
        options={() => ({
          headerTitle: () => (
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Icon color={useTheme().colors.parlament} size={22} source="circle-slice-8"/>
              <Text style={{fontSize: 20, fontWeight: 500, paddingLeft: 5}}>Wybory do Parlamentu Europejskiego</Text>
            </View>
          ),
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="DhondtExplanation"
        component={DhondtExplanationScreen}
        options={() => ({
          headerTitle: () => (
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Icon color="black" size={22} source="circle-slice-8"/>
              <Text style={{fontSize: 20, fontWeight: 500, paddingLeft: 5}}>Metoda d'Hondta</Text>
            </View>
          ),
          headerTitleAlign: "center",
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
    </Stack.Navigator>
  );
}
