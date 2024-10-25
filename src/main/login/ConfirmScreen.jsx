import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

export default function ConfirmScreen({ navigation, route }) {
  // const route = useRoute();
  const phone = route.params?.phone;

  return (
    <View style={styles.container}>
      <Text style={styles.subTitle}>Potwierdź</Text>
      <Text style={styles.subTitle}>
        Na twój telefon {phone} został wysłany kod sms z kodem weryfikacyjnym.
        Wpisz go w oknie poniżej.
      </Text>

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