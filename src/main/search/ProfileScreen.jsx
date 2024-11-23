import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Image } from "react-native";
import {
  getOwnRating,
  addOwnRating,
  updateOwnRating,
} from "../../backend/database/OwnRatings";
import {
  getRating,
  getRatingsUserIdPoliticianId,
  addRating,
} from "../../backend/database/Ratings";
import { getPolitician } from "../../backend/database/Politicians";
import StarRating from "react-native-star-rating-widget";

export default function ProfileScreen({ navigation, route }) {
  const { selectedPoliticianId } = route.params;
  const [politicianData, setPoliticianData] = useState(); // JSON object from Politicians.js
  const [politicianNames, setPoliticianNames] = useState();
  const [politicianSurname, setPoliticianSurname] = useState();

  const [surnameTextHeight, setSurnameTextHeight] = useState(0); // for adjusting names and surname font sizes on long surnames

  const [party, setParty] = useState("Oszuści i Złodzieje"); // by default
  const [partyShort, setPartyShort] = useState("OiZ"); // by default

  const [globalRating, setGlobalRating] = useState(0.0);
  const [ownRating, setOwnRating] = useState(0.0);
  const [firstOwnRating, setFirstOwnRating] = useState(0);
  const [singleRatings, setSingleRatings] = useState([]); // these are ratings from ratings.js
  const [newSingleRating, setNewSingleRating] = useState(0);
  const [starRating, setStarRating] = useState(0);

  const [wrongRatingInfo, setWrongRatingInfo] = useState("");

  const newTitleRef = useRef("");
  const newDescriptionRef = useRef("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [expandedRatingList, setExpandedRatingList] = useState(false);
  const [expandedRating, setExpandedRating] = useState(false);
  const [expandedAddOpinion, setExpandedAddOpinion] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(0);

  const userId = 2;

  const currentDate = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;

  useEffect(() => {
    init();
  }, []);

  function init() {
    loadPoliticianData();
    loadOwnRating();
    loadSingleRatings();
  }

  /**
   * Asynchronously gets data about politician from Politicians.js in JSON object, then extracts information about global rating, own rating, names and surname.
   * If own rating is not null then screen displays the component to see the single ratings. If it is null then displays the component that enables setting
   * initial rate.
   * @async
   */
  async function loadPoliticianData() {
    try {
      const data = await getPolitician(selectedPoliticianId);
      setPoliticianData(data);
      if (data.at(0).global_rating != null)
        setGlobalRating(data.at(0).global_rating);
      if (data.at(0).party != null) {
        setParty(data.at(0).party);
      }
      setPoliticianNames(data.at(0).name);
      setPoliticianSurname(data.at(0).surname);
    } catch (error) {
      console.log("Error with loading politician data: " + error);
    }
  }

  async function loadOwnRating() {
    try {
      const ownRating = (await getOwnRating(userId, selectedPoliticianId)).at(
        0
      ).value;
      setOwnRating(ownRating.toFixed(2));
    } catch (error) {
      console.log("Error with loading own rating: " + error);
    }
  }

  /**
   * Loads asynchronously all single ratings from Ratings.js from a user about politician into singleRatings array.
   */
  async function loadSingleRatings() {
    try {
      const data = await getRatingsUserIdPoliticianId(
        userId,
        selectedPoliticianId
      );
      if (data !== null) {
        setSingleRatings(data);
      }
    } catch (error) {
      console.log("Error with loading single ratings: " + error);
    }
  }

  /**
   * Calculates whether surnameTextHeight takes more than 1 line.
   * @returns {number}
   */
  function calculateFontSize() {
    if (surnameTextHeight > 32) {
      return 21;
    }
    return 24;
  }

  function OpinionsTile() {
    if (ownRating === 0) {
      return displayNoOpinionComponent();
    } else {
      return displayYourOpinionsComponent();
    }
  }

  function displayNoOpinionComponent() {
    return (
      <View style={styles.opinionsTile}>
        <Text>Brak opinii</Text>
        <Text>Masz już wyrobione zdanie o tym polityku?</Text>
        <Text>Ustaw opinię bazową</Text>
        <StarRating
          rating={starRating}
          onChange={setStarRating}
          enableHalfStar={false}
        />
        <Text style={styles.wrongInputText}>{wrongRatingInfo}</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={setBaseRate} // function to set firstRating if >= 1
        >
          <Text>Ustaw</Text>
        </TouchableHighlight>
      </View>
    );
  }

  function displayYourOpinionsComponent() {
    return (
      <View style={styles.opinionsTile}>
        <View>
          <TouchableHighlight
            onPress={() => {
              setExpandedRatingList(!expandedRatingList);
            }}
          >
            <Text style={{ fontWeight: "500", fontSize: 20 }}>
              Twoje opinie
            </Text>
          </TouchableHighlight>
        </View>
        <RatingsList />
        <AddOpinion />
      </View>
    );
  }

  /**
   * Component with a FlatList of single ratings.
   * @returns
   */
  function RatingsList() {
    if (expandedRatingList === true) {
      return (
        <FlatList
          data={singleRatings}
          renderItem={RatingItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      );
    }
  }

  /**
   * Component
   * @param {object} item
   * @returns
   */
  function RatingItem({ item }) {
    return (
      <TouchableHighlight
        onPress={() => {
          if (selectedItemId !== item.id) setSelectedItemId(item.id);
          else setSelectedItemId(0);
        }}
      >
        <View style={styles.ratingItem}>
          <View style={styles.ratingItemBase}>
            <View>
              <Text>{item.date}</Text>
              <Text>{item.title}</Text>
            </View>
            <View>
              <Text>{item.value}</Text>
            </View>
          </View>
          <ItemExtension item={item} />
        </View>
      </TouchableHighlight>
    );
  }

  function ItemExtension({ item }) {
    if (selectedItemId === item.id) {
      return (
        <View style={{ backgroundColor: "gray", padding: 10 }}>
          <Text>{item.description}</Text>
          <TouchableHighlight
            style={styles.button}
            onPress={() => console.log("Not yet, WIP")}
          >
            <Text>Usuń opinię</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  function AddOpinion() {
    if (expandedAddOpinion === false) {
      return (
        <TouchableHighlight
          style={styles.ratingItem}
          onPress={() => setExpandedAddOpinion(true)}
        >
          <Text
            style={{ fontWeight: "500", fontSize: 20, alignSelf: "center" }}
          >
            Dodaj opinię
          </Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <View style={styles.ratingItem}>
          <TouchableHighlight onPress={() => setExpandedAddOpinion(false)}>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 18,
                alignSelf: "flex-start",
              }}
            >
              Dodaj opinię
            </Text>
          </TouchableHighlight>
          <TextInput
            style={styles.textInput}
            placeholder="Wstaw tytuł"
            ref={newTitleRef}
            onChangeText={(input) => {
              newTitleRef.current.value = input;
            }}
            onBlur={() => setNewTitle(newTitleRef.current.value)}
          />
          <StarRating
            rating={starRating}
            onChange={setStarRating}
            enableHalfStar={false}
          />
          <Text style={styles.wrongInputText}>{wrongRatingInfo}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Wstaw komentarz do opinii"
            ref={newDescriptionRef}
            onChangeText={(input) => (newDescriptionRef.current.value = input)}
            onBlur={() => setNewDescription(newDescriptionRef.current.value)}
          />
          <TouchableHighlight
            style={styles.button}
            onPress={setSingleRate} // function to set firstRating if >= 1
          >
            <Text>Ustaw</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  /**
   * Checks if the starRating is at least 1 and set it into firstOwnRating, which fires
   */
  function setBaseRate() {
    if (starRating >= 1) {
      setFirstOwnRating(starRating);
      setWrongRatingInfo("");
    } else {
      setWrongRatingInfo("Ocena polityka musi wynosić przynajmniej 1.");
    }
  }

  function setSingleRate() {
    if (starRating >= 1) {
      setNewSingleRating(starRating);
      setWrongRatingInfo("");
    } else {
      setWrongRatingInfo("Ocena polityka musi wynosić przynajmniej 1.");
    }
  }

  // only for adding single rating into DB
  function countOwnRating(newSingleRating) {
    let numerator = 0;
    let denominator = 0;
    for (singleRating of singleRatings) {
      numerator = numerator + singleRating.value * singleRating.weight;
      denominator = denominator + singleRating.weight;
    }
    numerator = numerator + newSingleRating * 1;
    denominator = denominator + 1;
    let weightedAverage = Math.round((numerator * 100) / denominator) / 100; // round number to 2 decimal places
    console.log("Srednia ważona wychodzi: " + weightedAverage);
    setOwnRating(weightedAverage);

    updateOwnRating(selectedPoliticianId, userId, weightedAverage);
  }

  async function handleFirstOwnRating() {
    await addRating(
      userId,
      selectedPoliticianId,
      `Bazowa opinia o ${politicianNames} ${politicianSurname}`,
      firstOwnRating,
      "Użytkownik ma już wyrobione zdanie.",
      currentDate,
      10
    );
    addOwnRating(userId, selectedPoliticianId, firstOwnRating);
    setOwnRating(firstOwnRating);
    setFirstOwnRating(0);
    loadSingleRatings();
  }

  async function handleNewSingleRating(){
    await addRating(
      userId,
      selectedPoliticianId,
      newTitle,
      newSingleRating,
      newDescription,
      currentDate,
      1
    );
    countOwnRating(newSingleRating);
    setNewSingleRating(0);
    setNewTitle("");
    setNewDescription("");
    loadSingleRatings();
  }
  
  useEffect(() => {
    if (firstOwnRating) {
      handleFirstOwnRating()
    }
  }, [firstOwnRating]);
  
  useEffect(() => {
    if (newSingleRating && newTitle && newDescription) {
      handleNewSingleRating()
    }
  }, [newSingleRating, newTitle, newDescription]);
  
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.infoTile}>
          <View style={styles.nameContainer}>
            <View style={styles.nameSurnameColumn}>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.surname}
                // onLayout={(event) => {
                //   const height = event.nativeEvent.layout.height;
                //   const fontSize = height > 33 ? 21 : 24;
                //   console.log(height);
                //   setSurnameTextHeight(fontSize);
                // }}
              >
                {politicianSurname}
              </Text>
              <Text style={styles.names}>{politicianNames}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("./../../../assets/Jan_Paweł_Adamczewski.png")}
                alt="politician"
              />
            </View>
          </View>
          <View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>Globalna ocena:</Text>
              <View>
                <Text style={styles.rating}>{globalRating}</Text>
                {/* <Image>star</Image> */}
              </View>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>Twoja ocena:</Text>
              <View>
                <Text style={styles.rating}>{ownRating}</Text>
                {/* <Image>star</Image> */}
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.rating}>Partia polityczna:</Text>
            <Text>{party}.</Text>
          </View>
        </View>
        <OpinionsTile />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    padding: 10,
    gap: 10,
  },
  infoTile: {
    // height: "100vh",
    height: 300,
    backgroundColor: "lightgray",
    padding: 30,
    gap: 20,
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "white",
    height: "30%",
  },
  nameSurnameColumn: {
    // backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    maxWidth: "80%",
  },
  surname: {
    fontSize: 22,
    fontWeight: "bold",
    maxWidth: "90%",
    // backgroundColor: "lightblue",
  },
  names: {
    maxWidth: "90%",
    fontSize: 22,
    height: "auto",
    fontWeight: "semibold",
  },
  imageContainer: {
    // flexGrow: 6,
    borderWidth: 5,
  },
  image: {
    height: "100%",
    aspectRatio: 1 / 1,
    borderColor: "black",
  },
  ratingRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rating: {
    fontSize: 22,
    fontWeight: "bold",
  },
  opinionsTile: {
    backgroundColor: "lightgray",
    padding: 30,
  },
  button: {
    width: "60%",
    backgroundColor: "whitesmoke",
    borderColor: "#000",
    borderWidth: 1,
    textAlign: "center",
    marginTop: 10,
  },
  wrongInputText: {
    fontSize: 10,
    color: "red",
    marginBottom: 15,
  },

  ratingItem: {
    backgroundColor: "gray",
    padding: 20,
    marginBottom: 10,
  },
  ratingItemBase: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "solid",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 20,
    paddingRight: 20,
    width: "90%",
  },
});
