import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";

export default function GuideScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Przewodnik po aplikacji</Text>

      <Text style={styles.description}>
        Aplikacja składa się z czterech głównych funkcjonalności:
      </Text>
      <Text style={styles.listItem}>• wyszukiwarka</Text>
      <Text style={styles.listItem}>• wybory</Text>
      <Text style={styles.listItem}>• tablica</Text>
      <Text style={styles.listItem}>• więcej</Text>

      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("SearchNav")}
      >
        <Text style={styles.sectionTitle}>🔍 Wyszukiwarka</Text>
        <Text style={styles.sectionDescription}>
          Zakładka służąca do znajdywania i oceniania osób.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("Election")}
      >
        <Text style={styles.sectionTitle}>📄 Wyborcze ABC</Text>
        <Text style={styles.sectionDescription}>
          Miejsce, w którym znajdują się wszystkie podstawowe informacje o
          wyborach.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("Trending")}
      >
        <Text style={styles.sectionTitle}>📰 Tablica</Text>
        <Text style={styles.sectionDescription}>
          Tu wyświetlane są posty z social mediów osób, które obserwujesz.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.sectionTitle}>≡ Więcej</Text>
        <Text style={styles.sectionDescription}>
          Odnośniki do ustawień, podsumowania ocen i innych funkcji.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 20,
  },
  section: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});
