import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { PoliticianNameContext } from "./PoliticianNameContext.jsx";

export default function SearchScreen({ navigation }) {
  const politicianNameData = useContext(PoliticianNameContext);
  const [selectedPolitician, setSelectedPolitician] = useState("");

  /**
   * Navigation to the ProfileScreen.js
   */
  function navigateToProfile() {
    if (selectedPolitician !== "") {
      navigation.navigate("Profile", {
        selectedPolitician,
      });
    }
  }

  return (
    <View style={styles.container}>
      <SelectList
        data={politicianNameData}
        placeholder="Wyszukaj polityka"
        searchPlaceholder="Wyszukaj polityka"
        setSelected={
          (selected) =>
            setSelectedPolitician(politicianNameData[selected - 1].value) // sets the name and surname of selected politician
        }
        onSelect={navigateToProfile()}
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
