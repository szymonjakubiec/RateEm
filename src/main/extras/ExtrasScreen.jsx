import React from "react";
import {View, Text, TouchableHighlight, StyleSheet} from "react-native";



export default function ExtrasScreen({navigation}) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate("Settings")}
        underlayColor="#005BB5" // feedback when pressed
      >
        <Text style={styles.buttonText}>Ustawienia konta</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate("Summary")}
        underlayColor="#005BB5"
      >
        <Text style={styles.buttonText}>Podsumowanie ocen</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate("Guide")}
        underlayColor="#005BB5"
      >
        <Text style={styles.buttonText}>Przewodnik po aplikacji</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.popToTop(); //todo większa logika
        }}
        underlayColor="#D23F3F" // feedback when pressed
      >
        <Text style={styles.buttonText}>Wyloguj się</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
