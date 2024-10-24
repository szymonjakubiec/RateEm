import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [selectedPolitician, setSelectedPolitician] = useState("");

  const data = [
    { key: "1", value: "Korwinedes z Myken" },
    { key: "2", value: "Grzesio Braun" },
    { key: "3", value: "Donald Tusk" },
    { key: "4", value: "Jarek Kaczyński" },
    { key: "5", value: "Sławek Memcen" },
    { key: "6", value: "Szymon Kotłownia" },
    { key: "7", value: "Al Asad" },
  ];
  return (
    <View style={styles.container}>
      <SelectList
        data={data}
        placeholder="Wyszukaj polityka"
        searchPlaceholder="Wyszukaj polityka"
        setSelected={setSelectedPolitician}
        onSelect={() =>
          navigation.navigate("Profile", { data, selectedPolitician })
        }
        boxStyles={styles.boxStyle}
        dropdownStyles={styles.dropdownStyle}
        dropdownTextStyles={styles.dropdownTextStyle}
        dropdownItemStyles={styles.dropdownItemStyles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  boxStyle: {
    width: "80%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
  },
  dropdownStyle: {},
  dropdownItemStyles: {},
  dropdownTextStyle: {
    fontSize: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
  },
  searchText: {
    color: "#fff",
    textAlign: "center",
  },
  searchBar: {
    width: "100%",
    backgroundColor: "#eee",
  },
  containerSearchBar: {
    backgroundColor: "#8496f7",
  },
});
