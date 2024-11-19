import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

export default function SummaryScreen() {
  return (
    <View style={styles.container}>
      <Text>To jest podsumowanie.</Text>
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
