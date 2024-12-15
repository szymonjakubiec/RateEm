import {useEffect} from "react";
import {StyleSheet, Text, View, TouchableHighlight} from "react-native";
import _Container from "../styles/Container";
import {tabBarAnim} from "../../backend/CommonMethods";
import _Button from "../styles/Button";
import {TextInput, useTheme} from "react-native-paper";



export default function ElectionExplanation({navigation}) {

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  return (
    <_Container>

      <_Button text="Wybory do Sejmu" mode="tile"
               iconLeft={{icon: "circle-slice-8", color: useTheme().colors.sejm}}
               style={{alignItems: "flex-start"}}
               onPress={() => navigation.navigate("SejmExplanation")}/>

      <_Button text="Wybory Prezydenta RP" mode="tile"
               iconLeft={{icon: "circle-slice-8", color: useTheme().colors.prezydent}}
               style={{alignItems: "flex-start"}}
               onPress={() => navigation.navigate("PrezydentExplanation")}/>

      <_Button text="Wybory do Parlamentu Europejskiego" mode="tile"
               multiline
               iconLeft={{icon: "circle-slice-8", color: useTheme().colors.parlament}}
               style={{alignItems: "flex-start"}}
               onPress={() => navigation.navigate("EuExplanation")}/>

      <_Button text="Metoda d'Hondta" mode="tile"
               iconLeft={{icon: "circle-slice-8", color: "black"}}
               style={{alignItems: "flex-start"}}
               onPress={() => navigation.navigate("DhondtExplanation")}/>

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
