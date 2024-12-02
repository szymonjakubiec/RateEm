import {FlatList, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import StarRating from "react-native-star-rating-widget";
import {useState} from "react";



export default function OpinionsTile({ownRating, singleRatings, handleFirstOwnRating, handleNewSingleRating, handleNewTitle, handleNewDescription}) {
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
        <View>
          <TouchableHighlight
            onPress={() => {
              setExpandedRatingList(!expandedRatingList);
            }}
          >
            <Text style={{fontWeight: "500", fontSize: 20}}>
              Twoje opinie
            </Text>
          </TouchableHighlight>
        </View>
        <RatingsList expandedRatingList={expandedRatingList} singleRatings={singleRatings} />
        <AddOpinion handleNewSingleRating={handleNewSingleRating} handleNewTitle={handleNewTitle} handleNewDescription={handleNewDescription} />
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
    } else {
      setWrongRatingInfo("Ocena polityka musi wynosić przynajmniej 1.");
    }
  }
}


/**
 * Component with a FlatList of single ratings.
 * @returns
 */
function RatingsList({expandedRatingList, singleRatings}) {
  const [selectedItemId, setSelectedItemId] = useState(0);
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

  /**
   * Extension of single rating visible on pressing it. Displays the description of this rating (and an ability to modify or delete it). 
   * @param item
   * @returns {JSX.Element}
   * @constructor
   */
  function ItemExtension({ item }) {
    if (selectedItemId === item.id) {
      return (
        <View style={{ backgroundColor: "gray", padding: 10 }}>
          <Text>{item.description}</Text>
          <TouchableHighlight
            style={styles.button}
            onPress={() => console.log("Not yet, WIP")}
          >
            <Text>Modyfikuj</Text>
          </TouchableHighlight>
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
}


/**
 * Component for adding new opinions after the first opinion (base opinion) was set up.
 * @param handleNewSingleRating
 * @param handleNewTitle
 * @param handleNewDescription
 * @returns {JSX.Element}
 */
function AddOpinion({handleNewSingleRating, handleNewTitle, handleNewDescription}) {
  const [expandedAddOpinion, setExpandedAddOpinion] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  const [starRating, setStarRating] = useState(0);
  const [wrongRatingInfo, setWrongRatingInfo] = useState("");
  
  if (expandedAddOpinion === false) {
    return (
      <TouchableHighlight
        style={styles.ratingItem}
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
          onChangeText={(input) => 
            setNewTitle(input)
          }
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
})

