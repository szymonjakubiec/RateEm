import {useEffect} from "react";
import _Container from "../styles/Container";
import {tabBarAnim} from "../../backend/CommonMethods";
import _Button from "../styles/Button";
import {useTheme} from "react-native-paper";



export default function ElectionExplanation({navigation}) {

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  return (
    <_Container>

      <_Button text="Wybory do Sejmu" mode="tile"
               iconLeft={{icon: "circle-slice-8", color: useTheme().colors.sejm}}
               onPress={() => navigation.navigate("SejmExplanation")}/>

      <_Button text="Wybory Prezydenta RP" mode="tile"
               iconLeft={{icon: "circle-slice-8", color: useTheme().colors.prezydent}}
               style={{paddingLeft: "15%"}}
               onPress={() => navigation.navigate("PrezydentExplanation")}/>

      <_Button text="Wybory do Parlamentu Europejskiego" mode="tile"
               multiline
               iconLeft={{icon: "circle-slice-8", color: useTheme().colors.parlament}}
               style={{paddingLeft: "15%"}}
               onPress={() => navigation.navigate("EuExplanation")}/>

      <_Button text="Metoda d'Hondta" mode="tile"
               iconLeft={{icon: "circle-slice-8", color: "black"}}
               onPress={() => navigation.navigate("DhondtExplanation")}/>

    </_Container>
  );
}
