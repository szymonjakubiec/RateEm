import React, {useState, useEffect, useContext} from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import {getAllUsers, updateUser} from "../../backend/database/Users";
import {ownGoBack, tabBarAnim} from "../../backend/CommonMethods";
import {TextInput} from "react-native-paper";
import {textInputProps} from "../styles/TextInput";
import {GlobalContext} from "../nav/GlobalContext";
import _Container from "../styles/Container";



export default function SettingsScreen({navigation}) {

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  // // Pk: Going back
  // goBack(navigation);

  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const {userId} = useContext(GlobalContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUser(users.filter(function (item) {
        return item.id === userId;
      }));
    };

    fetchUsers();
  }, []);


  return (
    <_Container>
      <Text style={styles.subSection}>Zmień e-mail lub numer telefonu:</Text>
      {user ? (
        <>
          <TextInput
            {...textInputProps}
            label={`${user[0].email}`}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            {...textInputProps}
            label={`${user[0].phone_number}`}
            value={phone}
            onChangeText={setPhone}
          />
        </>
      ) : (
        <>
          <TextInput
            {...textInputProps}
            value="Ładowanie"
          />
          <TextInput
            {...textInputProps}
            value="Ładowanie"
          />
        </>
      )
      }

      <Text style={styles.subSection}>Zmień hasło:</Text>
      <TextInput
        {...textInputProps}
        label="Aktualne hasło"
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        {...textInputProps}
        label="Nowe hasło"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        {...textInputProps}
        label="Powtórz nowe hasło"
        secureTextEntry={true}
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />


      <KeyboardAvoidingView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Zapisz</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </_Container>
  );
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  radio: {
    padding: 10,
    color: "#000",
  },
  selectedRadio: {
    padding: 10,
    color: "#fff",
    backgroundColor: "blue",
    borderRadius: 5,
  },
  subSection: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    paddingLeft: 6,
  },
  buttonContainer: {
    zIndex: 1,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    width: "auto",
    paddingHorizontal: 20,
  },
});
