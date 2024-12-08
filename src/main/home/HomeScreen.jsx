import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, BackHandler, Text } from "react-native";
import { MD2Colors } from "react-native-paper";
import SearchFlatList from "./searchComponents/SearchFlatList.jsx";
import { GlobalContext } from "../nav/GlobalContext.jsx";
import _Container from "../styles/Container";

export default function HomeScreen({ navigation }) {
  const politicianNameData = useContext(GlobalContext).namesData;
  const userId = useContext(GlobalContext).userId;
  const { setNamesData } = useContext(GlobalContext);
  const [selectedPoliticianId, setSelectedPoliticianId] = useState(0);

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
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  /**
   * Navigation to the ProfileScreen.js after selection of politician.
   */
  useEffect(() => {
    if (selectedPoliticianId > 0) {
      navigation.navigate("Profile", {
        selectedPoliticianId,
      });
      setSelectedPoliticianId(0);
    }
  }, [selectedPoliticianId]);

  // async function init() {
  //   const data = await getAllPoliticianNames();
  //   setNamesData(data);
  //   console.log("updated all politicians2");
  // }

  // useEffect(() => {
  //   init();
  // }, []);

  function handlePress(selected) {
    setSelectedPoliticianId(selected);
  }

  useEffect(() => {
    setSelectedPoliticianId(0);
  }, []);

  return (
    <_Container style={{ justifyContent: "flex-start", padding: 0 }}>
      {politicianNameData ? (
        <SearchFlatList data={politicianNameData} handleOnPress={handlePress} />
      ) : (
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Ładowanie</Text>
          <ActivityIndicator size={"large"} animating={true} color={MD2Colors.red800} />
        </View>
      )}
    </_Container>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
