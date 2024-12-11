import {StyleSheet, Text, BackHandler} from "react-native";
import {useState, useEffect, useRef} from "react";
import {checkVerificationSMS, sendMail, sendVerificationSMS} from "../../../backend/CommonMethods";
import {addUser} from "../../../backend/database/Users";
import {TextInput} from "react-native-paper";
import {useTextInputProps} from "../../styles/TextInput";
import _Container from "../../styles/Container";
import _Button from "../../styles/Button";
import _AnimViewKeyboard from "../../styles/AnimViewKeyboard";



export default function ConfirmScreen({navigation, route}) {

  const {name, email, phone, password} = route?.params || {};

  // PK: Verification type
  // const verifyType = "sms";
  const verifyType = "email";
  // const verifyType = "none";

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
      verifyType === "sms" && sendVerificationSMS(`+48${phone}`);

      // Pk: EMAIL - Email.js
      verifyType === "email" && sendMail(email, _code.current, "verify").then((status) => {
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
    <_AnimViewKeyboard margin={70}>
      <_Container>
        <Text style={styles.title}>Potwierdź konto</Text>

        {verifyType === "sms" ? (
          <>
            {/* PK: Sms */}
            <Text style={styles.subTitle}>Na numer:</Text>
            <Text style={styles.email}>{phone}</Text>
            <Text style={[styles.subTitle, {marginBottom: 40}]}>został wysłany SMS z kodem weryfikacyjnym.
              {"\n"}Wpisz go w oknie poniżej.</Text>
          </>
        ) : (
          <>
            {/* PK: Email */}
            <Text style={styles.subTitle}>Na adres e-mail:</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={[styles.subTitle, {marginBottom: 40}]}>został wysłany mail z kodem weryfikacyjnym.
              {"\n"}Wpisz go w oknie poniżej.</Text>
          </>
        )}


        <TextInput
          {...useTextInputProps()}
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
        <_ErrorText text={wrongCode}/>

        <_Button
          buttonText="Potwierdź"
          disabled={!isCodeValid()}
          style={{marginTop: wrongCode ? 10 : 38}}
          onPress={() => {
            if (verifyType === "sms") {
              // PK: SMS
              checkVerificationSMS(`+48${phone}`, code).then(async (success) => {
                if (!success) {
                  setWrongCode("Błąd! Spróbuj ponownie.");
                  return false;
                }
              });
            }

            // PK: Email
            if (code !== _code.current) {
              setWrongCode("Błędny kod! Spróbuj ponownie.");
              setCode('');
              return false;
            }

            addUser(name, email, password, phone, 1, 1, 1)
              .then((result) => {
                if (result) {
                  navigation.navigate("Success");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }}/>

      </_Container>
    </_AnimViewKeyboard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 40,
    alignSelf: "flex-start",
  },
  subTitle: {
    width: "100%",
    fontSize: 18,
    // textAlign: "justify",
  },
  email: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    paddingVertical: 7,
    width: "95%",
    borderStyle: "dashed",
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
