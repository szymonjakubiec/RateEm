import {BackHandler, StyleSheet, Text, TouchableHighlight} from "react-native";
import {useEffect} from "react";
import _Container from "../../styles/Container";
import _Button from "../../styles/Button";



export default function ResetSuccessScreen({navigation}) {

  // PK: Prevents navigating back
  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <_Container>
      <Text style={styles.title}>Sukces!</Text>
      <Text style={styles.subTitle}>Hasło zostało zmienione.</Text>

      <_Button text="Powrót do menu" onPress={() => {
        navigation.popToTop();
        navigation.goBack();
      }}/>

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
    marginTop: 10,
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
