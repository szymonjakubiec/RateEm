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
