import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {getRatingsUserId} from "../../backend/database/Ratings";
import {tabBarAnim} from "../../backend/CommonMethods";
import {GlobalContext} from "../nav/GlobalContext";
import _Container from "../styles/Container";
import {Button, Dialog, Portal} from "react-native-paper";



export default function SummaryScreen({navigation}) {
  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  const [ratings, setRatings] = useState([]);
  const [highestRating, setHighestRating] = useState(null);
  const [lowestRating, setLowestRating] = useState(null);
  const [selectedPolitician, setSelectedPolitician] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [totalRatings, setTotalRatings] = useState(0); // Dodano stan dla łącznej liczby ocen
  const {userId} = useContext(GlobalContext);

  useEffect(() => {
    const fetchRatings = async () => {
      const fetchedRatings = await getRatingsUserId(userId);
      setRatings(fetchedRatings.reverse().filter((rating) => rating.weight !== 10));

      if (fetchedRatings.length > 0) {
        const highest = Math.max(...fetchedRatings.map((rating) => rating.value));
        const lowest = Math.min(...fetchedRatings.map((rating) => rating.value));

        setHighestRating(fetchedRatings.find((rating) => rating.value === highest));
        setLowestRating(fetchedRatings.find((rating) => rating.value === lowest));

        setTotalRatings(fetchedRatings.length); // Ustawienie łącznej liczby ocen
      }
    };
    fetchRatings();
  }, []);

  const renderRatingItem = ({item}) => (
    <View style={styles.ratingItemContainer}>
      <TouchableOpacity style={styles.ratingItem} onPress={() => handleratingClick(item)}>
        {item.picture ? (
          <Image
            source={{
              uri: `data:image/jpeg;base64,${item.picture}`,
              cache: "force-cache",
            }}
            style={styles.ratingImage}
          />
        ) : (
          <Image source={require("./../../../assets/noPhoto.png")} style={styles.ratingImage}/>
        )}
        <Text style={styles.ratingItemText}>
          {item.names_surname} {item.value}
        </Text>
      </TouchableOpacity>
    </View>
  );
  const handleratingClick = (item) => {
    setSelectedPolitician(item);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedPolitician(null);
  };

  return (
    <_Container style={{alignItems: "stretch", padding: 20}}>
      <Text style={styles.title}>Wystawione oceny</Text>
      {ratings.length === 0 ? (
        <View style={styles.ratingContainer}>
          <Text>Nie ma niczego do pokazania... Najpierw dodaj opinię!</Text>
        </View>
      ) : (
        <View>
          <View style={styles.totalRatingsContainer}>
            <Text style={styles.totalRatingsText}>Łączna liczba ocen: {totalRatings}</Text>
          </View>

          <View style={styles.ratingContainer}>
            {highestRating && (
              <TouchableOpacity style={styles.ratingItem} onPress={() => handleratingClick(highestRating)}>
                <Text style={styles.ratingText}>
                  Najwyższa ocena: {highestRating.names_surname} {highestRating.value}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.ratingContainer}>
            {lowestRating && (
              <TouchableOpacity style={styles.ratingItem} onPress={() => handleratingClick(lowestRating)}>
                <Text style={styles.ratingText}>
                  Najniższa ocena: {lowestRating.names_surname} {lowestRating.value}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      {ratings && (
        <FlatList
          data={ratings}
          renderItem={renderRatingItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.scrollContainer}
        />
      )}

      {/* Modal z informacjami o polityku */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>{selectedPolitician?.names_surname || "Szczegóły oceny"}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              <Text style={styles.dialogLabel}>Ocena: </Text>
              {selectedPolitician?.value}
            </Text>
            <Text style={styles.dialogText}>
              <Text style={styles.dialogLabel}>Opis: </Text>
              {selectedPolitician?.description || "Brak opisu"}
            </Text>
            <Text style={styles.dialogText}>
              <Text style={styles.dialogLabel}>Partia: </Text>
              {selectedPolitician?.party || "Brak informacji"}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Zamknij</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </_Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  totalRatingsContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  totalRatingsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  ratingContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  ratingText: {
    fontSize: 18,
    color: "#333",
  },
  scrollContainer: {
    marginTop: 20,
  },
  ratingItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  ratingItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    maxHeight: "80%",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 2,
  },

  closeIconText: {
    fontSize: 18,
    color: "#888",
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    color: "#555",
  },
  modalLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  actionButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    marginRight: 10,
  },
  ratingImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Zaokrąglone zdjęcie
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  dialogLabel: {
    fontWeight: "bold",
    color: "#333",
  },
});
