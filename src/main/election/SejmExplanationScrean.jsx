import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, TextInput } from "react-native";

export default function SejmExplanation() {
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleDiv}>
        <View style={styles.circleSejm} />
        <Text style={styles.title}>Wytłumaczenie wyborów do sejmu i senatu.</Text>
      </View>
      <ScrollView style={styles.scrollView}></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "4%",
  },

  scrollView: {
    width: "100%",
    height: "100%",
    marginHorizontal: 20,
  },

  titleDiv: {
    alignSelf: "left",
    flexDirection: "row",
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
  circleSejm: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 10,
    marginVertical: 7,
    backgroundColor: "#12cdd4",
  },
});
