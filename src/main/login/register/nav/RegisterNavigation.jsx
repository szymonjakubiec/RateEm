import {createStackNavigator} from "@react-navigation/stack";
import RegisterScreen from "../RegisterScreen";
import ConfirmScreen from "../ConfirmScreen";
import SuccessScreen from "../SuccessScreen";



const Stack = createStackNavigator();

export default function RegisterNavigation({route}) {
  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          // headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
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
        name="Success"
        component={SuccessScreen}
        options={() => ({
          headerTitle: _title,
          headerLeft: () => null,
          headerTitleAlign: "center",
        })}
      />

    </Stack.Navigator>
  );
}
