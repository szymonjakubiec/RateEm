import {createStackNavigator} from "@react-navigation/stack";
import ResetScreen from "../ResetScreen";
import ResetConfirmScreen from "../ResetConfirmScreen";
import ResetSuccessScreen from "../ResetSuccessScreen";
import ChangePassScreen from "../ChangePassScreen";



const Stack = createStackNavigator();

export default function ResetPassNavigation({route}) {

  const _title = route.params?._title;


  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Reset"
        component={ResetScreen}
        options={() => ({
          headerTitle: _title,
          headerTitleAlign: "center",
          // headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="Confirm"
        component={ResetConfirmScreen}
        options={() => ({
          headerTitle: _title,
          headerLeft: () => null,
          headerTitleAlign: "center",
        })}
      />
      <Stack.Screen
        name="ChangePass"
        component={ChangePassScreen}
        options={() => ({
          headerTitle: _title,
          headerLeft: () => null,
          headerTitleAlign: "center",
        })}
      />
      <Stack.Screen
        name="Success"
        component={ResetSuccessScreen}
        options={() => ({
          headerTitle: _title,
          headerLeft: () => null,
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}
