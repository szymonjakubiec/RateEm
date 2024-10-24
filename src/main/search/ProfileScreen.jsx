import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useRoute } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const route = useRoute();
  const selectedPolitician =
    route.params?.data[route.params?.selectedPolitician - 1].value;
  route.params?.selectedPolitician;

  function print() {
    console.log(selectedPolitician);
  }
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
