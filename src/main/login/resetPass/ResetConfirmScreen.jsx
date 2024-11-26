import {StyleSheet, Text, TouchableHighlight, View, BackHandler} from "react-native";
import {useState, useEffect, useRef} from "react";
import {alert, checkVerificationSMS, sendMail, sendVerificationSMS} from "../../../backend/CommonMethods";
import {TextInput} from "react-native-paper";
import {textInputProps} from "../../styles/TextInput";



export default function ResetConfirmScreen({navigation, route}) {

  const {email, phone} = route.params;

  let _code = useRef('');

  const createCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  };

  const [code, setCode] = useState('');

  // Pk: Preventing navigating back
  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);


  useEffect(() => {
    (() => {
      _code.current = createCode();
      console.info("Kod:", _code.current);

      // Pk: SMS - Twilio
      // sendVerificationSMS(`+48${ phone }`);

      // Pk: EMAIL - Email.js
      sendMail(email, _code.current, "reset").then((status) => {
        status === 200 ? console.warn("Mail wysłany.") : console.warn("Błąd wysyłania maila!");
      }).catch((err) => {
        console.error(err);
      });

    })();

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Potwierdź reset hasła</Text>

      {/* PK: Sms */}
      {/*  <Text style={ styles.subTitle }>Na numer +48{ phone } został wysłany SMS z kodem weryfikacyjnym do zresetowania hasła.
      Wpisz go w oknie poniżej.</Text> */}

      {/* PK: Email */}
      <Text style={styles.subTitle}>Na adres e-mail {email} został wysłany mail z kodem weryfikacyjnym do resetu hasła.
        {"\n"}Wpisz go w oknie poniżej.</Text>

      <TextInput
        {...textInputProps}
        label="kod"
        returnKeyType="done"
        autoCapitalize="none"
        keyboardType="numeric"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={6}
        value={code}
        onChangeText={(text) => setCode(text)}
      />

      <TouchableHighlight
        style={[styles.button, {marginTop: 25}]}
        onPress={() => {

          // PK: SMS

          // checkVerificationSMS(`+48${ phone }`, code).then(async (success) => {
          //   if (!success) {
          //     alert("Error verifying code.");
          //     return false;
          //   }

          // PK: Email

          if (code !== _code.current) {
            alert("Błędny kod!\nSpróbuj ponownie.");
            return false;
          }

          navigation.navigate("ChangePass", {email});
          // });
        }}
      >
        <Text style={styles.buttonText}>Potwierdź</Text>
      </TouchableHighlight>

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
    fontSize: 24,
    marginBottom: 40,
    alignSelf: "flex-start",
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "justify",
  },
  button: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
    marginBottom: 100,
  },
  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontWeight: "700",
  },
});
