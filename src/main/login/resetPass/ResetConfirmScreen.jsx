import {StyleSheet, Text, TouchableHighlight, View, BackHandler} from "react-native";
import {useState, useEffect, useRef} from "react";
import {checkVerificationSMS, sendMail, sendVerificationSMS} from "../../../backend/CommonMethods";
import {TextInput} from "react-native-paper";
import {textInputProps} from "../../styles/TextInput";



export default function ResetConfirmScreen({navigation, route}) {

  const {email, phone} = route.params;

  const _code = useRef('');

  const createCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  };

  const [code, setCode] = useState('');
  const [wrongCode, setWrongCode] = useState('');


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


  /**
   * Validates code.
   * @param {string} code - code to validate
   */
  const validateCodeOnChange = (code) => {
    if (code.length < 6) {
      setWrongCode("Wpisz 6 cyfrowy kod.");
    } else {
      setWrongCode('');
    }
  };

  const isCodeValid = () => {
    return !(wrongCode || !code);
  };


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
        outlineColor={wrongCode ? "#e41c1c" : "black"}
        activeOutlineColor={wrongCode ? "#e41c1c" : "black"}
        keyboardType="numeric"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        autoCapitalize="none"
        returnKeyType="done"
        maxLength={6}
        value={code}
        onChangeText={(text) => {
          text = text.replace(/[^0-9]/g, '');
          setCode(text.trim());
          validateCodeOnChange(text.trim());
        }}
      />
      <Text style={styles.wrongInputText(wrongCode)}>{wrongCode}</Text>

      <TouchableHighlight
        style={[styles.button, {marginTop: 30}, !isCodeValid() && {opacity: 0.5}]}
        disabled={!isCodeValid()}
        onPress={() => {

          // PK: SMS

          // checkVerificationSMS(`+48${ phone }`, code).then(async (success) => {
          //   setWrongCode("Błąd! Spróbuj ponownie.");
          //   if (!success) {
          //     return false;
          //   }

          // PK: Email

          if (code !== _code.current) {
            setWrongCode("Błędny kod! Spróbuj ponownie.");
            setCode('');
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
  wrongInputText: (wrongCode) => ({
    display: wrongCode ? "flex" : "none",
    fontSize: 14,
    color: "#e41c1c",
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginTop: 2,
    marginBottom: 6,
  }),
  button: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
    marginBottom: 70,
  },
  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontWeight: "700",
  },
});
