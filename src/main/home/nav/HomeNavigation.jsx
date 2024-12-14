import { useEffect, useContext } from "react";
import { BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { createStackNavigator } from "@react-navigation/stack";
import { GlobalContext } from "../../nav/GlobalContext.jsx";
import HomeScreen from "../HomeScreen";
import ProfileScreen from "../ProfileScreen";

var Stack = createStackNavigator();

export default function HomeNavigation({ route }) {
  const updateDataTrigger = useContext(GlobalContext).updateDataTrigger;
  const { setUpdateDataTrigger } = useContext(GlobalContext);

  const navigation = useNavigation();
  const _title = route.params?._title;

  const goToBackToSearch = async () => {
    setUpdateDataTrigger(!updateDataTrigger);
    navigation.navigate("Search");
  };

  useEffect(() => {
    const backAction = () => {
      goToSearch();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={HomeScreen}
        options={() => ({
          title: "Rate'Em",
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => null,
          gestureEnabled: false, // wyłącza swipe back na IOS
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          title: "Rate'Em",
          headerTitle: _title,
          headerTitleAlign: "center",
          headerLeft: () => <HeaderBackButton onPress={() => goToBackToSearch()} title="Info" color="#fff" />,
        })}
      />
    </Stack.Navigator>
  );
}
