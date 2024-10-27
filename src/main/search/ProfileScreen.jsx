import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";

export default function ProfileScreen({ navigation, route }) {
  const { data, selectedPolitician } = route.params;
  // const selectedPoliticianName = data[selectedPolitician];
  // async function init() {
  //   selectedPolitician = await data.find(
  //     (x) => x.key === route.params?.selectedPolitician
  //   ).value;
  //   console.log(selectedPolitician);
  // }

  // useLayoutEffect(() => {
  //   init();
  // }, [selectedPolitician]);
  // console.log(selectedPolitician.value);
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
