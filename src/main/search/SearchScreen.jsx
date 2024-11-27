import {
  StyleSheet,
  View,
} from "react-native";
import {
  useContext,
  useEffect,
  useState,
} from "react";
import {PoliticianNameContext} from "./PoliticianNameContext.jsx";
import SearchFlatList from "./searchScreenComponents/SearchFlatList.jsx";



export default function SearchScreen({ navigation }) {
  const politicianNameData = useContext(PoliticianNameContext);
  const [selectedPoliticianId, setSelectedPoliticianId] = useState(0);

  function handlePress(selected) {
    setSelectedPoliticianId(selected);
  }

  useEffect(() => {
    setSelectedPoliticianId(0);
  }, []);
  /**
   * Navigation to the ProfileScreen.js after selection of politician.
   */
  useEffect(() => {
    if (selectedPoliticianId > 0) {
      navigation.navigate("Profile", {
        selectedPoliticianId,
      });
      setSelectedPoliticianId(0);
    }
  }, [selectedPoliticianId]);

  return (
    <View style={styles.container}>
      <SearchFlatList data={politicianNameData} handleOnPress={handlePress} />
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
  dropdownStyle: {
    width: "80%",
    minWidth: "80%",

    // backgroundColor: "whitesmoke",
    // borderColor: "#000",
    // borderWidth: 2,
  },
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
