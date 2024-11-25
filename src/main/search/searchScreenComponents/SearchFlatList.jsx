import {useState} from "react";
import {TouchableHighlight, StyleSheet, Text, FlatList, View, Keyboard} from "react-native";
import {TextInput} from "react-native-paper";
import textInput from "react-native-paper/src/components/TextInput/TextInput";



export default function SearchFlatList({data, handleOnPress}) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const _textInputProps = {
    mode: "outlined",
    activeOutlineColor: "black",
    selectTextOnFocus: true,
    returnKeyType: "next",
    style: styles.searchBox,
    selectionColor: "#bc15d279",
    cursorColor: "#b01ec386",
  };

  return (
    <View>
      <TextInput
        {..._textInputProps}
        label="Wyszukaj polityka"
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
        right={<TextInput.Icon icon="magnify" onPress={() => Keyboard.dismiss()}/>}
        onChangeText={(text) => {
          setSearchText(text.trim());
          handleInput(text.trim());
        }}
        style={styles.searchBox}
      />
      {filteredData.length !== 0
        ? (<FlatList
          keyboardDismissMode={"on-drag"}
          keyboardShouldPersistTaps={"handled"}
          persistentScrollbar={true}
          style={styles.list(filteredData)}
          data={filteredData}
          keyExtractor={(item) => item.key}
          renderItem={({item}) => (
            <Item
              id={item.key}
              nameSurname={item.value}
              handleOnPress={handleOnPress}
            />
          )}
        />)
        : (<Text style={styles.noResultsText(searchText)}>Brak wyników.</Text>)}
    </View>
  );
}

function Item({id, nameSurname, handleOnPress}) {
  return (
    <TouchableHighlight underlayColor="#00000033" style={styles.item} onPress={() => handleOnPress(id)}>
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
  list: (result) => ({
    borderWidth: result.length === 0 ? 0 : 1,
    borderRadius: 3,
    borderStyle: "dashed",
    margin: 1,
    paddingTop: 10,
    marginBottom: 20,
    flexGrow: 0,
  }),
  item: {
    alignSelf: "flex-start",
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 15,
    paddingHorizontal: 5,
    paddingVertical: 5,
    maxWidth: "80%"
  },
  itemText: {
    fontSize: 18,
  },
  noResultsText: (text) => ({
    opacity: text ? 0.7 : 0,
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 17,
  })
});
