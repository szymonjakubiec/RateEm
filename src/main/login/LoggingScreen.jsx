import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View} from "react-native";
import isEmail from "validator/lib/isEmail";
import {useEffect, useRef, useState} from "react";
import {getAllUsers} from "../../backend/database/Users";
import {TextInput} from "react-native-paper";
import {useTextInputProps} from "../styles/TextInput";
import {useIsFocused} from "@react-navigation/native";
import _Container from "../styles/Container";
import _Button from "../styles/Button";
import _AnimViewKeyboard from "../styles/AnimViewKeyboard";



export default function LoggingScreen({navigation}) {
  const _title = "Rate'Em";

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {

      // PK: So every time screen is focused it updates
      if (!isFocused) return;

      await setCredentials();

      // connection test
      const rootUser = (await getAllUsers())[0];
      console.group(rootUser?.name + " :");
      console.log("E-mail :" + rootUser?.email);
      console.log("Phone  :" + rootUser?.phone_number);
      console.log("Pass   :" + rootUser?.password);
      console.groupEnd();
    })();
  }, [isFocused]);

  const [userData, setUserData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passHidden, setPassHidden] = useState(true);

  // const [userId, setUserId] = useState(-1);
  const userIdRef = useRef();
  /**
   * Feedback values that appear when the user writes incorrect input
   */
  const [wrongEmailInfo, setWrongEmailInfo] = useState("");
  const [wrongPasswordInfo, setWrongPasswordInfo] = useState("");


  /**
   * Checks if the email format is correct returning the bool value. Also gives feedback to the wrongEmailInfo if the email format is wrong.
   * @param {string} email
   * @returns {boolean}
   */
  function validateEmail(email) {
    if (isEmail(email) || email === "x") {
      setWrongEmailInfo("");
      return true;
    } else {
      setWrongEmailInfo("Podany email jest nieprawidłowy");
      return false;
    }
  }

  function validatePass(pass) {
    if (!pass) {
      setWrongPasswordInfo("Podaj hasło.");
    } else {
      setWrongPasswordInfo("");
    }
  }

  /**
   * Iterates through users in userData checking if email and password are correct.
   */
  function checkCredentials() {

    for (const user of userData) {

      // Current user's email is not the same as given email
      if (user.email !== email) {
        continue;
      }

      // Password is correct for given email
      if (user.password === password) {
        setWrongPasswordInfo("");
        setPassword("");
        setPassHidden(true);
        userIdRef.current = user.id;
        return true;
      }

      // Password is incorrect for given email
      setWrongPasswordInfo("Nieprawidłowe hasło");
      setPassword("");
      return false;
    }

    // Email doesn't exist in database
    setWrongEmailInfo("Podany email nie istnieje");
    return false;
  }

  /**
   * Navigates to the main screen.
   */
  function navigateToMain() {
    let userId = userIdRef.current;
    navigation.navigate("MainNav", {
      // screen: "Home", // not required because of initialRouteName in MainNav
      _title: _title,
      userId: userId
    });
  }

  /**
   * Calls the checkCredentials() function. If the credentials are correct then user navigates to the main screen.
   */
  function handleLogin() {
    if (checkCredentials()) {
      navigateToMain();
    }
  }

  /**
   * Asynchronously gets userData from getUsers() and sets it which triggers the useEffect hook with handleLogin() function.
   * @async
   */
  async function setCredentials() {
    const data = await getAllUsers();
    // console.log(data.map(user => {
    //   return {email: user.email, password: user.password};
    // }));
    setUserData(data);
  }

  return (
    <_AnimViewKeyboard>
      <_Container>
        <Text style={styles.title}>{_title}</Text>
        <Text style={styles.subTitle}>Twój polityczny niezbędnik</Text>

        {/* PK: Mail input */}
        <TextInput
          {...useTextInputProps()}
          label="e-mail"
          outlineColor={wrongEmailInfo ? "#e41c1c" : "black"}
          activeOutlineColor={wrongEmailInfo ? "#e41c1c" : "black"}
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            text = text.replace(/[^a-zA-Z0-9._%+@-]/g, "");
            setEmail(text.trim());
            validateEmail(text.trim());
          }}
          onBlur={() => validateEmail(email)}
        />
        <_ErrorText text={wrongEmailInfo}/>

        {/* PK: Password input */}
        <TextInput
          {...useTextInputProps()}
          label="hasło"
          outlineColor={wrongPasswordInfo ? "#e41c1c" : "black"}
          activeOutlineColor={wrongPasswordInfo ? "#e41c1c" : "black"}
          returnKeyType="done"
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="currentPassword"
          secureTextEntry={passHidden}
          right={<TextInput.Icon
            icon={passHidden ? "eye" : "eye-off"}
            onPress={() => setPassHidden(!passHidden)}
            forceTextInputFocus={false}/>}
          value={password}
          onChangeText={(text) => {
            if (text.includes(" ")) return;
            setPassword(text.trim());
            validatePass(text.trim());
          }}
        />
        <_ErrorText text={wrongPasswordInfo}/>

        {/* PK: Login button */}
        <_Button buttonText="Zaloguj" onPress={() => handleLogin()} style={{marginTop: wrongPasswordInfo ? 18 : 40}}/>

        {/* PK: Password reset button */}
        <_Button buttonText="Zapomniałeś hasła?" onPress={() => navigation.navigate("ResetNav", {_title})}
                 mode="onlyText" style={{marginTop: 20}}/>

        {/* PK: Register button */}
        <View
          style={{flexDirection: "row", alignItems: "center", marginTop: 30}}
        >
          <Text style={{fontSize: 14}}>
            Nie masz jeszcze konta?
          </Text>

          <_Button buttonText="Zarejestruj" onPress={() => navigation.navigate("RegisterNav", {_title})}
                   mode="onlyText" style={{marginLeft: 5}}/>

        </View>

        <StatusBar style="light"/>
      </_Container>
    </_AnimViewKeyboard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 50,
  },
  wrongInputText: (wrongEmail, wrongPass) => ({
    display: wrongEmail || wrongPass ? "flex" : "none",
    fontSize: 14,
    color: "#e41c1c",
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginBottom: 6,
  }),
  buttonMain: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
    elevation: 5,
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
