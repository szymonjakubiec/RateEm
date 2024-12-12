import { useEffect, useContext } from "react";
import { BackHandler } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { createStackNavigator } from "@react-navigation/stack";
import { GlobalContext } from "../../nav/GlobalContext.jsx";
import { getAllPoliticians } from "../../../backend/database/Politicians.js";
import SearchScreen from "../HomeScreen";
import ProfileScreen from "../ProfileScreen";

var Stack = createStackNavigator();

export default function HomeNavigation({ route }) {
  const politicianData = useContext(GlobalContext).namesData;
  const { setNamesData } = useContext(GlobalContext);

  const navigation = useNavigation();
  const _title = route.params?._title;

  async function getPoliticiansData() {
    const data = await getAllPoliticians();
    setNamesData(data);
  }

  const goToSearch = () => {
    getPoliticiansData();

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
        component={SearchScreen}
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
          headerLeft: () => <HeaderBackButton onPress={() => goToSearch()} title="Info" color="#fff" />,
        })}
      />
    </Stack.Navigator>
  );
}
