import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useContext, useEffect, useRef, useState, useLayoutEffect} from "react";
import {Image} from "react-native";
import {
  getOwnRating,
  addOwnRating,
  updateOwnRating,
  deleteOwnRating,
  getAllPoliticianOwnRatings,
  countPoliticianOwnRatings,
} from "../../backend/database/OwnRatings";
import {getRatingsUserIdPoliticianId, addRating, updateRating, deleteRating, countRatingsUserIdPoliticianId,} from "../../backend/database/Ratings";
import {getPolitician, updatePolitician} from "../../backend/database/Politicians";
import OpinionsTile from "../home/opinionsTileComponents/OpinionsTile";
import {useTheme} from "react-native-paper";
import {GlobalContext} from "../nav/GlobalContext";
import {OpinionsTileContext} from "../home/nav/OpinionsTileContext";
import _Container from "../styles/Container";
import {ownGoBack, tabBarAnim} from "../../backend/CommonMethods";



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

  const [globalRating, setGlobalRating] = useState(0);
  const [ownRating, setOwnRating] = useState(0);
  const [firstOwnRating, setFirstOwnRating] = useState(0);
  const [singleRatings, setSingleRatings] = useState([]); // ratings from ratings.js
  const [newSingleRating, setNewSingleRating] = useState(0);

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
    let data = await getPolitician(selectedPoliticianId);
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
  async function reloadRatings(){
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
    }
  }
  

  /**
   * Calculates ownRating as the weighted average, and uploads the result to the base.
   */
  async function countOwnRating() {
    let data = await countRatingsUserIdPoliticianId(userId, selectedPoliticianId);
    let weightedAverage = data[0].result;
    await updateOwnRating(selectedPoliticianId, userId, weightedAverage);

    if (weightedAverage > 0) 
      setOwnRating(weightedAverage);
    else
      setOwnRating(0);
  }

  /**
   * Calculates globalRating as the arithmetical average, and uploads the result to the base.
   * @returns {Promise<void>}
   */
  async function countGlobalRating() {
    let average = await countPoliticianOwnRatings(selectedPoliticianId);

    setGlobalRating(average[0].result);
    updatePolitician(selectedPoliticianId, {global_rating: average[0].result});
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
    await addOwnRating(userId, selectedPoliticianId, firstOwnRating);
    setFirstOwnRating(0);
    reloadRatings();
  }

  async function handleNewSingleRating() {
    await addRating(userId, selectedPoliticianId, newTitle, newSingleRating, newDescription, currentDate, 1);
    setNewSingleRating(0);
    setNewTitle("");
    setNewDescription("");
    reloadRatings();
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
      date: currentDate,
    });
    reloadRatings();
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
      date: currentDate,
    });
    reloadRatings();
  }

  /**
   * Deletes selected rating and reloads all ratings.
   * @param itemId
   * @returns {Promise<void>}
   */
  async function deleteSingleRating(itemId) {
    await deleteRating(itemId);
    reloadRatings();
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
    reloadRatings();
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
      updateSingleRating(itemId, titleUpdate, ratingUpdate, descriptionUpdate);
    } else if (singleRatings.length === 1) {
      updateFirstOwnRating(itemId, ratingUpdate);
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

  return (
    <ScrollView style={{backgroundColor: useTheme().colors.background}}>
      {!isLoading && <_Container style={styles.container}>
        <View style={styles.infoTile}>
          <View style={styles.nameContainer}>
            <View style={styles.nameSurnameColumn}>
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.surname}>
                {politicianSurname}
              </Text>
              <Text style={styles.names}>{politicianNames}</Text>
            </View>
            <View style={styles.imageContainer}>
              {photo ? (
                <Image
                  style={styles.image}
                  source={{
                    uri: `data:image/jpeg;base64,${photo}`,
                    cache: "force-cache",
                  }}
                  alt="politician"
                />
              ) : (
                <Image source={require("./../../../assets/noPhoto.png")} alt="politician" style={styles.image}/>
              )}
            </View>
          </View>
          <View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>Globalna ocena:</Text>
              {!isCountingRatings && <View>
                {globalRating > 0 ? (
                  <Text style={styles.rating}>{globalRating.toFixed(2)}</Text>
                  ) : (
                  <Text style={styles.rating}>Brak</Text>
                )}
                {/* <Image>star</Image> */}
              </View>}
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>Twoja ocena:</Text>
              {!isCountingRatings && <View>
                {ownRating > 0 ? (
                  <Text style={styles.rating}>{ownRating.toFixed(2)}</Text>
                  ) : (
                  <Text style={styles.rating}>Brak</Text>
                )}
                {/* <Image>star</Image> */}
              </View>}
            </View>
          </View>
          <View>
            <Text style={styles.rating}>Partia polityczna:</Text>
            <Text>{party}.</Text>
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
      </_Container> }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    padding: 10,
    gap: 15,
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
