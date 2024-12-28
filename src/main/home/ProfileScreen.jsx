import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {Image} from "react-native";
import {
  addOwnRating, updateOwnRating,
  deleteOwnRating, countPoliticianOwnRatings
} from "../../backend/database/OwnRatings";
import {
  getRatingsUserIdPoliticianId,
  addRating,
  updateRating,
  deleteRating,
  countRatingsUserIdPoliticianId
} from "../../backend/database/Ratings";
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

  const [isLoading, setIsLoading] = useState(true);
  const [isCountingRatings, setIsCountingRatings] = useState(false);

  const [politicianData, setPoliticianData] = useState(); // JSON object from Politicians.js
  const [politicianNames, setPoliticianNames] = useState();
  const [politicianSurname, setPoliticianSurname] = useState();
  const [photo, setPhoto] = useState();

  const [party, setParty] = useState("Brak Partii");
  const [partyShort, setPartyShort] = useState("Brak Partii");

  const [globalRating, setGlobalRating] = useState(0.0);
  const [ownRating, setOwnRating] = useState(0.0);
  const [firstOwnRating, setFirstOwnRating] = useState(0.0);
  const [singleRatings, setSingleRatings] = useState([]); // ratings from ratings.js
  const [newSingleRating, setNewSingleRating] = useState(0.0);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const currentDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setIsLoading(true);
    await loadPoliticianData();
    await reloadRatings();
    setIsLoading(false);
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
    if (data.at(0).party !== null) {
      setParty(data.at(0).party);
    }
    setPoliticianNames(data.at(0).name);
    setPoliticianSurname(data.at(0).surname);
    setPhoto(data.at(0).picture);
  }

  /**
   * Loads/reloads singleRatings from database and counts ownRating and globalRating.
   * @returns {Promise<void>}
   */
  async function reloadRatings() {
    loadSingleRatings();
    setIsCountingRatings(true);
    await countOwnRating();
    await countGlobalRating();
    setIsCountingRatings(false);
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
   * Calculates ownRating as the weighted average, and uploads the result to the base.
   */
  async function countOwnRating() {
    let data = await countRatingsUserIdPoliticianId(userId, selectedPoliticianId);
    let weightedAverage = data[0].result;
    await updateOwnRating(selectedPoliticianId, userId, weightedAverage);

    setOwnRating(weightedAverage);
  }

  /**
   * Calculates globalRating as the arithmetical average, and uploads the result to the base.
   * @returns {Promise<void>}
   */
  async function countGlobalRating() {
    let average = await countPoliticianOwnRatings(selectedPoliticianId);

    setGlobalRating(average[0].result);
    await updatePolitician(selectedPoliticianId, {global_rating: average[0].result});
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
    await reloadRatings();
  }

  async function handleNewSingleRating() {
    await addRating(userId, selectedPoliticianId, newTitle, newSingleRating, newDescription, currentDate, 1);
    setNewSingleRating(0);
    setNewTitle("");
    setNewDescription("");
    await reloadRatings();
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
   * Updates specific single rating and reload all ratings.
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
    });
    await reloadRatings();
  }

  /**
   * Updates specific single rating and reloads all ratings.
   * @param itemId
   * @param ratingUpdate
   * @returns {Promise<void>}
   */
  async function updateFirstOwnRating(itemId, ratingUpdate) {
    await updateRating(itemId, {
      user_id: userId,
      politicianId: selectedPoliticianId,
      value: ratingUpdate,
    });
    await reloadRatings();
  }

  /**
   * Deletes selected rating and reloads all ratings.
   * @param itemId
   * @returns {Promise<void>}
   */
  async function deleteSingleRating(itemId) {
    await deleteRating(itemId);
    await reloadRatings();
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
    await reloadRatings();
  }

  /**
   * Updates selected rating in database.
   * @param itemId
   * @param itemWeight
   * @param titleUpdate
   * @param ratingUpdate
   * @param descriptionUpdate
   * @returns {Promise<void>}
   */
  async function handleOtSingleRatingUpdate(itemId, itemWeight, titleUpdate, ratingUpdate, descriptionUpdate) {
    if (itemWeight === 1) {
      await updateSingleRating(itemId, titleUpdate, ratingUpdate, descriptionUpdate);
    } else if (singleRatings.length === 1) {
      await updateFirstOwnRating(itemId, ratingUpdate);
    }
  }

  /**
   * Deletes selected rating from database.
   * @param itemId
   * @param itemWeight
   * @returns {Promise<void>}
   */
  async function handleOtSingleRatingDeletion(itemId, itemWeight) {
    if (itemWeight === 1) {
      await deleteSingleRating(itemId);
    } else if (singleRatings.length === 1) {
      await deleteFirstOwnRating(itemId);
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
              <Text style={[styles.rating(theme), (isCountingRatings || globalRating === 0) && {color: "transparent"}]}>
                {globalRating > 0 ? globalRating.toFixed(2) : "   -   "}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Twoja ocena:</Text>
              <Text style={[styles.rating(theme), (isCountingRatings || ownRating === 0) && {color: "transparent"}]}>
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
    paddingRight: "2%",
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
