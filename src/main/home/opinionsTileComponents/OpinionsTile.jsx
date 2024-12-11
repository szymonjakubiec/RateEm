import {FlatList, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import StarRating from "react-native-star-rating-widget";
import {useContext, useEffect, useRef, useState} from "react";
import {OpinionsTileContext} from "../nav/OpinionsTileContext";
import {RatingPopupTypes, ConfirmPopupTypes} from "../../../backend/EnumTypes"; 
import {Chip, Modal, Portal} from "react-native-paper";



export default function OpinionsTile({ownRating}) {
  const [ratingType, setRatingType] = useState(RatingPopupTypes.Undefined);

  const [expandedRatingList, setExpandedRatingList] = useState(false);

  const [ratingPopupVisible, setRatingPopupVisible] = useState(false);

  function turnOffRatingPopup(){
    setRatingPopupVisible(false);
    setRatingType(RatingPopupTypes.Undefined);
  }

  return(
    ownRating === 0 ? <NoOpinionComponent/> : <YourOpinionsComponent/>
  );


  function NoOpinionComponent() {
    useEffect(() => {
      if (ratingType !== RatingPopupTypes.Undefined) {
        setRatingPopupVisible(true);
      }
    }, [ratingType]);
    
    return (
      <View style={styles.opinionsTile}>
        <Text>Brak opinii</Text>
        <Text>Masz już wyrobione zdanie o tym polityku?</Text>
        <Text>Ustaw opinię bazową</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={() => setRatingType(RatingPopupTypes.Add)} // function to run the RatingPopup
        >
          <Text>Ustaw</Text>
        </TouchableHighlight>
        <RatingPopup
          popupVisible={ratingPopupVisible}
          itemWeight={10}
          popupType={ratingType}
          turnOffRatingPopup={turnOffRatingPopup}
        />
      </View>
    );
  }

  function YourOpinionsComponent() {
    useEffect(() => {
      if (ratingType !== RatingPopupTypes.Undefined) {
        setRatingPopupVisible(true);
      }
    }, [ratingType]);
    
    return (
      <View style={styles.opinionsTile}>
        <View style={styles.topBar}>
          <Text style={{fontWeight: "500", fontSize: 20}}>
            Twoje opinie
          </Text>
          <View style={styles.chipContainer}>
            <Chip 
              onPress={() => setExpandedRatingList(!expandedRatingList)}
              style={styles.chip}
            >
              {expandedRatingList ? (
                <Text style={styles.chipText}>
                  Zwiń
                </Text>
              ) : (
                <Text style={styles.chipText}>
                  Rozwiń
                </Text>
              )}
            </Chip>
          </View>  
        </View>
        <RatingsList expandedRatingList={expandedRatingList} />
        <TouchableHighlight
          style={styles.button}
          onPress={() => setRatingType(RatingPopupTypes.Add)}
        >
          <Text style={{ fontWeight: "500", fontSize: 18, alignSelf: "center" }}>Dodaj opinię</Text>
        </TouchableHighlight>
        <RatingPopup 
          popupVisible={ratingPopupVisible}
          itemWeight={1}
          popupType={ratingType}
          turnOffRatingPopup={turnOffRatingPopup}
        />
      </View>
    );
  }
}


/**
 * Component with a FlatList of single ratings.
 * @returns
 */
function RatingsList({expandedRatingList}) {
  const {singleRatings} = useContext(OpinionsTileContext);
  const [selectedItemId, setSelectedItemId] = useState(0);
  
  
  function deselectItem(){
    setSelectedItemId(0);
  }
  
  
  if (expandedRatingList === true) {
    return (
      <FlatList
        data={singleRatings}
        renderItem={RatingItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        style={styles.flatList}
      />
    );
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
          <ItemExtension item={item} deselectItem={deselectItem} />
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Extension of single rating visible on pressing it. Displays the description of this rating (and an ability to modify or delete it).
   * @param item
   * @param deselectItem
   * @returns {JSX.Element}
   * @constructor
   */
  function ItemExtension({ item, deselectItem }) {
    const {singleRatings, handleSingleRatingDeletion} = useContext(OpinionsTileContext);

    const [ratingPopupVisible, setRatingPopupVisible] = useState(false);    
    
    const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);

    /**
     * Deletes the selected item, deselects it and returns to the Rating FlatList.
     * @returns {Promise<void>}
     */
    function handleConfirmation(){
      setConfirmPopupVisible(false);
      deselectItem();
      handleSingleRatingDeletion(item.id, item.weight);
    }

    /**
     * Turns off ConfirmationPopup
     */
    function handleRejection(){
      setConfirmPopupVisible(false);
    }

    /**
     * Turn off the rating popup and nullify the data inside.
     */
    function turnOffRatingPopup(){
      setRatingPopupVisible(false);
    }
    
    if (selectedItemId === item.id) {
      return (
        <View style={{ backgroundColor: "gray", padding: 10 }}>
          <Text>{item.description}</Text>
          {((singleRatings.length > 1 && item.weight !== 10) || (singleRatings.length === 1)) && <View style={styles.buttonsView}>
            <TouchableHighlight
              style={styles.button}
              onPress={() => setRatingPopupVisible(true)}
              
            >
              <Text>Zmień</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.button}
              onPress={() => setConfirmPopupVisible(true)} // which triggers useEffect that turns this pop-up on
            >
              <Text>Usuń</Text>
            </TouchableHighlight>
          </View>}
          
          <RatingPopup
            popupVisible={ratingPopupVisible}
            itemId={item.id}
            itemWeight={item.weight}
            popupType={RatingPopupTypes.Update}
            turnOffRatingPopup={turnOffRatingPopup}
          />
          
          <ConfirmationPopup 
            popupVisible={confirmPopupVisible}
            popupType={ConfirmPopupTypes.Deletion}
            handleConfirmation={handleConfirmation}
            handleRejection={handleRejection}
          />
        </View>
      )
    }
  }
}


function RatingPopup({popupVisible, itemId = 0, itemWeight, popupType, turnOffRatingPopup}){
  const {handleFirstOwnRating, handleNewSingleRating, handleSingleRatingUpdate} = useContext(OpinionsTileContext);
  
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const buttonBackground = useRef("lightgray");
  
  
  /**
   * Handles set button.
   */
  function handleSetButton(){
    if (popupType === RatingPopupTypes.Add){
      setBaseRate();
      handleRatingPopupClose();
    }
    else if (popupType === RatingPopupTypes.Update){
      runConfirmPopup();
    }
  }

  /**
   * popupType -> Add
   * Passes data to the ProfileScreen.jsx
   */
  function setBaseRate() {
    if (itemWeight === 1){
      handleNewSingleRating(title, rating, description);
    } else {
      handleFirstOwnRating(rating);
    }
  }

  /**
   * Turns off this popup and nullifies the variables.
   */
  function handleRatingPopupClose() {
    if (itemWeight === 1){
      setTitle("");
      setDescription("");
    }
    setRating(0);
    turnOffRatingPopup();
  }
  
  
  /**
   * popupType -> Update
   * Runs ConfirmationPopup.
   */
  function runConfirmPopup() {
    setConfirmPopupVisible(true);
  }


  /**
   * popupType -> Update
   * Confirmation to update singleRating / ownRating depending on itemWeight.
   * Passes data to ProfileScreen.jsx and turns off this popup.
   */
  function handleConfirmation(){
    setConfirmPopupVisible(false);
    handleSingleRatingUpdate(itemId, itemWeight, title, rating, description);
    handleRatingPopupClose();
  }
  
  /**
   * popupType -> Update
   * Rejection from the ConfirmationPopup turning it off.
   */
  function handleRejection(){
    setConfirmPopupVisible(false);
  }


  /**
   * Enables/disables the button setting the rating update and changes its color. 
   */
  useEffect(() => {
    if (itemWeight === 10 && rating === 0){
      buttonBackground.current = "lightgray";
      setButtonDisabled(true);
    } else if (itemWeight === 1 && (title === "" || rating === 0 || description === "")){
      buttonBackground.current = "lightgray";
      setButtonDisabled(true);
    } else{
      buttonBackground.current = "whitesmoke";
      setButtonDisabled(false);
    }
  }, [title, rating, description]);
  
  
  return (
    <Portal>
      <Modal
        visible={popupVisible}
        dismissableBackButton={true}
        onDismiss={handleRatingPopupClose}
      >
        <View style={styles.popupWrapper}>
          <View style={styles.popupView}>
            {(itemWeight === 1) && <TextInput
              style={styles.textInput}
              placeholder="Wstaw tytuł"
              value={title}
              onChangeText={(input) => setTitle(input)}
            />}
            <StarRating
              rating={rating}
              onChange={rating => {
                if (rating === 0) return;
                setRating(rating);
              }}
              enableHalfStar={false}
            />
          {(itemWeight === 1) && <TextInput
              style={styles.textInput}
              placeholder="Wstaw komentarz do opinii"
              value={description}
              onChangeText={(input) => setDescription(input)}
            />}
            <View style={styles.buttonsView}>
              <TouchableHighlight
                style={[styles.buttonNoBg, {backgroundColor: buttonBackground.current}]}
                onPress={handleSetButton} // function to set firstRating if >= 1
                disabled={buttonDisabled}
              >
                <Text>Ustaw</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={handleRatingPopupClose}
              >
                <Text>Anuluj</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <ConfirmationPopup
          popupVisible={confirmPopupVisible}
          popupType={ConfirmPopupTypes.Update}
          handleConfirmation={handleConfirmation}
          handleRejection={handleRejection}
        />
      </Modal>
    </Portal>
  )
}


function ConfirmationPopup({popupVisible, popupType, handleConfirmation, handleRejection}){
  return(
    <Portal>
      <Modal
        visible={popupVisible}
        dismissable={false}
        dismissableBackButton={false}
      >
        <View style={styles.popupWrapper}>
          <View style={styles.popupView}>
            {popupType === ConfirmPopupTypes.Update ? (<Text>Czy na pewno chcesz zmienić tą ocenę?</Text>) : (<Text>Czy na pewno chcesz usunąć tą ocenę?</Text>)}

            <View style={styles.buttonsView}>
              <TouchableHighlight onPress={handleConfirmation} style={styles.deleteButton}>
                {popupType === ConfirmPopupTypes.Update ? (<Text>Zmień</Text>) : (<Text style={{color: "white"}}>Usuń</Text>)}
              </TouchableHighlight>
              <TouchableHighlight onPress={handleRejection} style={styles.button}>
                <Text>Anuluj</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}





const styles = StyleSheet.create({
  chipContainer: {
    display: "flex",
    alignItems: "center",
    width: "25%",
  },
  chip:{
    backgroundColor: "ghostwhite",
  },
  chipText:{
  },
  opinionsTile: {
    display: "flex",
    gap: 10,
    backgroundColor: "lightgray",
    padding: 20,
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatList: {
    display: "flex",
    gap: 10,
  },
  button: {
    // width: "60%",
    backgroundColor: "whitesmoke",
    borderColor: "#000",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    // marginTop: 10,
  },
  buttonNoBg: {
    borderColor: "#000",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  ratingItemButton: {
    backgroundColor: "gray",
    padding: 10,
    width: "60%",
    alignSelf: "center",
    borderRadius: 20,
  },
  ratingItem: {
    backgroundColor: "gray",
    padding: 10,
    marginBottom: 10,
    // alignSelf: "center",
    borderRadius: 5,
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
  
  //popup
  popupWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupView:{
    margin: 25,
    backgroundColor: "whitesmoke",
    borderRadius: 20,
    padding: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    // zIndex: 2,
    gap: 10,
  },
  buttonsView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  deleteButton: {
    backgroundColor: "#e00733",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
});
