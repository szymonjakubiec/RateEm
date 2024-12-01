import {FlatList, Modal, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import StarRating from "react-native-star-rating-widget";
import {useContext, useEffect, useRef, useState} from "react";
import {OpinionsTileContext} from "../nav/OpinionsTileContext";



export default function OpinionsTile({ownRating, handleFirstOwnRating}) {
  const [wrongRatingInfo, setWrongRatingInfo] = useState("");
  const [starRating, setStarRating] = useState(0);

  const [expandedRatingList, setExpandedRatingList] = useState(false);

  
  if (ownRating === 0) {
    return displayNoOpinionComponent();
  } else {
    return displayYourOpinionsComponent();
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
          disabled={starRating === 0}
        >
          <Text>Ustaw</Text>
        </TouchableHighlight>
      </View>
    );
  }

  function displayYourOpinionsComponent() {
    return (
      <View style={styles.opinionsTile}>
        <View style={styles.topBar}>
          <Text style={{fontWeight: "500", fontSize: 20}}>
            Twoje opinie
          </Text>
          <TouchableHighlight
            onPress={() => {
              setExpandedRatingList(!expandedRatingList);
            }}
          >
            {expandedRatingList ? (
              <Text style={{fontWeight: "400", fontSize: 18, color: "#000"}}>
                Zwiń
              </Text>
            ) : (
              <Text style={{fontWeight: "400", fontSize: 18, color: "#000"}}>
                Rozwiń
              </Text>
            )}
          </TouchableHighlight>
        </View>
        <RatingsList expandedRatingList={expandedRatingList} />
        <AddOpinion />
      </View>
    );
  }

  /**
   * Checks if the starRating is at least 1 and set it into firstOwnRating.
   */
  function setBaseRate() {
    if (starRating >= 1) {
      handleFirstOwnRating(starRating);
      setWrongRatingInfo("");
      setStarRating(0);
    } else {
      setWrongRatingInfo("Ocena polityka musi wynosić przynajmniej 1.");
    }
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
    /**
     * @enum
     * @type {Readonly<{Undefined: symbol, Deletion: symbol, Update: symbol}>}
     */
    const ConfirmPopupTypes = Object.freeze({
      Undefined: Symbol("Undefined"),
      Update: Symbol("Update"),
      Deletion: Symbol("Deletion")
    });
    
    const {handleSingleRatingDeletion, handleSingleRatingUpdate} = useContext(OpinionsTileContext);

    const [updateRatingPopupVisible, setUpdateRatingPopupVisible] = useState(false);    
    
    const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);
    const [confirmType, setConfirmType] = useState(ConfirmPopupTypes.Undefined);
    
    
    async function handleConfirmation(){
      setConfirmPopupVisible(false);
      deselectItem();
      if (confirmType === ConfirmPopupTypes.Update) {
        await handleSingleRatingUpdate(item)
      } else {
        await handleSingleRatingDeletion(item);
      }
    }
    
    function handleRejection(){
      setConfirmPopupVisible(false);
    }

    /**
     * Turn off the popup and nullify the data inside. WHY HERE THO?
     */
    async function turnOffRatingPopup(){
      await setUpdateRatingPopupVisible(false);
    }
    
    
    useEffect(() => {
      if (confirmType !== ConfirmPopupTypes.Undefined){
        setConfirmPopupVisible(true);
      }
    }, [confirmType]);
    
    if (selectedItemId === item.id) {
      return (
        <View style={{ backgroundColor: "gray", padding: 10 }}>
          <Text>{item.description}</Text>
          <View style={styles.buttonsView}>
            <TouchableHighlight
              style={styles.button}
              onPress={() => setUpdateRatingPopupVisible(true)}
            >
              <Text>Zmień</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.button}
              onPress={() => setConfirmType(ConfirmPopupTypes.Deletion)} // which triggers useEffect that turns this pop-up on
            >
              <Text>Usuń</Text>
            </TouchableHighlight>
          </View>
          
          <RatingUpdatePopup
            popupVisible={updateRatingPopupVisible}
            itemId={item.id}
            itemWeight={item.weight}
            ConfirmPopupTypes={ConfirmPopupTypes}
            turnOffRatingPopup={turnOffRatingPopup}
          />
          
          <ConfirmationPopup 
            popupVisible={confirmPopupVisible}
            confirmType={confirmType}
            ConfirmPopupTypes={ConfirmPopupTypes}
            handleConfirmation={handleConfirmation}
            handleRejection={handleRejection}
          />
        </View>
      )
    }
  }
}


function RatingUpdatePopup({popupVisible, itemId, itemWeight, ConfirmPopupTypes, turnOffRatingPopup}){
  const {handleSingleRatingUpdate} = useContext(OpinionsTileContext);
  
  const [titleUpdate, setTitleUpdate] = useState("");
  const [ratingUpdate, setRatingUpdate] = useState(0);
  const [descriptionUpdate, setDescriptionUpdate] = useState("");

  const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const buttonBackground = useRef("lightgray");
  
  
  function handleUpdatePopupClose() {
    setTitleUpdate("");
    setRatingUpdate(0);
    setDescriptionUpdate("");
    turnOffRatingPopup();
  }

  /**
   * Runs ConfirmationPopup.
   */
  function runConfirmPopup() {
    setConfirmPopupVisible(true);
  }


  /**
   * Confirmation from the ConfirmationPopup.
   */
  function handleConfirmation(){
    setConfirmPopupVisible(false);
    handleSingleRatingUpdate(itemId, itemWeight, titleUpdate, ratingUpdate, descriptionUpdate);
    setTitleUpdate("");
    setRatingUpdate(0);
    setDescriptionUpdate("");
    turnOffRatingPopup();
  }
  
  /**
   * Rejection from the ConfirmationPopup.
   */
  function handleRejection(){
    setConfirmPopupVisible(false);
  }
  

  useEffect(() => {
    if (itemWeight === 10 && ratingUpdate === 0){
      buttonBackground.current = "lightgray";
      setButtonDisabled(true);
    } else if (itemWeight === 1 && (titleUpdate === "" || ratingUpdate === 0 || descriptionUpdate === "")){
      buttonBackground.current = "lightgray";
      setButtonDisabled(true);
    } else{
      buttonBackground.current = "whitesmoke";
      setButtonDisabled(false);
    }
  }, [titleUpdate, ratingUpdate, descriptionUpdate]);
  
  
  return (
    <Modal
      visible={popupVisible}
      transparent={true}
      onRequestClose={handleUpdatePopupClose}
    >
      <View style={styles.popupWrapper}>
        <View style={styles.popupView}>
          {(itemWeight === 1) && <TextInput
            style={styles.textInput}
            placeholder="Wstaw tytuł"
            value={titleUpdate}
            onChangeText={(input) => setTitleUpdate(input)}
          />}
          <StarRating
            rating={ratingUpdate}
            onChange={rating => {
              if (rating === 0) return;
              setRatingUpdate(rating);
            }}
            enableHalfStar={false}
          />
          {(itemWeight === 1) && <TextInput
            style={styles.textInput}
            placeholder="Wstaw komentarz do opinii"
            value={descriptionUpdate}
            onChangeText={(input) => setDescriptionUpdate(input)}
          />}
          <View style={styles.buttonsView}>
            <TouchableHighlight
              style={[styles.buttonNoBg, {backgroundColor: buttonBackground.current}]}
              onPress={runConfirmPopup} // function to set firstRating if >= 1
              disabled={buttonDisabled}
            >
              <Text>Ustaw</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.button}
              onPress={handleUpdatePopupClose}
            >
              <Text>Anuluj</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <ConfirmationPopup
        popupVisible={confirmPopupVisible}
        confirmType={ConfirmPopupTypes.Update}
        ConfirmPopupTypes={ConfirmPopupTypes}
        handleConfirmation={handleConfirmation}
        handleRejection={handleRejection}
      />
    </Modal>
  )
}


function ConfirmationPopup({popupVisible, confirmType, ConfirmPopupTypes, handleConfirmation, handleRejection}){
  return(
    <Modal
      visible={popupVisible}
      transparent={true}
      onRequestClose={handleRejection}
    >
      <View style={styles.popupWrapper}>
        <View style={styles.popupView}>
          {confirmType === ConfirmPopupTypes.Update ? (<Text>Czy na pewno chcesz zmienić tą ocenę?</Text>) : (<Text>Czy na pewno chcesz usunąć tą ocenę?</Text>)}
          
          <View style={styles.buttonsView}>
            <TouchableHighlight onPress={handleConfirmation} style={styles.deleteButton}>
              {confirmType === ConfirmPopupTypes.Update ? (<Text>Zmień</Text>) : (<Text style={{color: "white"}}>Usuń</Text>)}
            </TouchableHighlight>
            <TouchableHighlight onPress={handleRejection} style={styles.button}>
              <Text>Anuluj</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
}

/**
 * Component for adding new opinions after the first opinion (base opinion) was set up.
 * @returns {JSX.Element}
 */
function AddOpinion() {
  const {handleNewSingleRating, handleNewTitle, handleNewDescription} = useContext(OpinionsTileContext);
  const [expandedAddOpinion, setExpandedAddOpinion] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  const [starRating, setStarRating] = useState(0);
  const [wrongRatingInfo, setWrongRatingInfo] = useState("");
  
  if (expandedAddOpinion === false) {
    return (
      <TouchableHighlight
        style={styles.ratingItemButton}
        onPress={() => setExpandedAddOpinion(true)}
      >
        <Text
          style={{ fontWeight: "500", fontSize: 18, alignSelf: "center" }}
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
            style={{ fontWeight: "500", fontSize: 18, alignSelf: "flex-start", }}
          >
            Dodaj opinię
          </Text>
        </TouchableHighlight>
        <TextInput
          style={styles.textInput}
          placeholder="Wstaw tytuł"
          value={newTitle}
          onChangeText={(input) => setNewTitle(input)}
          onBlur={() => handleNewTitle(newTitle.trim())}
        />
        <StarRating
          rating={starRating}
          onChange={rating => {
            if (rating === 0) return;
            setStarRating(rating);
          }}
          enableHalfStar={false}
        />
        <Text style={styles.wrongInputText}>{wrongRatingInfo}</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Wstaw komentarz do opinii"
          value={newDescription}
          onChangeText={(input) => setNewDescription(input)}
          onBlur={() => handleNewDescription(newDescription.trim())}
        />
        <TouchableHighlight
          style={styles.button}
          onPress={setSingleRate} // function to set firstRating if >= 1
          disabled={newTitle === "" || newDescription === "" || starRating === 0}
        >
          <Text>Ustaw</Text>
        </TouchableHighlight>
      </View>
    );
  }
  
  function setSingleRate() {
    if (starRating >= 1) {
      handleNewSingleRating(starRating);
      setNewTitle("");
      setNewDescription("");
      setStarRating(0);
      setWrongRatingInfo("");
    } else {
      setWrongRatingInfo("Ocena polityka musi wynosić przynajmniej 1.");
    }
  }
}





const styles = StyleSheet.create({
  opinionsTile: {
    display: "flex",
    gap: 10,
    backgroundColor: "lightgray",
    padding: 20,
  },
  topBar:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatList:{
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
  buttonNoBg:{
    borderColor: "#000",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  wrongInputText: {
    fontSize: 10,
    color: "red",
    marginBottom: 15,
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
    backgroundColor: 'whitesmoke',
    borderRadius: 20,
    padding: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    // zIndex: 2,
    gap: 10,
  },
  buttonsView:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  deleteButton: {
    backgroundColor: "#e00733",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
})

