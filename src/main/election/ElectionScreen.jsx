import {StyleSheet, Text, TouchableHighlight} from "react-native";
import {goBack} from "../../backend/CommonMethods";
import _Container from "../styles/Container";



export default function ElectionScreen({navigation}) {

  goBack(navigation);

  return (
    <_Container>
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("ElectionExplanation");
        }}
      >
        <Text style={styles.buttonText}>Wytłumaczenie wyborów</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("ElectoralDistricts");
        }}
      >
        <Text style={styles.buttonText}>Okręgi wyborcze</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("Calendar");
        }}
      >
        <Text style={styles.buttonText}>Kalendarz wyborczy</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("Calculator");
        }}
      >
        <Text style={styles.buttonText}>Kalkulator mandatów</Text>
      </TouchableHighlight>
    </_Container>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    height: 100,
    width: "100%",
    paddingTop: 8,
    paddingBottom: 8,
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
  },

  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
  },
});
