import {useEffect, useContext} from "react";
import {BackHandler} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {HeaderBackButton} from "@react-navigation/elements";
import {createStackNavigator} from "@react-navigation/stack";
import {GlobalContext} from "../../nav/GlobalContext.jsx";
import HomeScreen from "../HomeScreen";
import ProfileScreen from "../ProfileScreen";



const Stack = createStackNavigator();

export default function HomeNavigation({route}) {

  const navigation = useNavigation();

  const _title = route.params?._title;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={() => ({
          title: _title,
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
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          title: "Profil polityka",
          headerTitleAlign: "center",
          // headerLeft: () => <HeaderBackButton onPress={() => goToBackToSearch()} title="Info" color="#fff"/>,
        })}
      />
    </Stack.Navigator>
  );
}
