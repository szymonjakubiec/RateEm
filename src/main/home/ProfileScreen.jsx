import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useContext, useEffect, useRef, useState} from "react";
import {Image} from "react-native";
import {
  getOwnRating, addOwnRating, updateOwnRating,
  deleteOwnRating, getAllPoliticianOwnRatings
} from "../../backend/database/OwnRatings";
import {getRatingsUserIdPoliticianId, addRating, updateRating, deleteRating} from "../../backend/database/Ratings";
import {getPolitician, updatePolitician} from "../../backend/database/Politicians";
import OpinionsTile from "../home/opinionsTileComponents/OpinionsTile";
import {useTheme} from "react-native-paper";
import {GlobalContext} from "../nav/GlobalContext";
import {OpinionsTileContext} from "./nav/OpinionsTileContext";
import _Container from "../styles/Container";
import {tabBarAnim} from "../../backend/CommonMethods";



export default function ProfileScreen({navigation, route}) {
  const {selectedPoliticianId} = route.params;
  const {userId} = useContext(GlobalContext);

  const [politicianData, setPoliticianData] = useState(); // JSON object from Politicians.js
  const [politicianNames, setPoliticianNames] = useState();
  const [politicianSurname, setPoliticianSurname] = useState();
  const [photo, setPhoto] = useState();

  const [surnameTextHeight, setSurnameTextHeight] = useState(0); // for adjusting names and surname font sizes on long surnames

  const [party, setParty] = useState("Brak Partii");
  const [partyShort, setPartyShort] = useState("Brak Partii");

  const [globalRating, setGlobalRating] = useState(0.0);
  const [ownRating, setOwnRating] = useState(0.0);
  const [firstOwnRating, setFirstOwnRating] = useState(0);
  const [singleRatings, setSingleRatings] = useState([]); // ratings from ratings.js
  const [newSingleRating, setNewSingleRating] = useState(0);


  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  /**
   * Variable preventing using useEffect from ownRating right after it is initialized.
   */
  const useEffectFirstTime = useRef(true);


  const currentDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  useEffect(() => {
    init();
  }, []);


  async function init() {
    loadPoliticianData();
    if (await loadSingleRatings() === false) {
      countGlobalRating();
    }
  }

  /**
   * Asynchronously gets data about politician from Politicians.js in JSON object, then extracts information about global rating, own rating, names and surname.
   * If own rating is not null then screen displays the component to see the single ratings. If it is null then displays the component that enables setting
   * initial rate.
   * @async
   */
  async function loadPoliticianData() {
    const data = await getPolitician(selectedPoliticianId);
    setPoliticianData(data);
    // if (data.at(0).global_rating !== null) setGlobalRating(data.at(0).global_rating);
    if (data.at(0).party !== null) {
      setParty(data.at(0).party);
    }
    setPoliticianNames(data.at(0).name);
    setPoliticianSurname(data.at(0).surname);
    setPhoto(data.at(0).picture);
  }

  /**
   * Loads asynchronously ownRating and if it is not null then allows to run loadSingleRatings.
   * Also sets loadOwnRatingInitialized to allow updating the globalRating after completing the whole function.
   * @returns {Promise<boolean>}
   */
  async function loadOwnRating() {
    const data = await getOwnRating(userId, selectedPoliticianId);
    if (data !== null) {
      setOwnRating(data.at(0).value);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Loads asynchronously all single ratings from Ratings.js from a user about politician into singleRatings array.
   */
  async function loadSingleRatings() {
    const data = await getRatingsUserIdPoliticianId(userId, selectedPoliticianId);
    if (data !== null) {
      setSingleRatings(data);
      return true;
    }
    return false;
  }

  /**
   * Runs every time the singleRatings table is updated and has at least 1 record.
   * It calculates ownRating as the weighted average, and uploads the result to the base.
   */
  async function countOwnRating() {
    let numerator = 0;
    let denominator = 0;

    for (singleRating of singleRatings) {
      numerator = numerator + singleRating.value * singleRating.weight;
      denominator = denominator + singleRating.weight;
    }

    let weightedAverage = Math.round((numerator * 100) / denominator) / 100; // round number to 2 decimal places

    // console.log("Srednia ważona wychodzi: " + weightedAverage);
    await updateOwnRating(selectedPoliticianId, userId, weightedAverage);

    setOwnRating(weightedAverage);
  }

  /**
   * Runs right after ownRating is added/updated.
   * It downloads ownRatings if there are any, from all users, calculates globalRating as the arithmetical average, and uploads the result to the base.
   * @returns {Promise<void>}
   */
  async function countGlobalRating() {
    const politicianOwnRatings = await getAllPoliticianOwnRatings(selectedPoliticianId);
    let numerator = 0;
    let denominator = 0;
    let average = 0;

    for (politicianOwnRating of politicianOwnRatings) {
      numerator += politicianOwnRating.value;
      denominator += 1;
    }

    if (denominator > 0) {
      average = Math.round((numerator * 100) / denominator) / 100;
    }

    // console.log("Średnia globalna wynosi: " + average);

    setGlobalRating(average);
    updatePolitician(selectedPoliticianId, {global_rating: average});
  }

  async function handleFirstOwnRating() {
    await addRating(
      userId,
      selectedPoliticianId,
      `OPINIA BAZOWA`,
      firstOwnRating,
      `Opinia bazowa o polityku ${politicianNames} ${politicianSurname}.`,
      currentDate,
      10
    );
    await addOwnRating(userId, selectedPoliticianId, firstOwnRating);
    setFirstOwnRating(0);
    await loadSingleRatings();
  }

  async function handleNewSingleRating() {
    await addRating(userId, selectedPoliticianId, newTitle, newSingleRating, newDescription, currentDate, 1);
    setNewSingleRating(0);
    setNewTitle("");
    setNewDescription("");
    await loadSingleRatings();
  }

  /**
   * Update states passed to the OpinionsTile.jsx
   */
  function handleOtFirstOwnRating(starRating) { // Ot - OpinionsTile
    setFirstOwnRating(starRating);
  }

  function handleOtNewSingleRating(newTitle, starRating, newDescription) {
    setNewSingleRating(starRating);
    setNewTitle(newTitle);
    setNewDescription(newDescription);
  }


  /**
   * Updates specific single rating and runs loadSingleRatings which triggers setOwnRating.
   * @param itemId
   * @param titleUpdate
   * @param ratingUpdate
   * @param descriptionUpdate
   * @returns {Promise<void>}
   */
  async function updateSingleRating(itemId, titleUpdate, ratingUpdate, descriptionUpdate) {
    await updateRating(itemId, {
      user_id: userId,
      politicianId: selectedPoliticianId,
      title: titleUpdate,
      value: ratingUpdate,
      description: descriptionUpdate,
      date: currentDate,
    });
    loadSingleRatings();
  }

  /**
   * Updates specific single rating and runs loadSingleRatings which triggers setOwnRating.
   * @param itemId
   * @param ratingUpdate
   * @returns {Promise<void>}
   */
  async function updateFirstOwnRating(itemId, ratingUpdate) {
    await updateRating(itemId, {
      user_id: userId,
      politicianId: selectedPoliticianId,
      value: ratingUpdate,
      date: currentDate,
    });
    loadSingleRatings();
  }

  /**
   * Deletes selected rating and recalculates ownRating and globalRating.
   * @param itemId
   * @returns {Promise<void>}
   */
  async function deleteSingleRating(itemId) {
    await deleteRating(itemId);
    loadSingleRatings();
  }

  /**
   * Deletes the last rating in the singleRatings array and nullifies this array, ownRating and recalculates the globalRating.
   * @param itemId
   * @returns {Promise<void>}
   */
  async function deleteFirstOwnRating(itemId) {
    await deleteRating(itemId);
    await deleteOwnRating(userId, selectedPoliticianId);
    setSingleRatings([]);
    setOwnRating(0);
  }

  /**
   * If the rating to update is of weight = 1 (singleRating) then updates the title, description and value of rating.
   * If the rating is of weight = 10, but it is the only value on the list then updates only the value.
   * @param itemId
   * @param itemWeight
   * @param titleUpdate
   * @param ratingUpdate
   * @param descriptionUpdate
   * @returns {Promise<void>}
   */
  async function handleOtSingleRatingUpdate(itemId, itemWeight, titleUpdate, ratingUpdate, descriptionUpdate) {
    if (itemWeight === 1) {
      updateSingleRating(itemId, titleUpdate, ratingUpdate, descriptionUpdate);
    } else if (singleRatings.length === 1) {
      updateFirstOwnRating(itemId, ratingUpdate);
    }
  }

  async function handleOtSingleRatingDeletion(itemId, itemWeight) {
    if (itemWeight === 1) {
      deleteSingleRating(itemId);
    } else if (singleRatings.length === 1) {
      deleteFirstOwnRating(itemId);
    }
  }

  useEffect(() => {
    if (firstOwnRating) {
      handleFirstOwnRating();
    }
  }, [firstOwnRating]);

  useEffect(() => {
    if (newSingleRating && newTitle && newDescription) {
      handleNewSingleRating();
    }
  }, [newSingleRating, newTitle, newDescription]);

  useEffect(() => {
    if (singleRatings.length > 0) {
      countOwnRating();
    }
  }, [singleRatings]);


  useEffect(() => {
    if (useEffectFirstTime.current === false) {
      countGlobalRating();
    } else {
      useEffectFirstTime.current = false;
    }
  }, [ownRating]);


  const theme = useTheme();

  return (
    <_Container style={styles.container}>
      <ScrollView style={styles.scrollView(theme)} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.infoTile(theme)}>
          <View style={styles.nameContainer}>
            <View style={styles.nameSurnameColumn}>
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.surname}>
                {politicianSurname}
              </Text>
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.names}>
                {politicianNames}
              </Text>
            </View>
            <View style={styles.imageContainer(theme)}>
              {photo ? (
                <Image
                  style={styles.image(theme)}
                  source={{
                    uri: `data:image/jpeg;base64,${photo}`,
                    cache: "force-cache",
                  }}
                  alt="politician"
                />
              ) : (
                <Image source={require("./../../../assets/noPhoto.png")} alt="politician" style={styles.image(theme)}/>
              )}
            </View>
          </View>
          <View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Globalna ocena:</Text>
              <Text style={styles.rating(theme)}>
                {globalRating > 0 ? globalRating.toFixed(2) : "   -   "}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Twoja ocena:</Text>
              <Text style={styles.rating(theme)}>
                {ownRating > 0 ? ownRating.toFixed(2) : "   -   "}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.ratingLabel}>Partia polityczna:</Text>
            <Text style={styles.party}>{party}</Text>
          </View>
        </View>
        <OpinionsTileContext.Provider
          value={{
            singleRatings: singleRatings,
            handleFirstOwnRating: handleOtFirstOwnRating,
            handleNewSingleRating: handleOtNewSingleRating,
            handleSingleRatingUpdate: handleOtSingleRatingUpdate,
            handleSingleRatingDeletion: handleOtSingleRatingDeletion,
          }}
        >
          <OpinionsTile ownRating={ownRating}/>
        </OpinionsTileContext.Provider>
      </ScrollView>
    </_Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "1%",
    paddingTop: "1%",
  },
  scrollView: (theme) => ({
    backgroundColor: theme.colors.background,
    // backgroundColor: "green",
    width: "100%",
  }),
  scrollViewContent: {
    paddingBottom: 10,
    // height: "auto",
    // flexGrow: 1,
    // gap: 15,
  },
  infoTile: (theme) => ({
    flex: 1,
    padding: 20,
    margin: 10,
    gap: 20,

    backgroundColor: theme.colors.primaryContainer2,

    borderRadius: 15,

    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }),
  nameContainer: {
    flexDirection: "row",
    height: "40%",
  },
  nameSurnameColumn: {
    justifyContent: "center",
    flexGrow: 1,
    maxWidth: "80%",
  },
  surname: {
    fontSize: 28,
    fontWeight: "bold",
    maxWidth: "90%",
  },
  names: {
    maxWidth: "90%",
    fontSize: 24,
    height: "auto",
    fontWeight: "semibold",
  },
  imageContainer: (theme) => ({
    elevation: 7,
    shadowColor: theme.colors.shadow,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,

    height: 105,
  }),
  image: (theme) => ({
    height: "100%",
    aspectRatio: 1,
    borderColor: theme.colors.inverseSurface,
    borderWidth: 3,
    borderRadius: 15,
  }),
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingRight: "6%",
    marginBottom: 3,
  },
  ratingLabel: {
    fontSize: 22,
    fontWeight: "bold",
  },
  rating: (theme) => ({
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surfaceDisabled,
    borderRadius: 3,
  }),
  party: {
    fontSize: 16,
    
    paddingTop: 3,
    paddingBottom: "4%",
  },
});
