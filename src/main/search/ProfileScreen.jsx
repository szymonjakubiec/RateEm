import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {useContext, useEffect, useRef, useState} from "react";
import { Image } from "react-native";
import {
  getOwnRating,
  addOwnRating,
  updateOwnRating,
  deleteOwnRating,
  getAllPoliticianOwnRatings,
} from "../../backend/database/OwnRatings";
import {getRatingsUserIdPoliticianId, addRating, updateRating, deleteRating} from "../../backend/database/Ratings";
import {getPolitician, updatePolitician} from "../../backend/database/Politicians";
import OpinionsTile from "./opinionsTileComponents/OpinionsTile";
import {GlobalContext} from "../nav/GlobalContext";
import {OpinionsTileContext} from "./nav/OpinionsTileContext";



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
  const [singleRatings, setSingleRatings] = useState([]); // ratings from ratings.js
  const [newSingleRating, setNewSingleRating] = useState(0);
  
  const [isLoadOwnRatingInitialized, setIsLoadOwnRatingInitialized] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  /**
   * Variable preventing the ownRating from writing feedback before loading the globalRating to the screen.
   */
  const canUpdateGlobalRating = useRef(false);
  
  const {userId} = useContext(GlobalContext);
  
  const currentDate = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;

  useEffect(() => {
    init();
    navigation.getParent().setOptions({tabBarStyle: {display: 'none'}});
    return () => {
      navigation.getParent().setOptions({tabBarStyle: {height: 65, borderTopLeftRadius: 10,  borderTopRightRadius: 10}});
    };
  }, []);

  /**
   * Runs right after the loadOwnRating from useEffect above.
   */
  useEffect(() => {
    if (isLoadOwnRatingInitialized){
      canUpdateGlobalRating.current = true;
    }
    
  }, [isLoadOwnRatingInitialized]);

  async function init() {
    loadPoliticianData();
    if (await loadOwnRating()){
      loadSingleRatings();
    }
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
        setGlobalRating(data.at(0).global_rating.toFixed(2));
      if (data.at(0).party != null) {
        setParty(data.at(0).party);
      }
      setPoliticianNames(data.at(0).name);
      setPoliticianSurname(data.at(0).surname);
    } catch (error) {
      console.log("Error with loading politician data: " + error);
    }
  }

  /**
   * Loads asynchronously ownRating and if it is not null then allows to run loadSingleRatings. 
   * Also sets isLoadOwnRatingInitialized to allow updating the globalRating after completing the whole function.
   * @returns {Promise<boolean>}
   */
  async function loadOwnRating() {
    try {
      const ownRating = (await getOwnRating(userId, selectedPoliticianId)).at(
        0
      ).value;
      console.log("ownRating: " + ownRating);
      setOwnRating(ownRating.toFixed(2));
      return true;
    } catch (error) {
      console.log("Error with loading own rating: " + error);
      return false;
    } finally {
      setIsLoadOwnRatingInitialized(true);
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


  /**
   * Runs every time the singleRatings table is updated and has at least 1 record.
   * It calculates ownRating as the weighted average, and uploads the result to the base.
   */
  function countOwnRating() {
    let numerator = 0;
    let denominator = 0;
    
    for (singleRating of singleRatings) {
      numerator = numerator + singleRating.value * singleRating.weight;
      denominator = denominator + singleRating.weight;
    }
    
    let weightedAverage = Math.round((numerator * 100) / denominator) / 100; // round number to 2 decimal places
    
    console.log("Srednia ważona wychodzi: " + weightedAverage);
    setOwnRating(weightedAverage);
    updateOwnRating(selectedPoliticianId, userId, weightedAverage);
  }


  /**
   * Runs right after ownRating is added/updated. 
   * It downloads ownRatings from all users, calculates globalRating as the arithmetical average, and uploads the result to the base.
   * @returns {Promise<void>}
   */
  async function countGlobalRating(){
    const politicianOwnRatings = await getAllPoliticianOwnRatings(selectedPoliticianId);
    let numerator = 0;
    let denominator = 0;
    
    for (politicianOwnRating of politicianOwnRatings) { 
      if (politicianOwnRating.user_id !== userId){
        numerator += politicianOwnRating.value;
        denominator += 1;
      }
    }
    if (ownRating > 0){
      numerator += ownRating;
      denominator = denominator + 1;
    }
    
    let average = Math.round((numerator * 100) / denominator) / 100;
    
    console.log("Średnia globalna wynosi: " + average);    
    setGlobalRating(average);
    updatePolitician(selectedPoliticianId, {global_rating: average});
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
    // setOwnRating(firstOwnRating); 
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
    setNewSingleRating(0);
    setNewTitle("");
    setNewDescription("");
    loadSingleRatings(); 
  }

  
  /**
   * Update states passed to the OpinionsTile.jsx
   */
  function handleOtFirstOwnRating(starRating){ // Ot - OpinionsTile
    setFirstOwnRating(starRating)
  }

  function handleOtNewSingleRating(starRating){
    setNewSingleRating(starRating);
  }
  function handleOtNewTitle(newTitle){
    setNewTitle(newTitle);
  }
  function handleOtNewDescription(newDescription){
    setNewDescription(newDescription);
  }
  
  async function handleOtSingleRatingDeletion(item){
    if (item.weight === 1){
      await deleteRating(item.id);
      loadSingleRatings();
    } else if (singleRatings.length === 1){
      await console.log("ownRating.id: " + ownRating.id);
      await deleteRating(item.id);
      await deleteOwnRating(userId, selectedPoliticianId);
      // loadSingleRatings();
      setSingleRatings([]);
      setOwnRating(0);
    } else {
      Alert.alert("Nie można usunąć oceny bazowej kiedy są jeszcze inne opinie.");
    }
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

  useEffect(() => {
    console.log("singleRatings.length in useEffect");
    // console.log("singleRatings.length: ", singleRatings.length);
    if(singleRatings.length > 0){
      countOwnRating()
    }
  }, [singleRatings]);  

  useEffect(() => {
    if (canUpdateGlobalRating.current === true){
      countGlobalRating()
    }
  }, [ownRating]);

  
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
        <OpinionsTileContext.Provider 
          value={{
            singleRatings: singleRatings,
            handleNewSingleRating: handleOtNewSingleRating,
            handleNewTitle: handleOtNewTitle,
            handleNewDescription: handleOtNewDescription,
            handleSingleRatingDeletion: handleOtSingleRatingDeletion
          }}
        >
          <OpinionsTile
            ownRating={ownRating}
            handleFirstOwnRating={handleOtFirstOwnRating}
          />
        </OpinionsTileContext.Provider>
        
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
