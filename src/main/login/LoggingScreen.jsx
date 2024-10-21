import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';



export default function LoggingScreen({ navigation }) {
  
  const _title = "Rate'Em";
  // const route = useRoute();
  
  const [userData, setUserData] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Feedback values that appear when the user writes incorrect input
   */
  const [wrongEmailInfo, setWrongEmailInfo] = useState('');
  const [wrongPasswordInfo, setWrongPasswordInfo] = useState('');

  /**
   * Variable preventing the wrongPasswordInfo from writing feedback right after opening the app. Check out the useEffect for more details.
   */
  const firstCheck = useRef(true);



   /**
   * Gets the information of all users and passes it to the userData.
   *  @returns userData
   */
   async function getUsers(){
    try{
      const data = (await axios.get('http://10.0.2.2:3000/uzytkownicy')).data;
      return data;
    }
    catch(error) {
      console.log(error);
        if (error.response){
          console.log('RESPONSE ERROR');
          console.log(error.response.headers);
        }
        else if (error.request){
          console.log('REQUEST ERROR');
          console.log(error.request);
          console.log(error.message);
        }
        else{
          console.log('sth else');
          console.log(error.config);
          console.log(error)
        }
    };
  };


  /**
   * Checks if the email format is correct returning the bool value. Also gives feedback to the wrongEmailInfo if the email format is wrong.
   * @param {string} email 
   * @returns {boolean}
   */
  function emailApproved(email) {
    const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regexMail.test(email)){
      setWrongEmailInfo('');
      return true;
    }
    else{
      setWrongEmailInfo('Podany email jest nieprawidłowy');
      return false;
    };
  };

  /**
   * Iterates asynchronously through users in userData checking if email and password are correct. If they are then user navigates to the main screen.
   */
  async function checkCredentials(){
    for (const user of userData) {
      if (user.email == email){
        if (user.haslo == password){
          setWrongPasswordInfo('');
          this.textInput.clear();
          await navigation.navigate('MainNav', {screen: 'Home', _title}); // domyślny ekran, parametry
          return;
        }
        else {
          setWrongPasswordInfo('Nieprawidłowe hasło');
          setPassword('');
          this.textInput.clear();
          return;
        }
      };
    };
    
    setWrongEmailInfo("Podany email nie istnieje");
    return;
  };

  /**
   * Gets userData from getUsers() and sets it which triggers the useEffect hook with checkCredentials() function.
   */
  async function handleLogin(){
    const data = await getUsers();
    setUserData(data);
  };

  /** 
   * Checks the credentials with the first onPress event.
   */
  useEffect(()=>{
    if(!firstCheck.current){
      checkCredentials();
    }
    else{
      firstCheck.current = false;
    }

  },[userData]);

  return(
    <View style={styles.container}>
      <Text style={styles.title}>{_title}</Text>
        <Text style={styles.subTitle}>Twój polityczny niezbędnik</Text>

        <TextInput 
            style={styles.textInput}
            placeholder='email'
            onChangeText={(email) => setEmail(email.trim())}
            onBlur={() => emailApproved(email)}
        />
        <Text style={styles.wrongInputText}>{wrongEmailInfo}</Text>
        <TextInput 
            style={styles.textInput}
            placeholder='hasło'
            onChangeText={(email) => setPassword(email.trim())}
            ref={input => {this.textInput = input}}
        />
        <Text style={styles.wrongInputText}>{wrongPasswordInfo}</Text>

        <TouchableHighlight
            style={styles.button}
            onPress={() => handleLogin() }
        >
            <Text style={styles.buttonText}>Zaloguj</Text>
        </TouchableHighlight>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
      borderColor: '#000',
      borderStyle: 'solid',
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 20,
      paddingRight: 20,
      width: '90%',
    },
    wrongInputText:{
      fontSize: 12,
      color: "red",
      marginBottom: 15,
      alignSelf: "flex-start",
      paddingLeft: 20,
    },
    button: {
      backgroundColor: '#000',
      paddingTop: 8,
      paddingBottom: 8,
      width: '70%',
      borderRadius: 20,
    },
    buttonText: {
      alignSelf: 'center',
      color: '#fff',
      fontWeight: '700',
    },
  });