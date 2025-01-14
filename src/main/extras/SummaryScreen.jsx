import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import {useContext, useEffect, useState} from "react";
import {getRatingsUserId} from "../../backend/database/Ratings";
import {tabBarAnim} from "../../backend/CommonMethods";
import {GlobalContext} from "../nav/GlobalContext";
import _Container from "../styles/Container";
import {Button, Dialog, Portal, useTheme} from "react-native-paper";



export default function SummaryScreen({navigation}) {
  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [highestRating, setHighestRating] = useState(null);
  const [lowestRating, setLowestRating] = useState(null);
  const [selectedPolitician, setSelectedPolitician] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const {userId} = useContext(GlobalContext);

  useEffect(() => {
    const fetchRatings = async () => {
      const fetchedRatings = await getRatingsUserId(userId);
      setRatings(fetchedRatings.reverse().filter((rating) => rating.weight !== 10));
      setIsLoading(false);

      if (fetchedRatings.length > 0) {
        const highest = Math.max(...fetchedRatings.map((rating) => rating.value));
        const lowest = Math.min(...fetchedRatings.map((rating) => rating.value));

        setHighestRating(fetchedRatings.find((rating) => rating.value === highest));
        setLowestRating(fetchedRatings.find((rating) => rating.value === lowest));
      }
    };
    fetchRatings();
  }, []);

  const theme = useTheme();

  const renderRatingItem = ({item}) => (
    <TouchableHighlight
      style={styles.ratingItem(theme)}
      underlayColor={theme.colors.primaryContainer}
      onPress={() => handleRatingClick(item)}
    >
      <>
        <Image
          source={
            item.picture
              ? {
                uri: `data:image/jpeg;base64,${item.picture}`,
                cache: "force-cache",
              }
              : require("./../../../assets/noPhoto.png")
          }
          style={styles.ratingImage}
        />
        <View>
          <Text style={{fontSize: 22}}>
            {item.names_surname}
          </Text>
          <Text style={{fontSize: 28, fontWeight: "bold", alignSelf: "flex-end"}}>
            {item.value}
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );
  const handleRatingClick = (item) => {
    setSelectedPolitician(item);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedPolitician(null);
  };

  return (
    <_Container style={{alignItems: "stretch", padding: 20}}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={45} animating={true} color={theme.colors.primary}/>
          <Text style={styles.loaderLabel}>Ładowanie...</Text>
        </View>
      ) : ratings.length === 0 ? (
        <View style={styles.noRatingsContainer(theme)}>
          <Text style={{fontSize: 18}}>Nie ma niczego do pokazania...{'\n'}Najpierw dodaj opinię!</Text>
        </View>
      ) : (
        <View style={styles.summaryTile(theme)}>

          {!!highestRating && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.highestLowestTile(theme)}
              onPress={() => handleRatingClick(highestRating)}
            >
              <View style={{gap: 3}}>
                <Text style={{fontSize: 18, fontWeight: "bold"}}>Najwyższa ocena:</Text>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginRight: 5}}>
                  <Text style={{fontSize: 20}}>{highestRating.names_surname}</Text>
                  <Text style={{fontSize: 24, fontWeight: "bold", marginLeft: 15}}>{highestRating.value}</Text>
                </View>
              </View>

            </TouchableOpacity>
          )}

          {!!lowestRating && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.highestLowestTile(theme)}
              onPress={() => handleRatingClick(lowestRating)}
            >
              <Text style={{fontSize: 18, fontWeight: "bold"}}>Najniższa ocena:</Text>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginRight: 5}}>
                <Text style={{fontSize: 20}}>{lowestRating.names_surname}</Text>
                <Text style={{fontSize: 24, fontWeight: "bold", marginLeft: 15}}>{lowestRating.value}</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={{flexDirection: "row", gap: 15, alignItems: "center", marginLeft: 8}}>
            <Text style={{fontSize: 20, fontWeight: "500"}}>Łączna liczba ocen:</Text>
            <Text style={{fontSize: 24, fontWeight: "bold"}}>{ratings.length}</Text>
          </View>

        </View>
      )}
      {ratings?.length > 0 && (
        <FlatList
          data={ratings}
          renderItem={renderRatingItem}
          keyExtractor={(item, index) => index.toString()}
          persistentScrollbar={true}
          style={styles.list}
          contentContainerStyle={{paddingHorizontal: 5, paddingBottom: 5}}
        />
      )}

      <Portal>
        <Dialog
          style={{backgroundColor: theme.colors.surfaceVariant}}
          visible={dialogVisible}
          onDismiss={closeDialog}
        >
          <Dialog.Title style={{fontSize: 26}}>{selectedPolitician?.names_surname || "Szczegóły oceny"}</Dialog.Title>
          <Dialog.Content style={{gap: 8}}>
            <Text style={styles.dialogText(theme)}>
              <Text style={styles.dialogLabel}>Tytuł:{"  "}</Text>
              {selectedPolitician?.title || "Brak informacji"}
            </Text>
            <Text style={styles.dialogText(theme)}>
              <Text style={styles.dialogLabel}>Ocena:{"  "}</Text>
              {selectedPolitician?.value}
            </Text>
            <Text style={styles.dialogText(theme)}>
              <Text style={styles.dialogLabel}>Opis:{"  "}</Text>
              {selectedPolitician?.description || "Brak opisu"}
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
  loaderContainer: {
    height: "74%",
    alignItems: "center",
    paddingTop: "20%",
  },
  loaderLabel: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
  },

  noRatingsContainer: (theme) => ({
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    top: "13%",
    paddingHorizontal: 20,
    paddingVertical: 30,

    backgroundColor: theme.colors.secondaryContainer,

    borderTopLeftRadius: 15,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 15,

    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 5,
    elevation: 8,
  }),

  summaryTile: (theme) => ({
    padding: 15,
    gap: 10,
    marginVertical: 10,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 20,

    backgroundColor: theme.colors.secondaryContainer,

    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 5,
    elevation: 8,
  }),
  highestLowestTile: (theme) => ({
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.inverseOnSurface,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 5,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 5,
    elevation: 4,
  }),

  list: {
    marginVertical: 5,
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: -5,
  },
  ratingItem: (theme) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,

    backgroundColor: theme.colors.inverseOnSurface,

    borderRadius: 10,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 5,
    elevation: 3,
  }),
  ratingImage: {
    aspectRatio: 1,
    width: 60,
    borderRadius: 25,
  },


  dialogText: (theme) => ({
    padding: 10,
    fontSize: 18,

    backgroundColor: theme.colors.inverseOnSurface,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 5,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 5,
    elevation: 3,
  }),
  dialogLabel: {
    fontWeight: "bold",
  },

});
