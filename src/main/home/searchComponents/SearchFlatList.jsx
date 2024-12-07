import { useEffect, useRef, useState } from "react";
import { TouchableHighlight, StyleSheet, Text, FlatList, View, Animated, Easing, Keyboard } from "react-native";
import { TextInput } from "react-native-paper";
import { textInputProps } from "../../styles/TextInput";

export default function SearchFlatList({ data, handleOnPress }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  // PK: Clear button animation
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // PK: Fade in
    searchText.length > 0 &&
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: (value) => Easing.ease(value),
      }).start();

    // PK: Fade out
    searchText.length === 0 &&
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: (value) => Easing.ease(value),
      }).start();
  }, [searchText]);

  /**
   * Filters through the array of politician names, by obtaining indexes of each occurrence of " " and "-" into array of ints.
   * Then iterates through each starting position checking if any of them matches the input string.
   * @param {object} input
   */
  function handleInput(input) {
    if (input.length !== 0) {
      let result = data.filter((obj) =>
        [0, ...obj.value.matchAll(/[ -]/g)]
          .map((x) => x.index + 1 ?? 0) // creates a table of indexes of all words in name
          .some(
            (ind) => obj.value.toLowerCase().startsWith(input.toLowerCase(), ind) // searches through each of these words
          )
      );
      if (result.length !== 0) setFilteredData(result);
      else setFilteredData([]);
    } else {
      setFilteredData([]);
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
          {...textInputProps}
          style={styles.searchInput}
          label="Wyszukaj polityka"
          returnKeyType="search"
          autoComplete="name"
          textContentType="name"
          autoCapitalize="words"
          value={searchText}
          left={<TextInput.Icon icon="magnify" onPress={() => Keyboard.dismiss()} />}
          right={
            <TextInput.Icon
              icon="close"
              style={{ opacity: opacityAnim }}
              onPress={() => {
                ClearTextInput();
                // Keyboard.dismiss()
              }}
            />
          }
          onChangeText={(text) => {
            setSearchText(text);
            handleInput(text.trim());
          }}
        />
      </View>
      {filteredData.length !== 0 ? (
        <FlatList
          keyboardDismissMode={"on-drag"}
          keyboardShouldPersistTaps={"handled"}
          persistentScrollbar={true}
          style={styles.list(filteredData)}
          data={filteredData}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => <Item id={item.key} nameSurname={item.value} handleOnPress={handleOnPress} ClearTextInput={ClearTextInput} />}
        />
      ) : (
        <Text style={styles.noResultsText(searchText)}>Brak wyników.</Text>
      )}
    </View>
  );
}

function Item({ id, nameSurname, handleOnPress, ClearTextInput }) {
  return (
    <TouchableHighlight
      underlayColor="#00000033"
      style={styles.item}
      onPress={() => {
        handleOnPress(id);
        ClearTextInput();
      }}
    >
      <Text style={styles.itemText}>{nameSurname}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    width: "80%",
    minWidth: "80%",
    marginTop: 30,
    marginBottom: 10,
    height: 50,
  },
  searchInput: {
    flexGrow: 1,
  },
  list: (result) => ({
    maxWidth: "80%",
    borderWidth: result.length === 0 ? 0 : 1,
    borderRadius: 3,
    borderStyle: "dashed",
    marginTop: 5,
    margin: 1,
    marginBottom: 20,
    flexGrow: 0,
  }),
  item: {
    borderRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 18,
  },
  noResultsText: (text) => ({
    opacity: text ? 0.7 : 0,
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 17,
  }),
  clearButton: {
    alignSelf: "center",
    padding: 5,
  },
  clearButtonText: {
    color: "blue",
  },
});
