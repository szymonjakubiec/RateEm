import {useState} from "react";
import {StyleSheet, Text, TouchableHighlight} from "react-native";
import isEmail from "validator/lib/isEmail";
import {TextInput} from "react-native-paper";
import {getAllUsers} from "../../../backend/database/Users";
import {useTextInputProps} from "../../styles/TextInput";
import _Container from "../../styles/Container";
import _ErrorText from "../../styles/ErrorText";
import _Button from "../../styles/Button";



export default function ResetScreen({navigation}) {
  //
  // ===== PROPERTIES ============================================================= //

  // PK: Verification type
  // const verifyType = "sms";
  const verifyType = "email";
  // const verifyType = "none";

  // Values
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [wrongPhone, setWrongPhone] = useState('');
  const [wrongEmail, setWrongEmail] = useState('');


  // ===== METHODS ================================================================ //

  const phoneExists = async (phone) => {
    const users = await getAllUsers();
    return users.some((user) => user.phone_number === phone);
  };

  const emailExists = async (email) => {
    const users = await getAllUsers();
    return users.some((user) => user.email === email);
  };


  const validateFieldsOnSubmit = async () => {
    if (verifyType === "sms" && !(await phoneExists(phone))) {
      setWrongPhone("Użytkownik o podanym numerze telefonu nie istnieje. Spróbuj podać inny numer telefonu.");
      return false;
    } else if (verifyType !== "sms" && !(await emailExists(email))) {
      setWrongEmail("Użytkownik o podanym adresie e-mail nie istnieje. Spróbuj podać inny adres e-mail.");
      return false;
    }
    return true;
  };

  const validateFieldOnBlur = () => {
    if (verifyType === "sms") return !(wrongPhone || !phone);
    else return !(wrongEmail || !email);
  };

  const validatePhone = (phone) => {
    if (!phone || phone.length !== 9 || !["45", "50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"].includes(phone.slice(0, 2))) {
      setWrongPhone("Podaj prawidłowy numer telefonu.");
    } else {
      setWrongPhone("");
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      setWrongEmail("Podaj e-mail.");
    } else if (!isEmail(email)) {
      setWrongEmail("Podaj prawidłowy e-mail.");
    } else {
      setWrongEmail('');
    }
  };


  return (
    <_Container>

      {verifyType === "sms" ? (
        <>
          {/* PK: SMS */}
          <TextInput
            {...useTextInputProps(wrongPhone)}
            label="numer telefonu"
            maxLength={12}
            left={<TextInput.Affix text="+48 |" textStyle={{marginRight: -10}}/>}
            autoComplete="tel"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              text.slice(0, 3) === "+48" && (text = text.slice(3));
              text = text.replace(/[^0-9]/g, "");
              if (text.length > 9) return;
              setPhone(text);
              validatePhone(text);
            }}
          />
          <_ErrorText text={wrongPhone}/>
        </>
      ) : (
        <>
          {/* PK: E-mail */}
          <Text style={styles.title}>Podaj e-mail do zresetowania hasła:</Text>
          <TextInput
            {...useTextInputProps(wrongEmail)}
            label="e-mail"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            returnKeyType="done"
            value={email}
            onChangeText={(text) => {
              text = text.replace(/[^a-zA-Z0-9._%+@-]/g, '');
              setEmail(text);
              validateEmail(text);
            }}
          />
          <_ErrorText text={wrongEmail}/>
        </>
      )
      }

      {/* PK: Reset password button */}
      <_Button
        text="Zresetuj hasło"
        onPress={() => {
          validateFieldsOnSubmit().then((result) => {
            if (result) {
              navigation.navigate("Confirm", {
                email,
                phone,
                verifyType
              });
            }
          });
        }}
        disabled={!validateFieldOnBlur()}
        style={{marginTop: 40}}
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
  wrongInputText: (wrongEmail, wrongPhone) => ({
    display: wrongEmail || wrongPhone ? "flex" : "none",
    fontSize: 14,
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
