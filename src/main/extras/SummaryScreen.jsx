import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { getUserRatings } from "../../backend/database/Ratings";

export default function SummaryScreen() {
  const [ratings, setRatings] = useState([]);
  const [highestRating, setHighestRating] = useState(null);
  const [lowestRating, setLowestRating] = useState(null);
  const [selectedPolitician, setSelectedPolitician] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalRatings, setTotalRatings] = useState(0); // Dodano stan dla łącznej liczby ocen

  useEffect(() => {
    const fetchRatings = async () => {
      const fetchedRatings = await getUserRatings(2);
      setRatings(fetchedRatings);
      console.log(fetchedRatings);

      // Obliczanie najwyższej i najniższej oceny oraz łącznej liczby ocen
      if (fetchedRatings.length > 0) {
        const highest = Math.max(
          ...fetchedRatings.map((rating) => rating.value)
        );
        const lowest = Math.min(
          ...fetchedRatings.map((rating) => rating.value)
        );

        setHighestRating(
          fetchedRatings.find((rating) => rating.value === highest)
        );
        setLowestRating(
          fetchedRatings.find((rating) => rating.value === lowest)
        );

        setTotalRatings(fetchedRatings.length); // Ustawienie łącznej liczby ocen
      }
    };

    fetchRatings();
  }, []);

  const handleratingClick = (item) => {
    setSelectedPolitician(item);
    setModalVisible(true); // Otwórz modal po kliknięciu oceny
  };

  const closeModal = () => {
    setModalVisible(false); // Zamknij modal
    setSelectedPolitician(null); // Wyczyść wybranego polityka
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wystawione oceny</Text>

      {/* Wyświetlanie łącznej liczby ocen */}
      <View style={styles.totalRatingsContainer}>
        <Text style={styles.totalRatingsText}>
          Łączna liczba ocen: {totalRatings}
        </Text>
      </View>

      <View style={styles.ratingContainer}>
        {highestRating && (
          <Text style={styles.ratingText}>
            Najwyższa ocena: {highestRating.names_surname} {highestRating.value}
          </Text>
        )}
      </View>

      <View style={styles.ratingContainer}>
        {lowestRating && (
          <Text style={styles.ratingText}>
            Najniższa ocena: {lowestRating.names_surname} {lowestRating.value}
          </Text>
        )}
      </View>

      {ratings && (
        <ScrollView style={styles.scrollContainer}>
          {ratings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.ratingItem}
              onPress={() => handleratingClick(item)}
            >
              <Text style={styles.ratingItemText}>
                {item.names_surname} {item.value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal z informacjami o polityku */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPolitician && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedPolitician.names_surname}
                </Text>
                <Text style={styles.modalText}>
                  Ocena: {selectedPolitician.value}
                </Text>
                <Text style={styles.modalText}>
                  Opis: {selectedPolitician.description}
                </Text>
                <Text style={styles.modalText}>
                  Partia: {selectedPolitician.party || "Brak Informacji"}
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  totalRatingsContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  totalRatingsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  ratingText: {
    fontSize: 18,
  },
  scrollContainer: {
    marginTop: 20,
  },
  ratingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  ratingItemText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Lekko przezroczyste tło
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});
