import {ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import React, {useEffect, useState} from "react";
import {getTrendingPoliticians} from "../../backend/database/Politicians";
import {Chip, MD2Colors} from "react-native-paper";



export default function TrendingScreen({navigation}) {
  const [numberOfPoliticians, setNumberOfPoliticians] = useState(5);
  const [days, setDays] = useState(90);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      setIsLoading(true);
      const fetchedRatings = await getTrendingPoliticians(numberOfPoliticians, days);
      setTrending(fetchedRatings);
      setIsLoading(false);
    }

    fetchRatings();
  }, [numberOfPoliticians, days]);

  const renderRatingItem = ({item}) => (
    <TouchableOpacity
      style={styles.ratingItemContainer}
      onPress={() => handlePoliticianClick(item)}
    >
      <Image
        source={{
          uri: `data:image/jpeg;base64,${item.picture}`,
          cache: "force-cache",
        }}
        style={styles.ratingImage}
      />
      <View style={styles.ratingInfo}>
        <Text style={styles.ratingItemText}>{item.surname} {item.name}</Text>
        <Text style={styles.ratingScore}>
          Ocena globalna: {item.global_rating ? item.global_rating.toFixed(2) : "—"}
        </Text>
        <Text style={styles.ratingScore}>
          Ilość ocen: {item.ratings_count ? item.ratings_count : "—"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handlePoliticianClick = (item) => {
    const selectedPoliticianId = item.id;
    navigation.navigate("Profile", {selectedPoliticianId});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Politycy na czasie</Text>

      {/* Chips do zmiany dni */}
      <View style={styles.chipsContainer}>
        <Text style={styles.chipLabel}>Okres czasu:</Text>
        {[1, 7, 30, 90].map((value) => (
          <Chip
            key={value}
            selected={days === value}
            onPress={() => setDays(value)}
            style={styles.chip}
          >
            {value === 1 ? "Dziś" : `${value} dni`}
          </Chip>
        ))}
      </View>

      {/* Chips do zmiany liczby polityków */}
      <View style={styles.chipsContainer}>
        <Text style={styles.chipLabel}>Liczba polityków:</Text>
        {[3, 5, 10].map((value) => (
          <Chip
            key={value}
            selected={numberOfPoliticians === value}
            onPress={() => setNumberOfPoliticians(value)}
            style={styles.chip}
          >
            {value}
          </Chip>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Ładowanie</Text>
          <ActivityIndicator size={"large"} animating={true} color={MD2Colors.red800}/>
        </View>
      ) : (
        <FlatList
          data={trending}
          renderItem={renderRatingItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
  },
  chipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  ratingItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  ratingImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  ratingInfo: {
    flex: 1,
  },
  ratingItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
  ratingScore: {
    fontSize: 14,
    color: "#555",
  },
  listContainer: {
    paddingBottom: 10,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
