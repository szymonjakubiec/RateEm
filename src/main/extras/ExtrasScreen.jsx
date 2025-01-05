import React from "react";
import _Container from "../styles/Container";
import _Button from "../styles/Button";
import {useTheme} from "react-native-paper";



export default function ExtrasScreen({navigation}) {
  return (
    <_Container style={{paddingBottom: "22.5%"}}>
      <_Button text="Ustawienia konta"
               mode="tile"
               onPress={() => navigation.navigate("Settings")}/>

      <_Button text="Podsumowanie ocen"
               mode="tile"
               onPress={() => navigation.navigate("Summary")}/>

      <_Button text="Przewodnik po aplikacji"
               mode="tile"
               onPress={() => navigation.navigate("Guide")}/>

      <_Button text="Wyloguj się"
               mode="tile"
               style={{backgroundColor: useTheme().colors.error, marginTop: 50, width: "auto"}}
               onPress={() => {
                 navigation.popToTop();
               }}/>
    </_Container>
  );
}
