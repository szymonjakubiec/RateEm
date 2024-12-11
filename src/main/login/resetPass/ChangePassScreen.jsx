import {useState} from "react";
import {StyleSheet, Text, TouchableHighlight} from "react-native";
import {TextInput} from "react-native-paper";
import {getUserIdByEmail, updateUser} from "../../../backend/database/Users";
import {useTextInputProps} from "../../styles/TextInput";
import _Container from "../../styles/Container";
import _ErrorText from "../../styles/ErrorText";
import _Button from "../../styles/Button";



export default function ChangePassScreen({navigation, route}) {
  //
  // ===== PROPERTIES ============================================================= //
  const email = route?.params?.email;

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
    <_Container>
      <Text style={styles.title}>Podaj nowe hasło:</Text>

      <TextInput
        {...useTextInputProps(wrongPass)}
        label="hasło"
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        secureTextEntry={passVisible}
        right={<TextInput.Icon
          icon={passVisible ? "eye" : "eye-off"}
          onPress={() => setPassVisible(!passVisible)}
          forceTextInputFocus={false}/>
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
      <_ErrorText text={wrongPass}/>

      <TextInput
        {...useTextInputProps(wrongPassRep)}
        label="powtórz hasło"
        returnKeyType="done"
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="currentPassword"
        secureTextEntry={repeatPassVisible}
        right={<TextInput.Icon
          icon={repeatPassVisible ? "eye" : "eye-off"}
          onPress={() => setRepeatPassVisible(!repeatPassVisible)}
          forceTextInputFocus={false}/>
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
      <_ErrorText text={wrongPassRep}/>

      <_Button
        buttonText="Zmień hasło"
        style={{marginTop: 40}}
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
      />
    </_Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 40,
  },
});
