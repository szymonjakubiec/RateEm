import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import {
  getOwnRating,
  addOwnRating,
  updateOwnRating,
} from "../../backend/database/OwnRatings";
import { getRating, addRating } from "../../backend/database/Ratings";
import { getPolitician } from "../../backend/database/Politicians";
import StarRating from "react-native-star-rating-widget";

export default function ProfileScreen({ navigation, route }) {
  const { selectedPoliticianId } = route.params;
  const [politicianData, setPoliticianData] = useState();
  const [politicianNames, setPoliticianNames] = useState();
  const [politicianSurname, setPoliticianSurname] = useState();

  const [globalRating, setGlobalRating] = useState(0.0);
  const [ownRating, setOwnRating] = useState(0.0);
  const [party, setParty] = useState("Oszuści i Złodzieje"); // by default
  const [partyShort, setPartyShort] = useState("OiZ"); // by default
  const [singleRatings, setSingleRatings] = useState([]); // these are ratings from ratings.js
  const [starRating, setStarRating] = useState(0);
  const [newRating, setNewRating] = useState(0);

  const [wrongRatingInfo, setWrongRatingInfo] = useState("");

  const userId = 2;

  async function init() {
    await loadPoliticianData();
    await loadOwnRating();
    await loadSingleRatings();
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
        displayNoOpinionComponent();
      } else {
        displayYourOpinionsComponent();
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
      setOwnRating(ownRating);
    } catch (error) {
      console.log("Error with loading own rating: " + error);
    }
  }

  async function loadSingleRatings() {
    try {
      const data = await getRating(userId, selectedPoliticianId);
      if (data !== null) {
        setSingleRatings(data);
        console.log(data);
      }
    } catch (error) {
      console.log("Error with loading single ratings: " + error);
    }
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
          enableHalfStar={true}
        />
        <Text style={styles.wrongInputText}>{wrongRatingInfo}</Text>
        <TouchableHighlight
          style={styles.opinionsTileButton}
          onPress={setBaseRate}
        >
          <Text>Ustaw</Text>
        </TouchableHighlight>
      </View>
    );
  }

  function displayYourOpinionsComponent() {
    return (
      <View style={styles.opinionsTile}>
        <Text>Twoje opinie</Text>
      </View>
    );
  }

  function setBaseRate() {
    if (starRating >= 1) {
      setNewRating(starRating);
      setWrongRatingInfo("");
    } else {
      setWrongRatingInfo("Ocena polityka musi wynosić przynajmniej 1.");
    }
  }

  function countOwnRating(newRating) {
    let numerator = 0;
    let denominator = 0;
    for (singleRating of singleRatings) {
      numerator = numerator + singleRating.value * singleRating.weight;
      denominator = denominator + singleRating.weight;
    }
    numerator = numerator + newRating * 10;
    denominator = denominator + 10;
    let weightedAverage = numerator / denominator;
    console.log("Srednia ważona wychodzi: " + weightedAverage);
    setOwnRating(weightedAverage);

    if (singleRatings.length === 0) {
      addOwnRating(userId, selectedPoliticianId, weightedAverage);
    }
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (newRating) {
      addRating(
        userId,
        selectedPoliticianId,
        `Bazowa opinia o ${politicianNames} ${politicianSurname}`,
        newRating,
        "Użytkownik ma już wyrobione zdanie.",
        "2024-11-07",
        10
      );
      countOwnRating(newRating);
      setNewRating(0);

      loadSingleRatings();
    }
  }, [newRating]);

  return (
    <View style={styles.container}>
      <View style={styles.infoTile}>
        <View style={styles.nameContainer}>
          <View style={styles.nameSurnameColumn}>
            <Text style={styles.surname}>{politicianSurname}</Text>
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
          <Text>Globalna ocena: {globalRating}</Text>
          <Text>Twoja ocena: {ownRating}</Text>
        </View>
        <View>
          <Text>Partia polityczna: {party}.</Text>
        </View>
      </View>
      <OpinionsTile />
    </View>
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
    height: "50%",
    backgroundColor: "lightgray",
    padding: 30,
    gap: 20,
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    height: "30%",
    gap: 25,
  },
  nameSurnameColumn: {
    flexGrow: 11,
  },
  surname: {
    fontSize: 24,
    fontWeight: "bold",
  },
  names: {
    fontSize: 22,
    fontWeight: "semibold",
  },
  imageContainer: {
    flexGrow: 5,
  },
  image: {
    minHeight: 40,
    minWidth: 40,
    objectFit: "contain",
    width: "same-as-height",
    height: "100%",
  },
  opinionsTile: {
    height: "30%",
    backgroundColor: "lightgray",
    padding: 30,
  },
  opinionsTileButton: {
    width: "60%",
    backgroundColor: "whitesmoke",
    borderColor: "#000",
    borderWidth: 1,
  },
  wrongInputText: {
    fontSize: 10,
    color: "red",
    marginBottom: 15,
  },
});
