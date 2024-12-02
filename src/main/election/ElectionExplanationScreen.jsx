import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, TextInput } from "react-native";
import {useEffect} from "react";
import _Container from "../styles/Container";



export default function ElectionExplanation({navigation}) {
  useEffect(() => {
    navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent().setOptions({ tabBarStyle: { height: 65, borderTopLeftRadius: 10, borderTopRightRadius: 10 } });
    };
  }, []);

  return (
    <_Container>
      <TouchableHighlight
        style={styles.electionButton}
        onPress={() => {
          navigation.navigate("SejmExplanation");
        }}
      >
        <View style={styles.colorsMeaningDiv}>
          <View style={styles.circleSejm}/>
          <Text style={styles.electionButtonText}>wybory do Sejmu</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.electionButton}
        onPress={() => {
          navigation.navigate("PrezydentExplanation");
        }}
      >
        <View style={styles.colorsMeaningDiv}>
          <View style={styles.circlePrezydent}/>
          <Text style={styles.electionButtonText}>wybory Prezydenta RP</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.electionButton}
        onPress={() => {
          navigation.navigate("EuExplanation");
        }}
      >
        <View style={styles.colorsMeaningDiv}>
          <View style={styles.circleEu}/>
          <Text style={styles.electionButtonText}>wybory do Parlamentu Europejskiego</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.electionButton}
        onPress={() => {
          navigation.navigate("DhondtExplanation");
        }}
      >
        <View style={styles.colorsMeaningDiv}>
          <Text style={styles.electionButtonTextDhondt}>metoda d'Hondta</Text>
        </View>
      </TouchableHighlight>
    </_Container>
  );
}

const styles = StyleSheet.create({
  colorsMeaningDiv: {
    alignSelf: "left",
    flexDirection: "row",
  },
  electionButton: {
    backgroundColor: "#000",
    height: 70,
    width: "96%",
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 20,
    marginLeft: "2%",
    marginRight: "2%",
    borderRadius: 20,
    justifyContent: "center",
  },
  electionButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 7,
  },
  electionButtonTextDhondt: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 34,
  },

  circleSejm: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 7,
    marginVertical: 7,
    backgroundColor: "#12cdd4",
  },
  circlePrezydent: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 7,
    marginVertical: 7,
    backgroundColor: "#f24726",
  },
  circleEu: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 7,
    marginVertical: 7,
    backgroundColor: "#8fd14f",
  },
});
