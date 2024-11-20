import {useEffect, useRef, useState} from "react";
import {useRoute} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, TouchableHighlight, SafeAreaView, BackHandler} from "react-native";
import {TextInput} from "react-native-paper";
import {getAllUsers, updateUser} from "../../../backend/database/Users";
import {alert} from "../../../backend/CommonMethods";



export default function ChangePassScreen({navigation, route}) {
  //
  // ===== PROPERTIES ============================================================= //
  const _title = "Rate'Em";
  const email = route.params?.email;

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);


  // Values
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Password visibility
  const [passVisible, setPassVisible] = useState(true);
  const [repeatPassVisible, setRepeatPassVisible] = useState(true);

  // const route = useRoute();

  // Validate values
  const [wrongPass, setWrongPass] = useState("");
  const [wrongPassRep, setWrongPassRep] = useState("");

  // ===== METHODS ================================================================ //

  const validateFieldsOnSubmit = () => {
    if (
      password.length < 8 ||
      !/^[a-zA-Z]/.test(password) ||
      !/^[a-zA-Z0-9!#$._@-]+$/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!#$._@]/.test(password)
    ) {
      setWrongPass(
        "Hasło powinno mieć minimum 8 znaków. Powinno zaczynać się od litery i zawierać conajmniej:\n*1 cyfrę\n*1 znak specjalny (-, _, ., #, !, $, @)."
      );
      return false;
    }

    if (wrongPass || !password || wrongPassRep || !repeatPassword) {
      alert("Wypełnij poprawnie wszystkie pola.");
      return false;
    }
    return true;
  };

  const validateFieldsOnBlur = () => {
    return !(wrongPass || !password || wrongPassRep || !repeatPassword);
  };

  // const validatePass = (pass) => {
  //   if (!pass) {
  //     setWrongPass("Podaj hasło.");
  //   } else {
  //     setWrongPass("");
  //   }
  // };

  const validatePass = (pass) => {
    if (!pass) {
      setWrongPass("Podaj hasło.");
    } else {
      setWrongPass("");
    }
  };

  const validatePassRep = (pass) => {
    if (!pass) {
      setWrongPassRep("Powtórz hasło.");
    } else if (wrongPass) {
      setWrongPassRep("Popraw hasło.");
    } else if (pass !== password) {
      setWrongPassRep("Hasła są różne.");
    } else {
      setWrongPassRep("");
    }
  };

  const _textInputProps = {
    mode: "outlined",
    activeOutlineColor: "black",
    selectTextOnFocus: true,
    returnKeyType: "next",
    style: styles.textInput,
    selectionColor: "#bc15d279",
    cursorColor: "#b01ec386",
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Podaj nowe hasło:</Text>

      <TextInput
        {..._textInputProps}
        label="hasło"
        outlineColor={wrongPass ? "red" : "black"}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        secureTextEntry={passVisible}
        right={<TextInput.Icon icon={passVisible ? "eye" : "eye-off"}
                               onPress={() => setPassVisible(!passVisible)}/>
        }
        value={password}
        onChangeText={(text) => {
          text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
          repeatPassword && setRepeatPassword('');
          setPassword(text.trim());
          validatePass(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          // validatePassOut(password);
        }}
      />
      <Text style={styles.wrongInputText(wrongPass)}>{wrongPass}</Text>

      <TextInput
        {..._textInputProps}
        label="powtórz hasło"
        outlineColor={wrongPassRep ? "red" : "black"}
        returnKeyType="done"
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="currentPassword"
        secureTextEntry={repeatPassVisible}
        right={<TextInput.Icon icon={repeatPassVisible ? "eye" : "eye-off"}
                               onPress={() => setRepeatPassVisible(!repeatPassVisible)}/>
        }
        value={repeatPassword}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          setRepeatPassword(text.trim());
          validatePassRep(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          // validatePassRep(repeatPassword.trim());
        }}
      />
      <Text style={styles.wrongInputText(wrongPassRep)}>{wrongPassRep}</Text>

      <TouchableHighlight
        style={[styles.button, {marginTop: 40}, !validateFieldsOnBlur() && {opacity: 0.5}]}
        disabled={!validateFieldsOnBlur()}
        onPress={() => {
          const result = validateFieldsOnSubmit();
          if (result) {
            updateUser(email, {password})
              .then((result) => {
                if (result) {
                  console.info(2, result);
                  navigation.navigate("Success");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }}
      >
        <Text style={styles.buttonText}>Zmień hasło</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 70,
    paddingBottom: 70,
  },
  title: {
    fontSize: 22,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 40,
  },
  textInput: {
    width: "90%",
    marginTop: 2,
    marginBottom: 2,
    tintColor: "red",
  },
  wrongInputText: (wrongName, wrongEmail, wrongPhone, wrongPass, wrongPassRep) => ({
    display: wrongName || wrongEmail || wrongPhone || wrongPass || wrongPassRep ? "flex" : "none",
    fontSize: 12,
    color: "#e41c1c",
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginBottom: 6,
  }),
  button: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
