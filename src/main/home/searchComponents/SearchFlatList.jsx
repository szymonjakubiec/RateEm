import { useEffect, useRef, useState, useContext } from "react";
import { StyleSheet, Text, FlatList, View, Animated, Easing, Keyboard, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { TextInput, Chip, MD2Colors } from "react-native-paper";
import { getAllPoliticians } from "../../../backend/database/Politicians.js";
import { GlobalContext } from "../../nav/GlobalContext.jsx";
import { getTrendingPoliticians } from "../../../backend/database/Politicians";
import { textInputProps } from "../../styles/TextInput";

export default function SearchFlatList({ data, handleOnPress }) {
  const updateDataTrigger = useContext(GlobalContext).updateDataTrigger; // triggered when user goes back from profile screen
  const [initialData, setInitialData] = useState(data); // all politicians
  const [filteredData, setFilteredData] = useState(data); // politicians after search
  const [trendingPoliticians, setTrendingPoliticians] = useState([]); // trending politicians
  const [searchText, setSearchText] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [numberOfDaysIndex, setnumberOfDaysIndex] = useState(0);
  const [numberOfDaysTable, setnumberOfDaysTable] = useState([1, 7, 30]);
  const [sortOrder, setsortOrder] = useState("surname");
  const [isSurnameSortingASC, setIsSurnameSortingASC] = useState(true);
  const [isNameSortingASC, setIsNameSortingASC] = useState(true);
  const [isGlobalRatingSortingASC, setIsGlobalRatingSortingASC] = useState(false);

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
   * Sets new data. Trigtered after going back from politicians profile.
   */
  useEffect(() => {
    async function getPoliticiansData() {
      setIsLoading(true);
      let reverseOrder = "surname";
      if (sortOrder === "surname") reverseOrder = isSurnameSortingASC;
      else if (sortOrder === "name") reverseOrder = isNameSortingASC;
      else if (sortOrder === "global_rating") reverseOrder = isGlobalRatingSortingASC;

      const data = isTrending
        ? await getTrendingPoliticians(numberOfDays, sortOrder, !reverseOrder)
        : await getAllPoliticians(sortOrder, !reverseOrder);

      setInitialData(data);
      setFilteredData(data);
      setIsLoading(false);
    }

    ClearTextInput();
    getPoliticiansData();
  }, [updateDataTrigger, sortOrder, isSurnameSortingASC, isNameSortingASC, isGlobalRatingSortingASC, isTrending, numberOfDays]);

  /**
   * Filters through the array of politician names, by obtaining indexes of each occurrence of " " and "-" into array of ints.
   * Then iterates through each starting position checking if any of them matches the input string.
   * @param {object} input
   */
  function handleInput(input) {
    let sourceData = initialData;
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

    // clearSortingButtons();
  }

  /**
   * Changes number of days from which we take the trending politicians.
   */
  const handleNumberOfDaysClick = () => {
    setnumberOfDaysIndex((prevIndex) => {
      const newIndex = prevIndex < 2 ? prevIndex + 1 : 0;
      setNumberOfDays(numberOfDaysTable[newIndex]);
      return newIndex;
    });
  };

  /**
   * Clears the text in input box and filteredData.
   */
  function ClearTextInput() {
    setSearchText("");
    if (isTrending) setFilteredData(trendingPoliticians);
    else setFilteredData(initialData);
    // clearSortingButtons();
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

      <View style={styles.chipsContainer}>
        {/* wszyscy politycy / politycy na czasie */}
        <Chip style={styles.chip} icon="account" disabled={isLoading} onPress={() => setIsTrending(!isTrending)}>
          {isTrending ? "Na Czasie" : "Wszyscy politycy"}
        </Chip>

        {/* Button do zmiany dni */}
        {isTrending ? (
          <Chip style={styles.chip} disabled={isLoading} onPress={handleNumberOfDaysClick}>
            Okres czasu: {numberOfDays}
          </Chip>
        ) : null}
      </View>

      <View style={styles.chipsContainer}>
        <Chip
          style={styles.chip}
          disabled={isLoading}
          icon={isSurnameSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
          mode={sortOrder === "surname" ? "flat" : "outlined"}
          onPress={() => {
            let reverseOrder = sortOrder == "surname" ? !isSurnameSortingASC : isSurnameSortingASC;
            setIsSurnameSortingASC(reverseOrder);
            setsortOrder("surname");
          }}
        >
          Nazwisko
        </Chip>

        <Chip
          style={styles.chip}
          disabled={isLoading}
          icon={isNameSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
          mode={sortOrder === "name" ? "flat" : "outlined"}
          onPress={() => {
            let reverseOrder = sortOrder == "name" ? !isNameSortingASC : isNameSortingASC;
            setIsNameSortingASC(reverseOrder);
            setsortOrder("name");
          }}
        >
          Imię
        </Chip>

        <Chip
          style={styles.chip}
          disabled={isLoading}
          icon={isGlobalRatingSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
          mode={sortOrder === "global_rating" ? "flat" : "outlined"}
          onPress={() => {
            let reverseOrder = sortOrder == "global_rating" ? !isGlobalRatingSortingASC : isGlobalRatingSortingASC;
            setIsGlobalRatingSortingASC(reverseOrder);
            setsortOrder("global_rating");
          }}
        >
          ocena globalna
        </Chip>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Ładowanie</Text>
          <ActivityIndicator size={"large"} animating={true} color={MD2Colors.red800} />
        </View>
      ) : filteredData.length !== 0 && !isLoading ? (
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          persistentScrollbar={true}
          style={styles.list(filteredData)}
          data={filteredData}
          extraData={initialData}
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
          {sortOrder === "name" ? (
            <Text style={styles.politicianItemText}>
              {name} {surname}
            </Text>
          ) : (
            <Text style={styles.politicianItemText}>
              {surname} {name}
            </Text>
          )}
          <Text style={styles.politicianScore}>Ocena globalna: {globalRating ? globalRating.toFixed(2) : "—"}</Text>
          <Text style={styles.politicianScore}>
            {isTrending ? "Ilość ostatnich ocen" : "Ilość ocen"}: {ratingCount ? ratingCount : "—"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  searchBox: {
    width: "90%",
    minWidth: "90%",
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

  chipsContainer: {
    marginVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  chip: {
    marginHorizontal: 2,
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

  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
