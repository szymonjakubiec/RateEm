import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, FlatList, View, Animated, Easing, Keyboard, TouchableOpacity, Image } from "react-native";
import { TextInput, Button, Chip } from "react-native-paper";
import { getTrendingPoliticians } from "../../../backend/database/Politicians";
import { textInputProps } from "../../styles/TextInput";

export default function SearchFlatList({ data, handleOnPress }) {
  // data - wszyscy politycy
  const [filteredData, setFilteredData] = useState(data); // politycy po wyszukaniu
  const [trendingPoliticians, setTrendingPoliticians] = useState([]); // politycy na czasie

  const [searchText, setSearchText] = useState("");
  const [isTrending, setIsTrending] = useState(false);

  const [numberOfDays, setNumberOfDays] = useState(1);
  const [numberOfDaysIndex, setnumberOfDaysIndex] = useState(0);
  const [numberOfDaysTable, setnumberOfDaysTable] = useState([1, 7, 30]);

  const [sorting, setSorting] = useState("surname");
  const [isNameSortingASC, setIsNameSortingASC] = useState(true);
  const [isSurnameSortingASC, setIsSurnameSortingASC] = useState(true);
  // const [isGlobalRatingSortingASC, setIsGlobalRatingSortingASC] = useState(true);

  // PK: Clear button animation
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function fetchRatings() {
      const fetchedRatings = await getTrendingPoliticians(numberOfDays);
      setTrendingPoliticians(fetchedRatings);
      setFilteredData(fetchedRatings);
      handleInput(searchText);
    }

    fetchRatings();

    setSorting("surname");
    setIsNameSortingASC(true);
    setIsSurnameSortingASC(true);
  }, [numberOfDays]);

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

  useEffect(() => {
    {
      isTrending ? setFilteredData(trendingPoliticians) : setFilteredData(data);
    }
    handleInput(searchText);

    setSorting("surname");
    setIsNameSortingASC(true);
    setIsSurnameSortingASC(true);
  }, [isTrending]);

  /**
   * Filters through the array of politician names, by obtaining indexes of each occurrence of " " and "-" into array of ints.
   * Then iterates through each starting position checking if any of them matches the input string.
   * @param {object} input
   */
  function handleInput(input) {
    let sourceData = data;
    if (isTrending) {
      sourceData = trendingPoliticians;
    }

    let result = sourceData.filter((obj) =>
      [0, ...obj.value.matchAll(/[ -]/g)]
        .map((x) => x.index + 1 ?? 0) // creates a table of indexes of all words in name
        .some(
          (ind) => obj.value.toLowerCase().startsWith(input.toLowerCase(), ind) // searches through each of these words
        )
    );
    if (result.length !== 0) {
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }

    setSorting("surname");
    setIsNameSortingASC(true);
    setIsSurnameSortingASC(true);
  }

  const handleNumberOfDaysClick = () => {
    setnumberOfDaysIndex((prevIndex) => {
      const newIndex = prevIndex < 2 ? prevIndex + 1 : 0;
      setNumberOfDays(numberOfDaysTable[newIndex]);
      return newIndex;
    });
  };

  const handleSort = (key, isAsc) => {
    const sortedData = [...filteredData].sort((a, b) => {
      const comparison = a[key].toLocaleString().localeCompare(b[key].toLocaleString(), "pl");

      return isAsc ? comparison : -comparison;
    });

    setFilteredData(sortedData); // Update state with the sorted array
  };

  /**
   * Clears the text in input box and filteredData.
   */
  function ClearTextInput() {
    setSearchText("");
    if (isTrending) setFilteredData(trendingPoliticians);
    else setFilteredData(data);
  }

  return (
    <View>
      <View style={styles.searchBox}>
        {/* wyszukiwarka */}
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

      <View style={styles.chipDiv}>
        {/* wszyscy politycy / politycy na czasie */}
        <Chip icon="account" onPress={() => setIsTrending(!isTrending)}>
          {isTrending ? "Na Czasie" : "Wszyscy politycy"}
        </Chip>

        {/* Button do zmiany dni */}
        {isTrending ? (
          <View style={styles.chipsContainer}>
            <Text style={styles.chipLabel}>Okres czasu:</Text>
            <Button mode="contained" onPress={handleNumberOfDaysClick}>
              {numberOfDays}
            </Button>
          </View>
        ) : null}
      </View>

      <Chip
        style={styles.chipDiv}
        icon={isSurnameSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
        mode={sorting === "surname" ? "flat" : "outlined"}
        onPress={() => {
          let reverseOrder = isSurnameSortingASC;
          sorting === "surname" ? (reverseOrder = !isSurnameSortingASC) : null;
          sorting === "surname" ? setIsSurnameSortingASC(reverseOrder) : setSorting("surname");
          handleSort("surname", reverseOrder);
        }}
      >
        Nazwisko
      </Chip>

      <Chip
        style={styles.chipDiv}
        icon={isNameSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
        mode={sorting === "name" ? "flat" : "outlined"}
        onPress={() => {
          let reverseOrder = isNameSortingASC;
          sorting === "name" ? (reverseOrder = !isNameSortingASC) : null;
          sorting === "name" ? setIsNameSortingASC(reverseOrder) : setSorting("name");
          handleSort("name", reverseOrder);
        }}
      >
        Imię
      </Chip>

      {filteredData.length !== 0 ? (
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          persistentScrollbar={true}
          style={styles.list(filteredData)}
          data={filteredData}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Item
              id={item.key}
              nameSurname={item.value}
              name={item.name}
              surname={item.surname}
              globalRating={item.globalRating}
              ratingCount={item.ratingCount}
              picture={item.picture}
              handleOnPress={handleOnPress}
              isTrending={isTrending}
            />
          )}
        />
      ) : (
        <Text style={styles.noResultsText(searchText)}>Brak wyników.</Text>
      )}
    </View>
  );
}

function Item({ id, nameSurname, name, surname, globalRating, ratingCount, picture, handleOnPress, isTrending }) {
  return (
    <TouchableOpacity
      key={id}
      style={styles.politicianItem}
      onPress={() => {
        handleOnPress(id);
      }}
    >
      <Image
        source={
          picture && picture !== ""
            ? {
                uri: `data:image/jpeg;base64,${picture}`,
                cache: "force-cache",
              }
            : require("./../../../../assets/noPhoto.png")
        }
        style={styles.politicianItemImage}
      />
      <View style={styles.politicianInfo}>
        <Text style={styles.politicianItemText}>
          {surname} {name}
        </Text>
        <Text style={styles.politicianScore}>Ocena globalna: {globalRating ? globalRating.toFixed(2) : "—"}</Text>
        <Text style={styles.politicianScore}>
          {isTrending ? "Ilość ostatnich ocen" : "Ilość ocen"}: {ratingCount ? ratingCount : "—"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    width: "80%",
    minWidth: "80%",
    marginVertical: 10,
    height: 50,
  },
  searchInput: {
    flexGrow: 1,
  },
  list: (result) => ({
    maxWidth: "80%",
    marginTop: 5,
    margin: 1,
    marginBottom: 20,
    flexGrow: 0,
  }),

  chipDiv: {
    marginVertical: 2,
  },
  chipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 0,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },

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

  politicianItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  politicianItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
  politicianScore: {
    fontSize: 14,
    color: "#555",
  },
  politicianItemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  politicianInfo: {
    flex: 1,
  },
});
