import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
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

      <View style={styles.totalRatingsContainer}>
        <Text style={styles.totalRatingsText}>
          Łączna liczba ocen: {totalRatings}
        </Text>
      </View>

      <View style={styles.ratingContainer}>
        {highestRating && (
          <TouchableOpacity
            style={styles.ratingItem}
            onPress={() => handleratingClick(highestRating)}
          >
            <Text style={styles.ratingText}>
              Najwyższa ocena: {highestRating.names_surname}{" "}
              {highestRating.value}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.ratingContainer}>
        {lowestRating && (
          <TouchableOpacity
            style={styles.ratingItem}
            onPress={() => handleratingClick(lowestRating)}
          >
            <Text style={styles.ratingText}>
              Najniższa ocena: {lowestRating.names_surname} {lowestRating.value}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {ratings && (
        <ScrollView style={styles.scrollContainer}>
          {ratings.map((item, index) => (
            <View key={index} style={styles.ratingItemContainer}>
              <TouchableOpacity
                style={styles.ratingItem}
                onPress={() => handleratingClick(item)}
              >
                <Image
                  source={{
                    uri: "https://api.sejm.gov.pl/sejm/term9/MP/49/photo",
                    cache: "force-cache",
                  }}
                  style={styles.ratingImage}
                  onError={(error) =>
                    console.log("Błąd wczytywania obrazu:", error.nativeEvent)
                  }
                />
                <Text style={styles.ratingItemText}>
                  {item.names_surname} {item.value}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal z informacjami o polityku */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
            {selectedPolitician && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedPolitician.names_surname}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Ocena: </Text>
                  {selectedPolitician.value}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Opis: </Text>
                  {selectedPolitician.description}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Partia: </Text>
                  {selectedPolitician.party || "Brak Informacji"}
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={closeModal}>
              <Text style={styles.actionButtonText}>Zamknij</Text>
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
    backgroundColor: "#f9f9f9",
  },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    maxHeight: "80%",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeIconText: {
    fontSize: 18,
    color: "#888",
  },
  modalTitle: {
    fontSize: 22,
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
});
