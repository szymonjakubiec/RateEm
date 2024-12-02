import {useState} from "react";
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import isEmail from "validator/lib/isEmail";
import {TextInput} from "react-native-paper";
import {getAllUsers} from "../../../backend/database/Users";
import {textInputProps} from "../../styles/TextInput";
import _Container from "../../styles/Container";



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
    <_Container>
      <Text style={styles.title}>Aby zarejestrować nowe konto, wypełnij poniższe pola:</Text>

      <TextInput
        {...textInputProps}
        label="imię"
        outlineColor={wrongName ? "#e41c1c" : "black"}
        activeOutlineColor={wrongName ? "#e41c1c" : "black"}
        maxLength={22}
        autoComplete="name"
        value={name}
        onChangeText={(text) => {
          // if (text.includes(" ")) return;
          text = text.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "");
          text.length > 0 && (text = text[0].toUpperCase() + text.slice(1).toLowerCase());
          setName(text.trim());
          validateName(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          validateName(name);
        }}
      />
      <Text style={styles.wrongInputText(wrongName)}>{wrongName}</Text>

      <TextInput
        {...textInputProps}
        label="e-mail"
        outlineColor={wrongEmail ? "#e41c1c" : "black"}
        activeOutlineColor={wrongEmail ? "#e41c1c" : "black"}
        autoComplete="email"
        textContentType="emailAddress"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          text = text.replace(/[^a-zA-Z0-9._%+@-]/g, "");
          setEmail(text.trim());
          validateEmail(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          // console.log("BLUR");
        }}
      />
      <Text style={styles.wrongInputText(wrongEmail)}>{wrongEmail}</Text>

      <View style={{flexDirection: "row", justifyContent: "center"}}>
        <TextInput
          {...textInputProps}
          label="numer telefonu"
          outlineColor={wrongPhone ? "#e41c1c" : "black"}
          activeOutlineColor={wrongPhone ? "#e41c1c" : "black"}
          maxLength={12}
          style={[textInputProps.style, {paddingLeft: 31}]}
          // left={ <TextInput.Affix textStyle={ {fontSize: 16, marginLeft: 4} } text="+48 |"/> }
          autoComplete="tel"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            text.slice(0, 3) === "+48" && (text = text.slice(3));
            text = text.trim().replace(/[^0-9]/g, "");
            if (text.length > 9) return;
            setPhone(text.trim());
            validatePhone(text.trim());
            validateFieldsOnBlur();
          }}
          onBlur={() => {
            // validatePhoneOut(phone);
          }}
        />
        <Text style={{
          alignSelf: "center",
          left: 9,
          fontSize: 16,
          fontWeight: 300,
          position: "absolute",
          paddingTop: 8
        }}>+48 | </Text>
      </View>
      <Text style={styles.wrongInputText(wrongPhone)}>{wrongPhone}</Text>

      <TextInput
        {...textInputProps}
        label="hasło"
        outlineColor={wrongPass ? "#e41c1c" : "black"}
        activeOutlineColor={wrongPass ? "#e41c1c" : "black"}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        secureTextEntry={passVisible}
        right={<TextInput.Icon icon={passVisible ? "eye" : "eye-off"}
                               onPress={() => setPassVisible(!passVisible)}/>
        }
        value={password}
        onChangeText={(text) => {
          text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
          repeatPassword && setRepeatPassword('');
          setPassword(text.trim());
          validatePass(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          // validatePassOut(password);
        }}
      />
      <Text style={styles.wrongInputText(wrongPass)}>{wrongPass}</Text>

      <TextInput
        {...textInputProps}
        label="powtórz hasło"
        outlineColor={wrongPassRep ? "#e41c1c" : "black"}
        activeOutlineColor={wrongPassRep ? "#e41c1c" : "black"}
        returnKeyType="done"
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="currentPassword"
        secureTextEntry={repeatPassVisible}
        right={<TextInput.Icon icon={repeatPassVisible ? "eye" : "eye-off"}
                               onPress={() => setRepeatPassVisible(!repeatPassVisible)}/>
        }
        value={repeatPassword}
        onChangeText={(text) => {
          if (text.includes(" ")) return;
          setRepeatPassword(text.trim());
          validatePassRep(text.trim());
          validateFieldsOnBlur();
        }}
        onBlur={() => {
          // validatePassRep(repeatPassword.trim());
        }}
      />
      <Text style={styles.wrongInputText(wrongPassRep)}>{wrongPassRep}</Text>

      <TouchableHighlight
        style={[styles.button, {marginTop: 40}, !validateFieldsOnBlur() && {opacity: 0.5}]}
        disabled={!validateFieldsOnBlur()}
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
      >
        <Text style={styles.buttonText}>Zarejestruj</Text>
      </TouchableHighlight>
    </_Container>
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
