import {memo, useEffect, useRef, useState} from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Animated,
  Easing,
  Keyboard,
  ActivityIndicator,
  ScrollView
} from "react-native";
import {TextInput, Chip, useTheme} from "react-native-paper";
import {getAllPoliticians} from "../../../backend/database/Politicians.js";
import {getTrendingPoliticians} from "../../../backend/database/Politicians";
import {useTextInputProps} from "../../styles/TextInput";
import Item from "./Item";



function SearchFlatList({handleOnPress}) {
  const [initialData, setInitialData] = useState([]); // all politicians
  const [filteredData, setFilteredData] = useState([]); // politicians after search
  const [searchText, setSearchText] = useState("");

  const [isTrending, setIsTrending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const numberOfDaysTable = [
    {key: 1, value: "1 dzień"},
    {key: 7, value: "7 dni"},
    {key: 30, value: "1 miesiąc"},
  ];
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [numberOfDaysDisplay, setNumberOfDaysDisplay] = useState(numberOfDaysTable[0].value);
  const [numberOfDaysIndex, setNumberOfDaysIndex] = useState(0);

  const [sortOrder, setSortOrder] = useState("surname");
  const [isSurnameSortingASC, setIsSurnameSortingASC] = useState(true);
  const [isNameSortingASC, setIsNameSortingASC] = useState(true);
  const [isGlobalRatingSortingASC, setIsGlobalRatingSortingASC] = useState(false);
  const [isRatingCountSortingASC, setIsRatingCountSortingASC] = useState(false);

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
   * Sets new data. Triggered after going back from politicians profile.
   */
  useEffect(() => {
    async function getPoliticiansData() {
      setIsLoading(true);
      let reverseOrder = "surname";
      if (sortOrder === "surname") reverseOrder = isSurnameSortingASC;
      else if (sortOrder === "name") reverseOrder = isNameSortingASC;
      else if (sortOrder === "global_rating") reverseOrder = isGlobalRatingSortingASC;
      else if (sortOrder === "rating_count") reverseOrder = isRatingCountSortingASC;

      const data = isTrending
        ? await getTrendingPoliticians(numberOfDays, sortOrder, !reverseOrder)
        : await getAllPoliticians(sortOrder, !reverseOrder, 100);

      setInitialData(data || []);
      setFilteredData(data || []);
      setIsLoading(false);

      const dataFull = isTrending
        ? await getTrendingPoliticians(numberOfDays, sortOrder, !reverseOrder)
        : await getAllPoliticians(sortOrder, !reverseOrder);

      // console.log(data[0]);
      // console.log(dataFull[0]);
      setInitialData(dataFull || []);
      setFilteredData(dataFull || []);
    }

    ClearTextInput();
    getPoliticiansData();
  }, [sortOrder, isSurnameSortingASC, isNameSortingASC, isGlobalRatingSortingASC, isRatingCountSortingASC, isTrending, numberOfDays]);

  async function onRefresh() {
    setIsLoading(true);
    let reverseOrder = "surname";
    if (sortOrder === "surname") reverseOrder = isSurnameSortingASC;
    else if (sortOrder === "name") reverseOrder = isNameSortingASC;
    else if (sortOrder === "global_rating") reverseOrder = isGlobalRatingSortingASC;
    else if (sortOrder === "rating_count") reverseOrder = isRatingCountSortingASC;

    const data = isTrending
      ? await getTrendingPoliticians(numberOfDays, sortOrder, !reverseOrder)
      : await getAllPoliticians(sortOrder, !reverseOrder, 100);

    ClearTextInput();
    setInitialData(data || []);
    setFilteredData(data || []);
    setIsLoading(false);

    const dataFull = isTrending
      ? await getTrendingPoliticians(numberOfDays, sortOrder, !reverseOrder)
      : await getAllPoliticians(sortOrder, !reverseOrder);

    // console.log(data[0]);
    // console.log(dataFull[0]);
    setInitialData(dataFull || []);
    setFilteredData(dataFull || []);
  }

  /**
   * Filters through the array of politician names, by obtaining indexes of each occurrence of " " and "-" into array of ints.
   * Then iterates through each starting position checking if any of them matches the input string.
   * @param {object} input
   */
  function handleInput(input) {
    let sourceData = initialData;

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
  }

  /**
   * Changes number of days from which we take the trending politicians.
   */
  const handleNumberOfDaysClick = () => {
    setNumberOfDaysIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % numberOfDaysTable.length;
      setNumberOfDays(numberOfDaysTable[newIndex].key);
      setNumberOfDaysDisplay(numberOfDaysTable[newIndex].value);
      return newIndex;
    });
  };

  /**
   * Clears the text in input box and filteredData.
   */
  function ClearTextInput() {
    setSearchText("");
    setFilteredData(initialData);
  }

  /**
   * Handler for ScrollView's onMomentum event to remove padding bug when scrolling too fast to left.
   * @param event
   */
  const onMomentumHandler = (event) => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const maxOffset = contentSize.width - layoutMeasurement.width;
    if (contentOffset.x < 25) {
      event.currentTarget.scrollTo({x: 0, animated: true});
    } else if (contentOffset.x > maxOffset - 25) {
      event.currentTarget.scrollTo({x: maxOffset, animated: true});
    }
  };


  const theme = useTheme();

  return (
    <View style={styles.searchFlatList}>
      <View style={styles.searchBox}>

        {/* wyszukiwarka */}
        <TextInput
          {...useTextInputProps()}
          style={styles.searchInput}
          label="Wyszukaj polityka"
          returnKeyType="search"
          autoComplete="name"
          textContentType="name"
          autoCapitalize="words"
          value={searchText}
          disabled={isLoading}
          left={<TextInput.Icon disabled={isLoading} icon="magnify" onPress={() => Keyboard.dismiss()}/>}
          right={<TextInput.Icon disabled={isLoading} icon="close" style={{opacity: opacityAnim}}
                                 onPress={() => ClearTextInput()}/>}
          onChangeText={(text) => {
            setSearchText(text.trim());
            handleInput(text.trim());
          }}
        />
      </View>

      <ScrollView
        horizontal={true}
        scrollEnabled={!isLoading}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => onMomentumHandler(event)}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          flexGrow: 1,
          position: "relative",
        }}
        style={styles.filtersScrollView}
      >
        <View style={styles.chipsContainer}>
          {/* wszyscy politycy / politycy na czasie */}
          <Chip style={styles.chip} textStyle={styles.chipLabel}
                icon={isTrending ? "trending-up" : "account"}
                mode={"flat"} disabled={isLoading}
                onPress={() => setIsTrending(!isTrending)}>
            {isTrending ? "Na Czasie" : "Wszyscy"}
          </Chip>

          {/* Button do zmiany dni */}
          {isTrending ? (
            <Chip style={styles.chip} disabled={isLoading} onPress={handleNumberOfDaysClick}
                  textStyle={styles.chipLabel}>
              Okres: {numberOfDaysDisplay}
            </Chip>
          ) : null}
        </View>
      </ScrollView>

      <ScrollView
        horizontal={true}
        scrollEnabled={!isLoading}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        onMomentumScrollEnd={(event) => onMomentumHandler(event)}
        contentContainerStyle={{
          flexGrow: 1,
          position: "relative",
        }}
        style={styles.filtersScrollView}
      >
        <View style={styles.chipsContainer}>
          <Chip
            style={styles.chip}
            textStyle={styles.chipLabel}
            disabled={isLoading}
            icon={isSurnameSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
            mode={sortOrder === "surname" ? "flat" : "outlined"}
            onPress={() => {
              let reverseOrder = sortOrder === "surname" ? !isSurnameSortingASC : isSurnameSortingASC;
              setIsSurnameSortingASC(reverseOrder);
              setSortOrder("surname");
            }}
          >
            Nazwisko
          </Chip>

          <Chip
            style={styles.chip}
            textStyle={styles.chipLabel}
            disabled={isLoading}
            icon={isNameSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
            mode={sortOrder === "name" ? "flat" : "outlined"}
            onPress={() => {
              let reverseOrder = sortOrder === "name" ? !isNameSortingASC : isNameSortingASC;
              setIsNameSortingASC(reverseOrder);
              setSortOrder("name");
            }}
          >
            Imię
          </Chip>

          <Chip
            style={styles.chip}
            textStyle={styles.chipLabel}
            disabled={isLoading}
            icon={isGlobalRatingSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
            mode={sortOrder === "global_rating" ? "flat" : "outlined"}
            onPress={() => {
              let reverseOrder = sortOrder === "global_rating" ? !isGlobalRatingSortingASC : isGlobalRatingSortingASC;
              setIsGlobalRatingSortingASC(reverseOrder);
              setSortOrder("global_rating");
            }}
          >
            Ocena globalna
          </Chip>

          <Chip
            style={styles.chip}
            textStyle={styles.chipLabel}
            disabled={isLoading}
            icon={isRatingCountSortingASC ? "arrow-up-thin" : "arrow-down-thin"}
            mode={sortOrder === "rating_count" ? "flat" : "outlined"}
            onPress={() => {
              let reverseOrder = sortOrder === "rating_count" ? !isRatingCountSortingASC : isRatingCountSortingASC;
              setIsRatingCountSortingASC(reverseOrder);
              setSortOrder("rating_count");
            }}
          >
            Liczba ocen
          </Chip>
        </View>
      </ScrollView>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={45} animating={true} color={theme.colors.primary}/>
          <Text style={styles.errorText}>Ładowanie...</Text>
        </View>
      ) : filteredData.length !== 0 ? (
        <FlatList
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          persistentScrollbar={true}
          style={styles.list}
          contentContainerStyle={{paddingHorizontal: 5, paddingBottom: 5}}
          data={filteredData}
          extraData={initialData}
          onRefresh={onRefresh}
          refreshing={isLoading}
          keyExtractor={(item) => item.key}
          renderItem={({item}) => (
            <Item
              id={item.key}
              nameSurname={item.value}
              name={item.name.split(' ')[0]} //PK: Żeby tylko imię
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
        <Text style={styles.noResultsText}>Brak wyników.</Text>
      )}
    </View>
  );
}

export const SearchFlatListMemo = memo(SearchFlatList);

const styles = StyleSheet.create({

  searchFlatList: {
    flex: 1,
  },

  searchBox: {
    width: "90%",
    minWidth: "90%",
    marginVertical: 20,
    height: 50,
  },
  searchInput: {
    flexGrow: 1,
  },
  list: {
    marginVertical: 5,
    flexGrow: 0,
    paddingHorizontal: 5,
    marginHorizontal: -5,
  },

  filtersScrollView: {
    maxWidth: "90%",
    alignSelf: "center",
    minHeight: 40,
    alignContent: "center",
    flexGrow: 0,
    marginVertical: 3,
  },
  chipsContainer: {
    paddingTop: 4,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    justifyContent: "center",
    marginHorizontal: 2,
    minHeight: 38,
    marginVertical: 5,
  },
  chipLabel: {
    fontSize: 16,
    marginRight: 10,
  },

  noResultsText: {
    height: "74%",
    paddingLeft: "7%",
    paddingTop: "5%",
    fontSize: 20,
  },

  loaderContainer: {
    height: "74%",
    alignItems: "center",
    paddingTop: "20%",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
  },
});


