import {FlatList, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import StarRating from "react-native-star-rating-widget";
import {useContext, useEffect, useState} from "react";
import {OpinionsTileContext} from "../nav/OpinionsTileContext";
import {RatingPopupTypes, ConfirmPopupTypes} from "../../../backend/EnumTypes";
import {Chip, Divider, Modal, Portal, TextInput, useTheme} from "react-native-paper";
import _Button from "../../styles/Button";
import {useTextInputProps} from "../../styles/TextInput";



export default function OpinionsTile({ownRating}) {

  const [expandedRatingList, setExpandedRatingList] = useState(true);

  const [ratingPopupVisible, setRatingPopupVisible] = useState(false);

  function turnOffRatingPopup() {
    setRatingPopupVisible(false);
  }


  /**
   *
   * @returns {JSX.Element}
   * @constructor
   */
  function NoOpinionComponent() {
    
    const theme = useTheme();
    
    return (
      <View style={styles.opinionsTile(theme)}>
        <Text style={styles.yourOpinionsTitle}>Brak opinii</Text>
        <Text style={styles.ratingItemTitle}>Masz już wyrobione zdanie o tym polityku?</Text>
        <_Button
          style={[styles.buttonMain(theme), {marginTop: 10}]} text="Ustaw opinię bazową"
          onPress={() => setRatingPopupVisible(true)}
        />
        <RatingPopup
          popupVisible={ratingPopupVisible}
          itemWeight={10}
          popupType={RatingPopupTypes.Add}
          turnOffRatingPopup={turnOffRatingPopup}
        />
      </View>
    );
  }

  /**
   *
   * @returns {JSX.Element}
   * @constructor
   */
  function YourOpinionsComponent() {
    
    const theme = useTheme();
    
    return (
      <View style={styles.opinionsTile(theme)}>
        <View style={styles.yourOpinionsTopBar}>
          <Text style={styles.yourOpinionsTitle}>
            Twoje opinie
          </Text>
          <Chip
            elevation={2}
            onPress={() => setExpandedRatingList(!expandedRatingList)}
            style={styles.chip(theme)}
            textStyle={styles.chipText}
          >
            {expandedRatingList ? "Zwiń ▲" : "Rozwiń ▼"}
          </Chip>
        </View>
        <_Button
          style={styles.buttonMain(theme)} text="Dodaj opinię"
          onPress={() => setRatingPopupVisible(true)}
        />
        <RatingsList showRatings={expandedRatingList}/>
        <RatingPopup
          popupVisible={ratingPopupVisible}
          itemWeight={1}
          popupType={RatingPopupTypes.Add}
          turnOffRatingPopup={turnOffRatingPopup}
        />
      </View>
    );
  }

  return (
    !ownRating ? <NoOpinionComponent/> : <YourOpinionsComponent/>
  );
}


/**
 * Component with a FlatList of single ratings.
 * @param {boolean} showRatings - whether show ratings list.
 * @returns
 */
function RatingsList({showRatings}) {
  const {singleRatings} = useContext(OpinionsTileContext);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const theme = useTheme();

  function deselectItem() {
    setSelectedItemId(0);
  }


  if (showRatings)
    return (
      <View style={styles.yourRatingsContainer}>
        <FlatList
          data={singleRatings}
          renderItem={RatingItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    );

  /**
   * Component to render an Item in FlatList.
   * @param {object} item - item data.
   * @returns {JSX.Element}
   */
  function RatingItem({item}) {
    return (
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={item.weight === 10 ? theme.colors.secondaryContainer : theme.colors.inverseOnSurface}
        onPress={() => setSelectedItemId(selectedItemId !== item.id ? item.id : 0)}
        style={styles.opinionItem(theme, item.weight === 10)} //PK: Żeby można ustawić inny kolor dla oceny bazowej
      >
        <>
          <View style={styles.ratingItemBase}>
            <View style={styles.ratingItemBaseLeft}>
              <Text style={styles.ratingItemDate}>{item.date}</Text>
              <Text style={styles.ratingItemTitle}>{item.title}</Text>
            </View>
            <View style={styles.ratingItemBaseRight}>
              <Text style={styles.ratingItemValueLabel}>
                Ocena: <Text style={styles.ratingItemValue}>{item.value}</Text>
              </Text>
            </View>
          </View>
          <ItemExtension item={item} deselectItem={deselectItem}/>
        </>
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
  function ItemExtension({item, deselectItem}) {
    const {singleRatings, handleSingleRatingDeletion} = useContext(OpinionsTileContext);

    const [ratingPopupVisible, setRatingPopupVisible] = useState(false);

    const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);

    /**
     * Deletes the selected item, deselects it and returns to the Rating FlatList.
     * @returns {Promise<void>}
     */
    function handleConfirmation() {
      setConfirmPopupVisible(false);
      deselectItem();
      handleSingleRatingDeletion(item.id, item.weight);
    }

    /**
     * Turns off ConfirmationPopup
     */
    function handleRejection() {
      setConfirmPopupVisible(false);
    }

    /**
     * Turn off the rating popup and nullify the data inside.
     */
    function turnOffRatingPopup() {
      setRatingPopupVisible(false);
    }

    if (selectedItemId === item.id) {
      return (
        <View style={styles.ratingItemExt(theme, item.weight !== 10)}>
          <Text style={styles.ratingItemDesc}>Opis: {item.description}</Text>

          <Divider style={item.weight === 10 && {display: "none"}} bold/>

          {
            (singleRatings.length === 1 || item.weight !== 10) &&
            <View style={styles.buttonsRow}>
              <_Button
                iconLeft={{icon: "pencil", size: 16}}
                text="Edytuj"
                onPress={() => setRatingPopupVisible(true)}
                style={[styles.button(theme), {backgroundColor: theme.colors.secondary}]}
                textStyle={styles.buttonText}
              />
              <_Button
                text="Usuń"
                iconLeft={{icon: "delete", size: 17}}
                onPress={() => setConfirmPopupVisible(true)} // which triggers useEffect that turns this pop-up on
                style={[styles.button(theme), {backgroundColor: theme.colors.error}]}
                textStyle={styles.buttonText}
              />
            </View>
          }

          <RatingPopup
            popupVisible={ratingPopupVisible}
            itemId={item.id}
            itemWeight={item.weight}
            itemTitle={item.title}
            itemRating={item.value}
            itemDescription={item.description}
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
      );
    }
  }
}


function RatingPopup({popupVisible, itemId = 0, itemWeight, itemTitle = "", itemRating = 0, itemDescription = "", popupType, turnOffRatingPopup}){
  const {handleFirstOwnRating, handleNewSingleRating, handleSingleRatingUpdate} = useContext(OpinionsTileContext);

  const [title, setTitle] = useState(itemTitle);
  const [rating, setRating] = useState(itemRating);
  const [description, setDescription] = useState(itemDescription);

  const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);


  /**
   * Handles set button.
   */
  function handleSetButton() {
    if (popupType === RatingPopupTypes.Add) {
      setBaseRate();
      handleRatingPopupClose();
    } else if (popupType === RatingPopupTypes.Update) {
      runConfirmPopup();
    }
  }

  /**
   * popupType -> Add
   * Passes data to the ProfileScreen.jsx
   */
  function setBaseRate() {
    if (itemWeight === 1) {
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
      setTitle(itemTitle);
      setDescription(itemDescription);
    }
    setRating(itemRating);
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
  function handleConfirmation() {
    setConfirmPopupVisible(false);
    handleSingleRatingUpdate(itemId, itemWeight, title, rating, description);
    handleRatingPopupClose();
  }

  /**
   * popupType -> Update
   * Rejection from the ConfirmationPopup turning it off.
   */
  function handleRejection() {
    setConfirmPopupVisible(false);
  }


  /**
   * Enables/disables the button setting the rating update and changes its color.
   */
  useEffect(() => {
    setButtonDisabled(itemWeight === 1 && (title === "" || rating === 0 || description === ""));
  }, [title, rating, description]);

  const theme = useTheme();
  const textInputProps = useTextInputProps();


  return (
    <Portal>
      <Modal
        visible={popupVisible}
        dismissableBackButton={true}
        onDismiss={handleRatingPopupClose}
      >
        <View style={styles.popupWrapper(theme)}>
          {(itemWeight === 1) &&
            <TextInput
              {...textInputProps}
              style={[textInputProps.style, styles.titleTextInput]}
              label="tytuł"
              value={title}
              autoCapitalize="sentences"
              onChangeText={setTitle}
            />}
          <StarRating
            rating={rating}
            style={{marginBottom: -6}}
            starStyle={{marginHorizontal: 3}}
            onChange={value => setRating(value || 1)}
            enableHalfStar={false}
            starSize={48}
            color={theme.colors.primary}
            emptyColor={theme.colors.inversePrimary}
          />
          {(itemWeight === 1) &&
            <TextInput
              {...textInputProps}
              style={[textInputProps.style, styles.descTextInput]}
              label="opis"
              value={description}
              autoCapitalize="sentences"
              onChangeText={setDescription}
              multiline={true}
            />}
          <View style={styles.buttonsRow}>
            <_Button
              iconLeft={{icon: "check", size: 22}}
              text="Zapisz"
              onPress={handleSetButton} // function to set firstRating if >= 1
              disabled={buttonDisabled}
              style={[styles.button(theme), {backgroundColor: theme.colors.primary}]}
              textStyle={styles.buttonText}
            />
            <_Button
              iconLeft={{icon: "close", size: 20}}
              text="Anuluj"
              onPress={handleRatingPopupClose}
              style={[styles.button(theme), {backgroundColor: theme.colors.error}]}
              textStyle={styles.buttonText}
            />
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
  );
}


function ConfirmationPopup({popupVisible, popupType, handleConfirmation, handleRejection}) {

  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={popupVisible}
        dismissable={false}
        dismissableBackButton={false}
      >
        <View style={styles.popupWrapper(theme)}>
          <Text style={styles.chipText}>Czy na pewno
            chcesz {popupType === ConfirmPopupTypes.Update ? "zmienić" : "usunąć"} tę ocenę?</Text>

          <View style={styles.buttonsRow}>
            {popupType === ConfirmPopupTypes.Update ? (
              <_Button
                iconLeft={{icon: "pencil", size: 17}}
                text="Edytuj"
                onPress={handleConfirmation}
                style={[styles.button(theme), {backgroundColor: theme.colors.error}]}
                textStyle={styles.buttonText}
              />
            ) : (
              <_Button
                iconLeft={{icon: "delete", size: 17}}
                text="Usuń"
                onPress={handleConfirmation}
                style={[styles.button(theme), {backgroundColor: theme.colors.error}]}
                textStyle={styles.buttonText}
              />
            )}
            
            
            <_Button
              text="Anuluj"
              iconLeft={{icon: "close", size: 18}}
              onPress={handleRejection}
              style={[styles.button(theme), {backgroundColor: theme.colors.primary}]}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </Modal>
    </Portal>
  );
}


const styles = StyleSheet.create({
  opinionsTile: (theme) => ({
    backgroundColor: theme.colors.secondaryContainer2,

    gap: 10,
    margin: 10,

    paddingHorizontal: 30,
    paddingVertical: 25,
    paddingBottom: 10,

    borderRadius: 13,

    elevation: 6,
    shadowColor: theme.colors.shadow,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }),

  yourOpinionsTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  yourOpinionsTitle: {
    fontWeight: "500",
    fontSize: 20
  },
  chip: (theme) => ({
    backgroundColor: theme.colors.inverseOnSurface,
    justifyContent: "center",
  }),
  chipText: {
    fontSize: 15,
    marginVertical: 4,
  },
  yourRatingsContainer: {
    // padding: 5,
  },

  flatList: {
    //
  },
  flatListContent: {
    gap: 7,
    padding: 5,
    paddingBottom: 15,
    flexDirection: "column-reverse",
  },
  opinionItem: (theme, baseRating) => ({
    backgroundColor: baseRating ? theme.colors.inverseOnSurface : theme.colors.secondaryContainer,

    borderTopLeftRadius: 10,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 10,
    padding: 10,
    marginTop: baseRating ? 7 : 0,

    elevation: 5,
    shadowColor: theme.colors.shadow,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }),
  ratingItemBase: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingItemBaseLeft: {
    flex: 1,
  },
  ratingItemDate: {
    fontSize: 13,
  },
  ratingItemTitle: {
    fontSize: 16,
  },
  ratingItemValueLabel: {
    fontSize: 15,
  },
  ratingItemValue: {
    fontSize: 17,
    fontWeight: "500",
  },
  ratingItemBaseRight: {
    // justifyContent: "center",
    paddingTop: 3,
  },

  ratingItemExt: (theme, baseRating) => ({
    backgroundColor: baseRating ? theme.colors.inverseOnSurface : theme.colors.secondaryContainer,
    padding: 5,
    marginTop: 8,

    borderTopLeftRadius: 3,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 3,

    elevation: 6,
    shadowColor: theme.colors.shadow,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }),
  ratingItemDesc: {
    fontSize: 14,
    marginBottom: 8,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginTop: 8,
  },
  buttonMain: (theme) => ({
    backgroundColor: theme.colors.primary,
    alignSelf: "center",
    marginBottom: 10,
  }),
  button: (theme) => ({
    backgroundColor: theme.colors.buttonPress,
    alignSelf: "center",
    minWidth: 0,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 13,
  }),
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
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

  //popup
  popupWrapper: (theme) => ({
    backgroundColor: theme.colors.secondaryContainer,

    justifyContent: "center",
    alignItems: "center",

    margin: "10%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 10,

    borderTopLeftRadius: 5,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 5,

    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }),
  titleTextInput: {
    // width: "80%",
    height: 40,
  },
  descTextInput: {
    minHeight: 70,
  },
  deleteButton: {
    backgroundColor: "#e00733",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
});
