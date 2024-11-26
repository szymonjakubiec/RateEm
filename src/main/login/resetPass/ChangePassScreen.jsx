import {useEffect, useState} from "react";
import {StyleSheet, Text, TouchableHighlight, SafeAreaView, BackHandler} from "react-native";
import {TextInput} from "react-native-paper";
import {getUserIdByEmail, updateUser} from "../../../backend/database/Users";
import {textInputProps} from "../../styles/TextInput";



export default function ChangePassScreen({navigation, route}) {
  //
  // ===== PROPERTIES ============================================================= //
  const email = route.params?.email;

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
      !/[!#$._@-]/.test(password)
    ) {
      setWrongPass(
        "Hasło powinno zawierać minimum 8 znaków. Powinno zaczynać się od litery i zawierać conajmniej:\n*1 cyfrę\n*1 znak specjalny (-, _, ., #, !, $, @)."
      );
      return false;
    }
    return true;
  };

  const validateFieldsOnBlur = () => {
    return !(wrongPass || !password || wrongPassRep || !repeatPassword);
  };

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


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Podaj nowe hasło:</Text>

      <TextInput
        {...textInputProps}
        label="hasło"
        outlineColor={wrongPass ? "#e41c1c" : "black"}
        activeOutlineColor={wrongPass ? "#e41c1c" : "black"}
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
        {...textInputProps}
        label="powtórz hasło"
        outlineColor={wrongPassRep ? "#e41c1c" : "black"}
        activeOutlineColor={wrongPassRep ? "#e41c1c" : "black"}
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
          text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
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
            getUserIdByEmail(email).then(id => {
              updateUser(id, {password})
                .then((result) => {
                  if (result) {
                    navigation.navigate("Success");
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }).catch(err => {
              console.error(err);
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
