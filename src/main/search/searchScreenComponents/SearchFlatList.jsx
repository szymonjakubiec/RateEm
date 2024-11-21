import { useState } from "react";
import { TouchableHighlight, StyleSheet, Text } from "react-native";
import { FlatList, TextInput, View } from "react-native";

export default function SearchFlatList({ data, handleOnPress }) {
  const [filteredData, setFilteredData] = useState([]);
  /**
   * Filters through the array of politician names
   * @param {object} input
   */
  function handleInput(input) {
    if (input.length !== 0) {
      setFilteredData(
        data.filter((obj) =>
          obj.value.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setFilteredData([]);
    }
  }

  return (
    <View>
      <TextInput
        onChangeText={(input) => handleInput(input.trim())}
        placeholder="Wyszukaj polityka"
        style={styles.searchBox}
      ></TextInput>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Item
            id={item.key}
            nameSurname={item.value}
            handleOnPress={handleOnPress}
          />
        )}
      />
    </View>
  );
}

function Item({ id, nameSurname, handleOnPress }) {
  return (
    <TouchableHighlight style={styles.item} onPress={() => handleOnPress(id)}>
      <Text style={styles.itemText}>{nameSurname}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    width: "80%",
    minWidth: "80%",
    borderColor: "#000",
    padding: 5,
    borderWidth: 1,
  },
  item: {
    width: "80%",
    padding: 5,
  },
  itemText: {
    fontSize: 18,
  },
});
