import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import _Container from "../../styles/Container";
import _Button from "../../styles/Button";



export default function SuccessScreen({navigation, route}) {


  return (
    <_Container>

      <View style={{alignSelf: "center"}}>
        <Text style={styles.title}>Sukces!</Text>
        <Text style={styles.subTitle}>Konto zostało założone.</Text>
      </View>

      <_Button
        buttonText="Wyświetl tutorial"
        // PK: Goes to logging screen with clearing the navigation stack
        onPress={() => {
          navigation.navigate("MainNav", {
            screen: "ExtrasNav",
            params: {
              screen: "Guide",
              options: {
                animationEnabled: true, // Włącza animację przejścia
              },
            },
          });

        }}
      />

    </_Container>
  );
}

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 70,
  },
  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontWeight: "700",
  },
});
