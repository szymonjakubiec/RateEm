import React from "react";
import {Text, TouchableHighlight, StyleSheet} from "react-native";
import _Container from "../styles/Container";
import _Button from "../styles/Button";
import {useTheme} from "react-native-paper";



export default function ExtrasScreen({navigation}) {
  return (
    <_Container>
      <_Button buttonText="Ustawienia konta"
               mode="tile"
               onPress={() => navigation.navigate("Settings")}/>

      <_Button buttonText="Podsumowanie ocen"
               mode="tile"
               onPress={() => navigation.navigate("Summary")}/>

      <_Button buttonText="Przewodnik po aplikacji"
               mode="tile"
               onPress={() => navigation.navigate("Guide")}/>

      <_Button buttonText="Wyloguj się"
               mode="tile"
               style={{backgroundColor: useTheme().colors.error, marginTop: 50, width: "auto"}}
               onPress={() => {
                 navigation.popToTop(); //todo większa logika
               }}/>
    </_Container>
  );
}
