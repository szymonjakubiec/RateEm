import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { getAllUsers } from "../../backend/database/Users";

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

  const validateFields = async () => {
    if (!name) {
      alert("Podaj imię.");
      return false;
    }
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      alert("Podaj prawidłowy e-mail.");
      return false;
    }
    if (await emailExists(email)) {
      alert("Użytkownik o podanym adresie e-mail już istnieje.\nSpróbuj podać inny adres e-mail.");
      return false;
    }
    if (!phone || /* !/^(?:\+?\d{1,3}[-\s.]?)?(?:\(\d{1,3}\)|\d{1,3})[-\s.]?\d{1,9}$/ */ phone.length !== 9) {
      alert("Podaj prawidłowy polski numer telefonu.");
      return false;
    }
    if (await phoneExists(phone)) {
      alert("Użytkownik o podanym numerze telofonu już istnieje.\nSpróbuj podać inny numer telefonu.");
      return false;
    }
    if (!password) {
      alert("Podaj hasło.");
      return false;
    }
    if (password.length < 8 || !/^[a-zA-Z]/.test(password) || !/^[a-zA-Z0-9!#$._@-]+$/.test(password) || !/[!#$._@]/.test(password)) {
      alert(
        "Hasło powinno mieć minimum 8 znaków.\nPowinno zaczynać się od litery i zawierać conajmniej:\n*1 cyfrę\n*1 znak specjalny (-, _, ., #, !, $, @)."
      );
      return false;
    }
    if (!repeatPassword) {
      alert("Powtórz hasło");
      return false;
    }
    if (password !== repeatPassword) {
      alert("Podane hasła są różne.");
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aby zarejestrować nowe konto, wypełnij poniższe pola:</Text>

      <TextInput
        style={styles.textInput}
        autoComplete="name"
        placeholder="imię"
        value={name}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          setName(text.trim());
        }}
      />
      <TextInput
        style={styles.textInput}
        autoComplete="email"
        textContentType="emailAddress"
        autoCapitalize="none"
        placeholder="e-mail"
        value={email}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          setEmail(text.trim());
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ alignSelf: "center", left: 10, fontSize: 13, fontWeight: 300, position: "absolute" }}>+48 | </Text>
        <TextInput
          style={[styles.textInput, { paddingLeft: 42 }]}
          autoComplete="tel"
          keyboardType="phone-pad"
          placeholder="numer telefonu"
          value={phone}
          onChangeText={(text) => {
            text.slice(0, 3) === "+48" && (text = text.slice(3));
            text = text.trim().replace(/[^0-9]/g, "");
            if (text.length > 9) return;
            setPhone(text.trim());
          }}
        />
      </View>
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="hasło"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
          setPassword(text);
        }}
      />
      <TextInput
        style={[styles.textInput, { marginBottom: 40 }]}
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="currentPassword"
        placeholder="powtórz hasło"
        secureTextEntry
        value={repeatPassword}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          setRepeatPassword(text);
        }}
      />

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          validateFields().then((result) => {
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
    marginTop: 7,
    marginBottom: 7,
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
