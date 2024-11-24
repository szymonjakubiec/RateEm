import {useRoute} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import {useEffect, useRef, useState} from "react";
import CheckBox from "react-native-check-box";
import {getAllUsers} from "../../backend/database/Users";



export default function LoggingScreen({navigation}) {
  const _title = "Rate'Em";
  // const route = useRoute();

  // connection test
  useEffect(() => {
    (async () => {
      console.info("E-mail: " + (await getAllUsers())[1]?.email);
    })();
  }, []);

  const [userData, setUserData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(true);

  /**
   * Feedback values that appear when the user writes incorrect input
   */
  const [wrongEmailInfo, setWrongEmailInfo] = useState("");
  const [wrongPasswordInfo, setWrongPasswordInfo] = useState("");

  /**
   * Variable preventing the wrongPasswordInfo from writing feedback right after opening the app. Check out the useEffect for more details.
   */
  const firstCheck = useRef(true);

  /**
   * Checks if the email format is correct returning the bool value. Also gives feedback to the wrongEmailInfo if the email format is wrong.
   * @param {string} email
   * @returns {boolean}
   */
  function emailApproved(email) {
    const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regexMail.test(email)) {
      setWrongEmailInfo("");
      return true;
    } else {
      setWrongEmailInfo("Podany email jest nieprawidłowy");
      return false;
    }
  }

  /**
   * Iterates through users in userData checking if email and password are correct.
   */
  async function checkCredentials() {
    for (const user of userData) {
      if (user.email === email) {
        if (user.password === password) {
          setWrongPasswordInfo("");
          this.textInput.clear();
          await navigation.navigate("MainNav", {screen: "Home", _title}); // domyślny ekran, parametry
          return true;
        } else {
          setWrongPasswordInfo("Nieprawidłowe hasło");
          setPassword("");
          this.textInput.clear();
          return false;
        }
      }
    }

    setWrongEmailInfo("Podany email nie istnieje");
    return;
  }

  /**
   * Navigates to the main screen.
   * @async
   */
  async function navigateToProfileScreen() {
    await navigation.navigate("MainNav", {
      screen: "Home",
      params: {
        _title: _title,
      },
    }); // default screen, parameters
  }

  /**
   * Calls the checkCredentials() function. If the credentials are correct then user navigates to the main screen.
   */
  function handleLogin() {
    if (checkCredentials()) {
      navigateToProfileScreen();
    }
  }

  /**
   * Asynchronously gets userData from getUsers() and sets it which triggers the useEffect hook with handleLogin() function.
   * @async
   */
  async function setCredentials() {
    const data = await getAllUsers();
    setUserData(data);
  }

  /**
   * Checks the credentials with the first onPress event.
   */
  useEffect(() => {
    if (!firstCheck.current) {
      handleLogin();
    } else {
      firstCheck.current = false;
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{_title}</Text>
      <Text style={styles.subTitle}>Twój polityczny niezbędnik</Text>

      <TextInput
        style={styles.textInput}
        autoComplete="email"
        autoCapitalize="none"
        placeholder="e-mail"
        onChangeText={(email) => setEmail(email.trim())}
        onBlur={() => emailApproved(email)}
      />
      <Text style={styles.wrongInputText}>{wrongEmailInfo}</Text>
      <TextInput
        style={styles.textInput}
        autoComplete="current-password"
        autoCapitalize="none"
        placeholder="hasło"
        secureTextEntry
        onChangeText={(email) => setPassword(email.trim())}
        ref={(input) => {
          this.textInput = input;
        }}
      />
      <Text style={styles.wrongInputText}>{wrongPasswordInfo}</Text>

      <TouchableHighlight
        style={styles.buttonMain}
        onPress={() => handleLogin()}
      >
        <Text style={styles.buttonText}>Zaloguj</Text>
      </TouchableHighlight>

      <View style={{marginTop: 20}}>
        <TouchableOpacity
          // disabled
          style={{
            marginLeft: 10,
          }}
          onPress={() => {
            navigation.navigate("ResetNav", {_title}); // domyślny ekran, parametry
          }}
        >
          <Text
            style={{
              color: "blue",
              // color: "#232323",
              // opacity: 0.5,
            }}
          >
            Zapomniałeś hasła?
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{flexDirection: "row", alignItems: "center", marginTop: 20}}
      >
        <Text style={{ /* marginTop: 15, marginBottom: 5, */ fontSize: 13}}>
          Nie masz jeszcze konta?
        </Text>

        <TouchableOpacity
          style={{
            marginLeft: 10,
          }}
          onPress={() => {
            navigation.navigate("RegisterNav", {_title}); // domyślny ekran, parametry
          }}
        >
          <Text
            style={{
              color: "blue",
            }}
          >
            Zarejestruj
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light"/>
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
  },
  wrongInputText: {
    fontSize: 12,
    color: "red",
    marginBottom: 15,
    alignSelf: "flex-start",
    paddingLeft: 20,
  },
  buttonMain: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
  },
  button: {
    backgroundColor: "#4a4a4a",
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
