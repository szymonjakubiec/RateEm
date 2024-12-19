import {useEffect, useState} from "react";
import {BackHandler, StyleSheet, Text} from "react-native";
import {Button, Dialog, Portal} from "react-native-paper";
import SearchFlatList from "./searchComponents/SearchFlatList.jsx";
import _Container from "../styles/Container";



export default function HomeScreen({navigation}) {
  const [selectedPoliticianId, setSelectedPoliticianId] = useState(0);
  const [exitDialog, setExitDialog] = useState(false);
  const showDialog = () => setExitDialog(true);
  const hideDialog = () => setExitDialog(false);

  // Pk: Exiting app from HomeScreen
  useEffect(() => {
    const backAction = () => {
      // When on Home Screen and not on Profile Screen
      if (navigation.getState().routes.length === 1) {
        // todo: ZAPYTANIE CZY NA PEWNO WYJŚĆ
        // BackHandler.exitApp();
        showDialog();
        console.log(exitDialog);
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

  function handlePress(selected) {
    setSelectedPoliticianId(selected);
  }

  useEffect(() => {
    setSelectedPoliticianId(0);
  }, []);

  return (
    <_Container
      style={styles.container}>
      <SearchFlatList handleOnPress={handlePress}/>

      {/* Exit alert when leaving app */}
      <Portal>
        <Dialog visible={exitDialog} onDismiss={hideDialog}>
          <Dialog.Title>Uwaga</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Czy na pewno chcesz wyjść z aplikacji?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => hideDialog()}>Anuluj</Button>
            <Button
              onPress={() => {
                hideDialog();
                BackHandler.exitApp();
              }}
            >
              Wyjdź
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </_Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: "1%",
    margin: 0,
    justifyContent: "flex-start"
  },
});
