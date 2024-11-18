import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, TouchableHighlight, View, BackHandler } from "react-native";
import { useState, useEffect } from "react";
import { sendVerificationSMS } from "../../backend/CommonMethods";
import { addUser } from "../../backend/database/Users";

export default function ConfirmScreen({ navigation, route }) {
  // const route = useRoute();
  const { name, email, phone, password } = route.params;
  let _code = 0;

  const createCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code;
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     return true;
  //     // if (currentRoute === "Home") {
  //     //   // Wyjście z aplikacji, jeśli aktualny ekran to Home
  //     //   BackHandler.exitApp();
  //     //   return true; // Zapobiega domyślnemu zachowaniu
  //     // } else {
  //     //   // Przechodzi do ekranu Home w przypadku innych ekranów
  //     //   navigation.navigate("Home");
  //     //   return true;
  //     // }
  //   };
  //   const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () => backHandler.remove(); // usuwa nasłuchiwacz przy odmontowaniu komponentu
  // }, [navigation]);

  (() => {
    _code = createCode();
    sendVerificationSMS(phone, _code);
  })();

  return (
    <View style={styles.container}>
      <Text style={styles.subTitle}>Potwierdź</Text>
      <Text style={styles.subTitle}>Na numer +48{phone} został wysłany SMS z kodem weryfikacyjnym. Wpisz go w oknie poniżej.</Text>

      <TextInput style={styles.textInput} autoCapitalize="none" autoComplete="one-time-code" textContentType="oneTimeCode" placeholder="kod" />

      <TouchableHighlight
        style={styles.button}
        onPress={async () => {
          await addUser(name, email, password, phone, 1, 69, 420)
            .then((result) => {
              console.log(result);
              if (result) {
                navigation.navigate("Success");
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      >
        <Text style={styles.buttonText}>Potwierdź</Text>
      </TouchableHighlight>

      {/* <TextInput 
          style={styles.textInput}
          placeholder='email'
      />
      <TextInput 
          style={styles.textInput}
          placeholder='hasło'
      />
      
      <TouchableHighlight
          style={styles.button}
          onPress={() =>{
            navigation.navigate('MainNav', {screen: 'Home', _title}); // domyślny ekran, parametry
          }}
      >
          <Text style={styles.buttonText}>Zaloguj</Text>
      </TouchableHighlight>
      <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 70,
  },
  title: {
    fontSize: 48,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 50,
    // textAlign: "justify",
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