import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

export default function ExtrasScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Text style={styles.buttonText}>Ustawienia konta</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("Summary");
        }}
      >
        <Text style={styles.buttonText}>Podsumowanie ocen</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("Guide");
        }}
      >
        <Text style={styles.buttonText}>Przewodnik po aplikacji</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          // TO DO  -  WYLOGOWANIE
        }}
      >
        <Text style={styles.buttonText}>Wyloguj się </Text>
      </TouchableHighlight>
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
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "80%",
  },
});
