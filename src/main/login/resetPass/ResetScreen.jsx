import {useEffect, useRef, useState} from "react";
import {useRoute} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, TouchableHighlight, SafeAreaView} from "react-native";
import {TextInput} from "react-native-paper";
import {getAllUsers} from "../../../backend/database/Users";
import {alert} from "../../../backend/CommonMethods";



export default function ResetScreen({navigation}) {
  //
  // ===== PROPERTIES ============================================================= //
  const _title = "Rate'Em";


  // Values
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [wrongEmail, setWrongEmail] = useState("");
  const [wrongPhone, setWrongPhone] = useState("");


  // ===== METHODS ================================================================ //
  const emailExists = async (email) => {
    const users = await getAllUsers();
    return users.some((user) => user.email === email);
  };

  const phoneExists = async (phone) => {
    const users = await getAllUsers();
    return users.some((user) => user.phone_number === phone);
  };

  const validateFieldsOnSubmit = async () => {
    if (wrongEmail || !email /* || wrongPhone || !phone */) {
      alert("Wypełnij poprawnie wszystkie pola.");
      return false;
    }
    if (!(await emailExists(email))) {
      alert("Użytkownik o podanym adresie e-mail nie istnieje.\nSpróbuj podać inny adres e-mail.");
      return false;
    }
    // if (await phoneExists(phone)) {
    //   alert("Użytkownik o podanym numerze telofonu już istnieje.\nSpróbuj podać inny numer telefonu.");
    //   return false;
    // }
    return true;
  };

  const validateFieldsOnBlur = () => {
    return !(wrongEmail || !email /* || wrongPhone || !phone */);
  };

  const validateEmail = (email) => {
    if (!email) {
      setWrongEmail("Podaj e-mail.");
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setWrongEmail("Podaj prawidłowy e-mail.");
    } else {
      setWrongEmail("");
    }
  };

  const validatePhone = (phone) => {
    if (!phone || phone.length !== 9 || !["45", "50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"].includes(phone.slice(0, 2))) {
      setWrongPhone("Podaj prawidłowy numer telefonu.");
    } else {
      setWrongPhone("");
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
      {/* <Text style={styles.title}>Podaj numer telefonu do zresetowania hasła:</Text> */}
      <Text style={styles.title}>Podaj e-mail do zresetowania hasła:</Text>

      {/* PK: E-mail */}
      <TextInput
        {..._textInputProps}
        label="e-mail"
        outlineColor={wrongEmail ? "red" : "black"}
        autoComplete="email"
        textContentType="emailAddress"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          text = text.replace(/[^a-zA-Z0-9._%+@-]/g, "");
          setEmail(text.trim());
          validateEmail(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          // console.log("BLUR");
        }}
      />
      <Text style={styles.wrongInputText(wrongEmail)}>{wrongEmail}</Text>

      {/* PK: SMS */}
      {/* <SafeAreaView style={{flexDirection: "row", justifyContent: "center"}}>
        <TextInput
          {..._textInputProps}
          label="numer telefonu"
          outlineColor={wrongPhone ? "red" : "black"}
          maxLength={12}
          style={[styles.textInput, {paddingLeft: 31}]}
          // left={ <TextInput.Affix textStyle={ {fontSize: 16, marginLeft: 4} } text="+48 |"/> }
          autoComplete="tel"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            text.slice(0, 3) === "+48" && (text = text.slice(3));
            text = text.trim().replace(/[^0-9]/g, "");
            if (text.length > 9) return;
            setPhone(text.trim());
            validatePhone(text.trim());
            validateFieldsOnBlur();
          }}
          onBlur={() => {
            // validatePhoneOut(phone);
          }}
        />
        <Text style={{
          alignSelf: "center",
          left: 9,
          fontSize: 16,
          fontWeight: 300,
          position: "absolute",
          paddingTop: 8
        }}>+48 | </Text>
      </SafeAreaView>
      <Text style={styles.wrongInputText(wrongPhone)}>{wrongPhone}</Text> */}


      <TouchableHighlight
        style={[styles.button, {marginTop: 40}, !validateFieldsOnBlur() && {opacity: 0.5}]}
        disabled={!validateFieldsOnBlur()}
        onPress={async () => {
          validateFieldsOnSubmit().then((result) => {
            if (result) {
              navigation.navigate("Confirm", {
                // _title,
                email,
                phone,
              });
            }
          });
        }}
      >
        <Text style={styles.buttonText}>Zresetuj hasło</Text>
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
