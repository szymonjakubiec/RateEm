import {useState} from "react";
import {StyleSheet, Text} from "react-native";
import isEmail from "validator/lib/isEmail";
import {TextInput} from "react-native-paper";
import {getAllUsers} from "../../../backend/database/Users";
import {useTextInputProps} from "../../styles/TextInput";
import _Container from "../../styles/Container";
import _Button from "../../styles/Button";
import _AnimViewKeyboard from "../../styles/AnimViewKeyboard";
import _ErrorText from "../../styles/ErrorText";



export default function RegisterScreen({navigation}) {
  //
  // ===== PROPERTIES ============================================================= //

  // Values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Password visibility
  const [passVisible, setPassVisible] = useState(true);
  const [repeatPassVisible, setRepeatPassVisible] = useState(true);

  // Validate values
  const [wrongName, setWrongName] = useState("");
  const [wrongEmail, setWrongEmail] = useState("");
  const [wrongPhone, setWrongPhone] = useState("");
  const [wrongPass, setWrongPass] = useState("");
  const [wrongPassRep, setWrongPassRep] = useState("");

  // ===== METHODS ================================================================ //
  const emailExists = async (email) => {
    const users = await getAllUsers();
    return users.some((user) => user.email === email);
  };

  const phoneExists = async (phone) => {
    const users = await getAllUsers();
    return users.some((user) => user.phone_number === phone);
  };

  const validateFieldsOnSubmit = async () => {
    if (
      password.length < 8 ||
      !/^[a-zA-Z]/.test(password) ||
      !/^[a-zA-Z0-9!#$._@-]+$/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!#$._@-]/.test(password)
    ) {
      setWrongPass(
        "Hasło powinno mieć minimum 8 znaków. Powinno zaczynać się od litery i zawierać conajmniej:\n*1 cyfrę\n*1 znak specjalny (-, _, ., #, !, $, @)."
      );
      return false;
    }
    if (await emailExists(email)) {
      setWrongEmail("Użytkownik o podanym adresie e-mail już istnieje. Spróbuj podać inny.");
      return false;
    }
    if (await phoneExists(phone)) {
      setWrongPhone("Użytkownik o podanym numerze telefonu już istnieje. Spróbuj podać inny.");
      return false;
    }
    return true;
  };

  const validateFieldsOnBlur = () => {
    return !(wrongName || !name || wrongEmail || !email || wrongPhone || !phone || wrongPass || !password || wrongPassRep || !repeatPassword);
  };

  const validateName = (name) => {
    if (!name) {
      setWrongName("Podaj imię.");
    } else {
      setWrongName("");
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      setWrongEmail("Podaj e-mail.");
    } else if (!isEmail(email)) {
      setWrongEmail("Podaj prawidłowy e-mail.");
    } else {
      setWrongEmail("");
    }
  };

  const validatePhone = (phone) => {
    if (!phone || phone.length !== 9 || !["45", "50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"].includes(phone.slice(0, 2))) {
      setWrongPhone("Podaj prawidłowy numer telefonu.");
    } else {
      setWrongPhone("");
    }
  };


  const validatePass = (pass) => {
    if (!pass) {
      setWrongPass("Podaj hasło.");
    } else {
      setWrongPass("");
    }
  };

  const validatePassRep = (pass) => {
    if (!pass) {
      setWrongPassRep("Powtórz hasło.");
    } else if (wrongPass) {
      setWrongPassRep("Popraw hasło.");
    } else if (pass !== password) {
      setWrongPassRep("Hasła są różne.");
    } else {
      setWrongPassRep("");
    }
  };

  return (
    <_AnimViewKeyboard margin={-40}>
      <_Container>
        <Text style={styles.title}>Aby zarejestrować nowe konto, wypełnij poniższe pola:</Text>

        <TextInput
          {...useTextInputProps(wrongName)}
          label="imię"
          maxLength={22}
          autoComplete="name"
          value={name}
          onChangeText={(text) => {
            text = text.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, '');
            text.length > 0 && (text = text[0].toUpperCase() + text.slice(1).toLowerCase());
            setName(text);
            validateName(text);
          }}
          onBlur={() => {
            validateName(name);
          }}
        />
        <_ErrorText text={wrongName}/>

        <TextInput
          {...useTextInputProps(wrongEmail)}
          label="e-mail"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            if (text.includes(" ")) return;
            text = text.replace(/[^a-zA-Z0-9._%+@-]/g, "");
            setEmail(text);
            validateEmail(text);
          }}
        />
        <_ErrorText text={wrongEmail}/>


        <TextInput
          {...useTextInputProps(wrongPhone)}
          label="numer telefonu"
          maxLength={12}
          left={<TextInput.Affix text="+48 |" textStyle={{marginRight: -10}}/>}
          autoComplete="tel"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            text.slice(0, 3) === "+48" && (text = text.slice(3));
            text = text.replace(/[^0-9]/g, "");
            if (text.length > 9) return;
            setPhone(text);
            validatePhone(text);
          }}
        />
        <_ErrorText text={wrongPhone}/>


        <TextInput
          {...useTextInputProps(wrongPass)}
          label="hasło"
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          secureTextEntry={passVisible}
          right={<TextInput.Icon
            icon={passVisible ? "eye" : "eye-off"}
            onPress={() => setPassVisible(!passVisible)}
            forceTextInputFocus={false}/>
          }
          value={password}
          onChangeText={(text) => {
            text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
            repeatPassword && setRepeatPassword('');
            setPassword(text);
            validatePass(text);
          }}
        />
        <_ErrorText text={wrongPass}/>

        <TextInput
          {...useTextInputProps(wrongPassRep)}
          label="powtórz hasło"
          returnKeyType="done"
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="currentPassword"
          secureTextEntry={repeatPassVisible}
          right={<TextInput.Icon
            icon={repeatPassVisible ? "eye" : "eye-off"}
            onPress={() => setRepeatPassVisible(!repeatPassVisible)}
            forceTextInputFocus={false}/>
          }
          value={repeatPassword}
          onChangeText={(text) => {
            text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
            setRepeatPassword(text);
            validatePassRep(text);
          }}
        />
        <_ErrorText text={wrongPassRep}/>

        {/* PK: Register button */}
        <_Button
          buttonText="Zarejestruj"
          onPress={() => {
            validateFieldsOnSubmit().then((result) => {
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
          disabled={!validateFieldsOnBlur()}
          style={{marginTop: 30}}/>

      </_Container>
    </_AnimViewKeyboard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 40,
  },
  wrongInputText: (wrongName, wrongEmail, wrongPhone, wrongPass, wrongPassRep) => ({
    display: wrongName || wrongEmail || wrongPhone || wrongPass || wrongPassRep ? "flex" : "none",
    fontSize: 14,
    color: "#e41c1c",
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginBottom: 6,
  }),
  button: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
