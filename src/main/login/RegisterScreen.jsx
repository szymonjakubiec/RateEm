import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { getAllUsers } from "../../backend/database/Users";

export default function RegisterScreen({ navigation }) {
  //
  // ===== PROPERTIES ============================================================= //
  const _title = "Rate'Em";

  // Values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  // const route = useRoute();

  // Temp
  const _selectionColor = "#bc15d279";
  const _cursorColor = "#b01ec386";

  // Validate values
  const [wrongName, setWrongName] = useState("");
  const [wrongEmail, setWrongEmail] = useState("");
  const [wrongPhone, setWrongPhone] = useState("");
  const [wrongPass, setWrongPass] = useState("");
  const [wrongPassRep, setWrongPassRep] = useState("");

  // ===== METHODS ================================================================ //
  const emailExists = async (email) => {
    const users = await getAllUsers();
    return users.some((user) => user.email === email);
  };

  const phoneExists = async (phone) => {
    const users = await getAllUsers();
    return users.some((user) => user.phone === phone);
  };

  const alert = (text) => {
    Alert.alert(
      "❌ Błąd ❌",
      text,
      [
        {
          text: "OK 💀",
          onPress: () => console.log("RegisterScreen.jsx:34 ~ OK kliknięty."),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log("RegisterScreen.jsx:38 ~ Kliknięto poza alert."),
      }
    );
  };

  const validateFieldsOnClick = async () => {
    if (wrongName || !name || wrongEmail || !email || wrongPhone || !phone || wrongPass || !password || wrongPassRep || !repeatPassword) {
      alert("Wypełnij poprawnie wszystkie pola.");
      return false;
    }
    if (await emailExists(email)) {
      alert("Użytkownik o podanym adresie e-mail już istnieje.\nSpróbuj podać inny adres e-mail.");
      return false;
    }
    if (await phoneExists(phone)) {
      alert("Użytkownik o podanym numerze telofonu już istnieje.\nSpróbuj podać inny numer telefonu.");
      return false;
    }
    return true;
  };

  const validateFieldsOnBlur = () => {
    if (wrongName || !name || wrongEmail || !email || wrongPhone || !phone || wrongPass || !password || wrongPassRep || !repeatPassword) {
      return false;
    }
    return true;
  };

  const validateName = (name) => {
    if (!name) {
      setWrongName("Podaj imię.");
    } else {
      setWrongName("");
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      setWrongEmail("Podaj e-mail.");
    } /* else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setWrongEmail("Podaj prawidłowy e-mail.");
    } */ else {
      setWrongEmail("");
    }
  };

  const validateEmailOut = (email) => {
    if (!email) {
      setWrongEmail("Podaj e-mail.");
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setWrongEmail("Podaj prawidłowy e-mail.");
    } else {
      setWrongEmail("");
    }
  };

  const validatePhone = (phone) => {
    if (phone.length === 9) {
      setWrongPhone("");
    }
  };

  const validatePhoneOut = (phone) => {
    console.log(typeof phone);
    if (!phone || phone.length !== 9 || !["45", "50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"].includes(phone.slice(0, 2))) {
      setWrongPhone("Podaj prawidłowy numer telefonu.");
    } else {
      setWrongPhone("");
    }
  };

  const validatePass = (pass) => {
    if (!pass) {
      setWrongPass("Podaj hasło.");
    } else {
      setWrongPass("");
    }
  };

  const validatePassOut = (pass) => {
    if (!pass) {
      setWrongPass("Podaj hasło.");
    } else if (pass.length < 8 || !/^[a-zA-Z]/.test(pass) || !/^[a-zA-Z0-9!#$._@-]+$/.test(pass) || !/[!#$._@]/.test(pass)) {
      setWrongPass(
        "Hasło powinno mieć minimum 8 znaków. Powinno zaczynać się od litery i zawierać conajmniej:\n*1 cyfrę\n*1 znak specjalny (-, _, ., #, !, $, @)."
      );
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
    <View style={styles.container}>
      <Text style={styles.title}>Aby zarejestrować nowe konto, wypełnij poniższe pola:</Text>

      <TextInput
        style={styles.textInput(wrongName)}
        autoComplete="name"
        placeholder="imię"
        value={name}
        selectionColor={_selectionColor}
        cursorColor={_cursorColor}
        onChangeText={(text) => {
          // if (text.includes(" ")) return;
          text = text.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "");
          text.length > 0 && (text = text[0].toUpperCase() + text.slice(1).toLowerCase());
          setName(text.trim());
          validateName(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          validateName(name);
        }}
      />
      <Text style={styles.wrongInputText(wrongName)}>{wrongName}</Text>

      <TextInput
        style={styles.textInput(wrongEmail)}
        autoComplete="email"
        textContentType="emailAddress"
        autoCapitalize="none"
        placeholder="e-mail"
        value={email}
        selectionColor={_selectionColor}
        cursorColor={_cursorColor}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          text = text.replace(/[^a-zA-Z0-9._%+@-]/g, "");
          setEmail(text.trim());
          validateEmail(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          validateEmailOut(email);
        }}
      />
      <Text style={styles.wrongInputText(wrongEmail)}>{wrongEmail}</Text>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ alignSelf: "center", left: 12, fontSize: 13, fontWeight: 300, position: "absolute", paddingTop: 7 }}>+48 | </Text>
        <TextInput
          style={[styles.textInput(wrongPhone), { paddingLeft: 44 }]}
          autoComplete="tel"
          keyboardType="phone-pad"
          placeholder="numer telefonu"
          value={phone}
          selectionColor={_selectionColor}
          cursorColor={_cursorColor}
          onChangeText={(text) => {
            text.slice(0, 3) === "+48" && (text = text.slice(3));
            text = text.trim().replace(/[^0-9]/g, "");
            if (text.length > 9) return;
            setPhone(text.trim());
            validatePhone(text.trim());
            validateFieldsOnBlur();
          }}
          onBlur={() => {
            validatePhoneOut(phone);
          }}
        />
      </View>
      <Text style={styles.wrongInputText(wrongPhone)}>{wrongPhone}</Text>

      <TextInput
        style={styles.textInput(wrongPass)}
        iconFamily={"MaterialCommunityIcons"}
        iconSuccess={"emoticon-happy-outline"}
        iconWarning={"alert-outline"}
        iconAlert={"alert-octagon-outline"}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="hasło"
        secureTextEntry
        value={password}
        selectionColor={_selectionColor}
        cursorColor={_cursorColor}
        onChangeText={(text) => {
          text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
          setPassword(text.trim());
          validatePass(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          validatePassOut(password);
        }}
      />
      <Text style={styles.wrongInputText(wrongPass)}>{wrongPass}</Text>

      <TextInput
        style={styles.textInput(wrongPassRep)}
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="currentPassword"
        placeholder="powtórz hasło"
        secureTextEntry
        value={repeatPassword}
        selectionColor={_selectionColor}
        cursorColor={_cursorColor}
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
        style={[styles.button, { marginTop: 40 }, !validateFieldsOnBlur() && { opacity: 0.5 }]}
        disabled={!validateFieldsOnBlur()}
        onPress={() => {
          validateFieldsOnClick().then((result) => {
            if (result) {
              navigation.navigate("Confirm", {
                // _title,
                name,
                email,
                phone,
                password,
              });
            }
          });
        }}
      >
        <Text style={styles.buttonText}>Zarejestruj</Text>
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
    paddingHorizontal: 70,
    paddingBottom: 70,
  },
  title: {
    fontSize: 22,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 40,
  },
  textInput: (wrongName, wrongEmail, wrongPhone, wrongPass, wrongPassRep) => ({
    borderRadius: 5,
    borderWidth: 2,
    borderColor: wrongName || wrongEmail || wrongPhone || wrongPass || wrongPassRep ? "#e41c1c" : "#000",
    borderStyle: "solid",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 20,
    paddingRight: 20,
    width: "90%",
    marginTop: 10,
    marginBottom: 2,
    tintColor: "red",
    height: 45,
  }),
  wrongInputText: (wrongName, wrongEmail, wrongPhone, wrongPass, wrongPassRep) => ({
    display: wrongName || wrongEmail || wrongPhone || wrongPass || wrongPassRep ? "flex" : "none",
    fontSize: 12,
    color: "#e41c1c",
    alignSelf: "flex-start",
    paddingLeft: 20,
  }),
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
