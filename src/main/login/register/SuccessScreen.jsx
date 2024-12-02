import {StyleSheet, Text, TouchableHighlight} from "react-native";
import _Container from "../../styles/Container";



export default function SuccessScreen({navigation, route}) {


  return (
    <_Container>
      <Text style={styles.title}>Sukces!</Text>
      <Text style={styles.subTitle}>Konto zostało założone.</Text>

      <TouchableHighlight
        style={styles.button}

        // PK: Goes to logging screen with clearing the navigation stack
        onPress={() => {
          navigation.navigate("MainNav", {
            screen: "ExtrasNav",
            params: {
              screen: "Guide",
              options: {
                animationEnabled: true,
              },
            },
          });

        }}
      >
        <Text style={styles.buttonText}>Przejdź dalej</Text>
      </TouchableHighlight>

    </_Container>
  );
}

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    alignSelf: "flex-start",
    left: 20,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 50,
    alignSelf: "flex-start",
    left: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
  },
  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontWeight: "700",
  },
});
