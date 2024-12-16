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
import _ErrorText from "../styles/ErrorText";



export default function LoggingScreen({navigation}) {
  const _title = "Rate'Em";

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {

      // PK: So every time screen is focused it updates
      if (!isFocused) return;

      setAllUsers(await getAllUsers());

      // PK: Load e-mail after logging out (so that if e-mail was changed it will show here)
      global.userEmail && setEmail(global.userEmail);

      // connection test
      const rootUser = (await getAllUsers())[0];
      console.group(rootUser?.name + " :");
      console.log("E-mail :" + rootUser?.email);
      console.log("Phone  :" + rootUser?.phone_number);
      console.log("Pass   :" + rootUser?.password);
      console.groupEnd();
    })();
  }, [isFocused]);

  const [allUsers, setAllUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passHidden, setPassHidden] = useState(true);

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
   * Iterates through users in allUsers checking if email and password are correct.
   */
  function checkCredentials() {

    for (const user of allUsers) {

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
    global.userEmail = email;
    setEmail('');
    setWrongEmailInfo('');

    navigation.navigate("MainNav", {
      _title,
      userId: userIdRef.current
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

  return (
    <_AnimViewKeyboard>
      <_Container style={{paddingTop: 20}}>
        <Text style={styles.title}>{_title}</Text>
        <Text style={styles.subTitle}>Twój polityczny niezbędnik</Text>

        {/* PK: Mail input */}
        <TextInput
          {...useTextInputProps(wrongEmailInfo)}
          label="e-mail"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            text = text.replace(/[^a-zA-Z0-9._%+@-]/g, "");
            setEmail(text);
            validateEmail(text);
          }}
        />
        <_ErrorText text={wrongEmailInfo}/>

        {/* PK: Password input */}
        <TextInput
          {...useTextInputProps(wrongPasswordInfo)}
          label="hasło"
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
            text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
            setPassword(text);
            validatePass(text);
          }}
        />
        <_ErrorText text={wrongPasswordInfo}/>

        {/* PK: Login button */}
        <_Button text="Zaloguj" onPress={() => handleLogin()} style={{marginTop: 25}}/>

        {/* PK: Password reset button */}
        <_Button text="Zapomniałeś hasła?"
                 onPress={() => {
                   setEmail('');
                   setWrongEmailInfo('');
                   setPassword('');
                   setWrongPasswordInfo('');
                   navigation.navigate("ResetNav", {_title});
                 }}
                 mode="onlyText" style={{marginTop: 20}}/>

        {/* PK: Register button */}
        <View
          style={{flexDirection: "row", alignItems: "center", marginTop: 30}}
        >
          <Text style={{fontSize: 14}}>
            Nie masz jeszcze konta?
          </Text>

          <_Button text="Zarejestruj" onPress={() => {
            setEmail('');
            setWrongEmailInfo('');
            setPassword('');
            setWrongPasswordInfo('');
            navigation.navigate("RegisterNav", {_title});
          }}
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
});
