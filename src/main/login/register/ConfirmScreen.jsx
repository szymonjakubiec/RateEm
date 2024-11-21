import {StyleSheet, Text, TextInput, TouchableHighlight, View, BackHandler} from "react-native";
import {useState, useEffect, useRef} from "react";
import {alert, checkVerificationSMS, sendMail, sendVerificationSMS} from "../../../backend/CommonMethods";
import {addUser} from "../../../backend/database/Users";



export default function ConfirmScreen({navigation, route}) {
  // const route = useRoute();
  const {name, email, phone, password} = route.params;
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
      sendMail(email, _code.current, "verify").then((status) => {
        status === 200 ? console.warn("Mail wysłany.") : console.warn("Błąd wysyłania maila!");
      }).catch((err) => {
        console.error(err);
      });

    })();

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.subTitle}>Potwierdź konto</Text>

      {/* PK: Sms */}
      {/*  <Text style={ styles.subTitle }>Na numer +48{ phone } został wysłany SMS z kodem weryfikacyjnym. Wpisz go w oknie
        poniżej.</Text> */}

      {/* PK: Email */}
      <Text style={styles.subTitle}>Na adres e-mail {email} został wysłany mail z kodem weryfikacyjnym. Wpisz go w
        oknie poniżej.</Text>

      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        placeholder="kod"
        value={code}
        onChangeText={(text) => setCode(text)}
      />

      <TouchableHighlight
        style={styles.button}
        onPress={async () => {
          // PK: SMS

          // await checkVerificationSMS(`+48${ phone }`, code).then(async (success) => {
          //   if (!success) {
          //     alert("Kod");
          //     return false;
          //   }

          // PK: Email

          if (code !== _code.current) {
            alert("Błędny kod!\nSpróbuj ponownie.");
            return false;
          }

          await addUser(name, email, password, phone, 1, 1, 1)
            .then((result) => {
              if (result) {
                navigation.navigate("Success");
              }
            })
            .catch((error) => {
              console.error(error);
            });
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