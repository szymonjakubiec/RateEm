import {StatusBar} from "expo-status-bar";
import {BackHandler, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import {useEffect} from "react";



export default function ResetSuccessScreen({navigation, route}) {

  // PK: Prevents navigating back
  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sukces!</Text>
      <Text style={styles.subTitle}>Konto zostało założone.</Text>

      <TouchableHighlight
        style={styles.button}

        // PK: Goes to logging screen with clearing the navigation stack
        onPress={() => {
          navigation.popToTop();
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>Powrót do menu</Text>
      </TouchableHighlight>

    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 70,
  },
  title: {
    fontSize: 24,
    alignSelf: "flex-start",
    left: 20,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 50,
    alignSelf: "flex-start",
    left: 20,
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "solid",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 20,
    paddingRight: 20,
    width: "90%",
    marginBottom: 15,
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
