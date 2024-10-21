import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  // ===== PROPERTIES ============================================================= //
  const _title = "Rate'Em";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  // const route = useRoute();

  // ===== METHODS ================================================================ //
  const validateFields = () => {
    // if (!name.trim()) {
    //   alert("Podaj imię.");
    //   return false;
    // }
    if (
      !email.trim() ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(email.trim())
    ) {
      alert("Podaj prawidłowy email.");
      return false;
    }
    // if (!phone.trim()) {
    //   alert("Podaj numer telefonu.");
    //   return false;
    // }
    // if (!password.trim()) {
    //   alert("Podaj hasło.");
    //   return false;
    // }
    // if (password.includes(" ")) {
    //   alert("Hasło nie może zawierać spacji");
    //   return false;
    // }
    // if (password.length < 8 || !/^[a-zA-Z]$/.test(password[0])) {
    //   alert(
    //     "Hasło powinno mieć minimum 8 znaków.\nPowinno zaczynać się od litery i zawierać conajmniej:\n*1 cyfrę\n*1 znak specjalny (#, !, $, -, _, .)."
    //   );
    //   return false;
    // }
    // if (!repeatPassword.trim()) {
    //   alert("Powtórz hasło");
    //   return false;
    // }
    // if (password !== repeatPassword) {
    //   alert("Podane hasła są różne.");
    //   return false;
    // }
    return true;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        autoComplete="name"
        placeholder="imie"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.textInput}
        autoComplete="email"
        textContentType="emailAddress"
        autoCapitalize="none"
        placeholder="e-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.textInput}
        autoComplete="tel"
        keyboardType="phone-pad"
        placeholder="numer telefonu"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="hasło"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="currentPassword"
        placeholder="powtórz hasło"
        secureTextEntry
        value={repeatPassword}
        onChangeText={(text) => setRepeatPassword(text)}
      />

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          validateFields() && navigation.navigate("Message", { _title }); // domyślny ekran, parametry
          console.log(name);
          console.log(email);
          console.log(phone);
          console.log(password);
          console.log(repeatPassword);
        }}
      >
        <Text style={styles.buttonText}>Zarejestruj</Text>
      </TouchableHighlight>

      {/* <TextInput 
          style={styles.textInput}
          placeholder='email'
      />
      <TextInput 
          style={styles.textInput}
          placeholder='hasło'
      />

      <TouchableHighlight
          style={styles.button}
          onPress={() =>{
            navigation.navigate('MainNav', {screen: 'Home', _title}); // domyślny ekran, parametry
          }}
      >
          <Text style={styles.buttonText}>Zaloguj</Text>
      </TouchableHighlight>
      <StatusBar style="auto" /> */}
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
