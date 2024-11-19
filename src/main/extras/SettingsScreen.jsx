import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView, BackHandler,
} from "react-native";
import {getAllUsers, updateUser} from "../../backend/database/Users";
import {goBack} from "../../backend/CommonMethods";



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
      setUser(users);
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
    <View style={styles.container}>
      {user && (
        <>
          <TextInput
            style={styles.input}
            placeholder={`${user[0].email}`}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder={`${user[0].phone_number}`}
            value={phone}
            onChangeText={setPhone}
          />
        </>
      )}

      <Text>Zmień hasło:</Text>
      <TextInput
        style={styles.input}
        placeholder="Aktualne hasło"
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nowe hasło"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Powtórz nowe hasło"
        secureTextEntry={true}
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />

      <KeyboardAvoidingView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Zapisz</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
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
