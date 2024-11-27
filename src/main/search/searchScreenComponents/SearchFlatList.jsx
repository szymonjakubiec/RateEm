import { useState } from "react";
import {TouchableHighlight, StyleSheet, Text, Alert} from "react-native";
import { FlatList, TextInput, View } from "react-native";

  

export default function SearchFlatList({ data, handleOnPress }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  
  /**
   * Filters through the array of politician names, by obtaining indexes of each occurrence of " " and "-" into array of ints. 
   * Then iterates through each starting position checking if any of them matches the input string.
   * @param {object} input
   */
  function handleInput(input) {
    if (input.length !== 0) {
      let result = data.filter((obj) =>
        [0, ...obj.value.matchAll(/[ -]/g)].map(x => x.index+1 ?? 0) // creates a table of indexes of all words in name
          .some(
            (ind) => obj.value.toLowerCase().startsWith(input.toLowerCase(), ind) // searches through each of these words
          )
      )
      if (result.length !== 0)
        setFilteredData(result);
      else 
        setFilteredData([{key: 0, value: "Nie znaleziono rezultatów"}]);
      
    } else {
      setFilteredData([]);
    }
  }

  /**
   * Button to clear the input text (and filteredData) if there's any.
   * @returns {JSX.Element}
   * @constructor
   */
  function ClearTextInputButton() {
    if (searchText !== ""){
      return(
        <TouchableHighlight onPress={ClearTextInput} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Wyczyść</Text>
        </TouchableHighlight>
      )
    }
  }

  /**
   * Clears the text in input box and filteredData.
   */
  function ClearTextInput() {
    setSearchText("");
    setFilteredData([]);
  }

  return (
    <View>
      <View style={styles.searchBox}>

        <TextInput
          onChangeText={(input) => {
            handleInput(input.trim());
            setSearchText(input);
          }}
          placeholder="Wyszukaj polityka"
          value={searchText}
          style={styles.searchInput}
        />
        
        <ClearTextInputButton />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Item
            id={item.key}
            nameSurname={item.value}
            handleOnPress={handleOnPress}
            ClearTextInput={ClearTextInput}
            disabled={filteredData[0].value === "Nie znaleziono rezultatów"}
          />
        )}
      />
    </View>
  );
}

function Item({ id, nameSurname, handleOnPress, ClearTextInput, disabled }) {
  return (
    <TouchableHighlight 
      style={styles.item} 
      onPress={() => {
        handleOnPress(id);
        ClearTextInput();
        
      }}
      disabled={disabled}
    >
      <Text style={styles.itemText}>{nameSurname}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  searchBox:{
    borderColor: "#000",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    width: "80%",
    minWidth: "80%",
  },
  searchInput: {
    flexGrow: 1,
    padding: 5,
  },
  clearButton: {
    alignSelf: "center",
    padding: 5,
  },
  clearButtonText:{
    color: "blue",
  },
  item: {
    width: "80%",
    padding: 5,
  },
  itemText: {
    fontSize: 18,
  },
});
