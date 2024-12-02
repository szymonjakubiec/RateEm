import React, {useState, useEffect} from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import {getAllUsers, updateUser} from "../../backend/database/Users";
import {goBack} from "../../backend/CommonMethods";
import {TextInput} from "react-native-paper";
import {textInputProps} from "../styles/TextInput";
import _Container from "../styles/Container";



export default function SettingsScreen({navigation}) {

  // Pk: Going back
  goBack(navigation);

  const [user, setUser] = useState(null);
  const [CommunicationRadio, setCommunicationRadio] = useState(null);
  const [LoginRadio, setLoginRadio] = useState(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");


  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUser(users); //todo faktyczny użytkownik
      setLoginRadio(users[0].login_method);
      setCommunicationRadio(users[0].communication_method);
    };

    fetchUsers();
  }, []);

  const handleSave = async () => {
    await updateUser("1", {
      communication_method: "" + CommunicationRadio,
      login_method: "" + LoginRadio,
    });
  };

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
        <TouchableOpacity style={styles.button} onPress={handleSave}>
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
