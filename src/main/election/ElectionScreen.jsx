import _Container from "../styles/Container";
import _Button from "../styles/Button";
import React from "react";



export default function ElectionScreen({navigation}) {

  //ownGoBack(navigation);

  return (
    <_Container>

      <_Button buttonText="Wytłumaczenie wyborów"
               mode="tile"
               onPress={() => navigation.navigate("ElectionExplanation")}/>

      <_Button buttonText="Mapa okręgów wyborczych"
               mode="tile"
               onPress={() => navigation.navigate("ElectoralDistricts")}/>

      <_Button buttonText="Kalendarz wyborczy"
               mode="tile"
               onPress={() => navigation.navigate("Calendar")}/>

      <_Button buttonText="Kalkulator mandatów"
               mode="tile"
               onPress={() => navigation.navigate("Calculator")}/>

    </_Container>
  );
}
