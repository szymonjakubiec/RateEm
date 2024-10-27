import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";

export default function ProfileScreen({ navigation }) {
  const route = useRoute();
  const data = route.params?.data;
  const selectedPolitician = route.params?.selectedPolitician;

  // async function init() {
  //   selectedPolitician = await data.find(
  //     (x) => x.key === route.params?.selectedPolitician
  //   ).value;
  //   console.log(selectedPolitician);
  // }

  // useLayoutEffect(() => {
  //   init();
  // }, [selectedPolitician]);

  return (
    <View style={styles.container}>
      <Text>To jest profil {selectedPolitician}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 70,
  },
});
