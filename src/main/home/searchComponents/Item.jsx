import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {memo} from "react";
import {useTheme} from "react-native-paper";



export default memo(function Item({
                                    id,
                                    nameSurname,
                                    name,
                                    surname,
                                    globalRating,
                                    ratingCount,
                                    picture,
                                    handleOnPress,
                                    isTrending,
                                    sortOrder,
                                  }) {

  const theme = useTheme();

  const styles = StyleSheet.create({

    politicianItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme.colors.inverseOnSurface,
      marginVertical: 5,
      borderRadius: 10,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.5,
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 5,
      elevation: 3,
    },
    politicianItemText: {
      fontSize: 16,
      fontWeight: "600",
    },
    politicianScore: {
      fontSize: 16,
    },
    politicianItemImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 10,
    },
    politicianInfo: {
      flex: 1,
    },

  });


  return (
    <TouchableHighlight
      key={id}
      style={styles.politicianItem}
      underlayColor={theme.colors.primaryContainer}
      onPress={() => {
        handleOnPress(id);
      }}
    >
      <>
        <Image
          source={
            picture && picture !== ""
              ? {
                uri: `data:image/jpeg;base64,${picture}`,
                cache: "force-cache",
              }
              : require("./../../../../assets/noPhoto.png")
          }
          style={styles.politicianItemImage}
        />
        <View style={styles.politicianInfo}>
          <Text style={styles.politicianItemText}>
            {name} {surname}
          </Text>
          <Text style={styles.politicianScore}>Ocena globalna: {globalRating ? globalRating.toFixed(2) : "—"}</Text>
          <Text style={styles.politicianScore}>
            {isTrending ? "Liczba ostatnich ocen" : "Liczba ocen"}: {ratingCount ? ratingCount : "—"}
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );
});
