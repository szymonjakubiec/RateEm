import {BackHandler, Text} from "react-native";
import {useEffect} from "react";
import _Container from "../styles/Container";



export default function HomeScreen({navigation}) {

  // Pk: Exiting app from HomeScreen
  useEffect(() => {
    const backAction = () => {
      if (navigation.getState().index === 2) {
        BackHandler.exitApp();
        return true;
      }
      navigation.goBack();

      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <_Container>
      <Text>To jest strona główna.</Text>
    </_Container>
  );
}
