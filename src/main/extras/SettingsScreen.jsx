import React, {useState, useEffect, useContext, useRef} from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform, findNodeHandle, UIManager, Keyboard, Animated, Alert,
} from "react-native";
import {getAllUsers, updateUser} from "../../backend/database/Users";
import {ownGoBack, tabBarAnim} from "../../backend/CommonMethods";
import {ActivityIndicator, Snackbar, TextInput, useTheme} from "react-native-paper";
import {useTextInputProps} from "../styles/TextInput";
import {GlobalContext} from "../nav/GlobalContext";
import _Container from "../styles/Container";
import _Button from "../styles/Button";
import _ErrorText from "../styles/ErrorText";
import isEmail from "validator/lib/isEmail";
import {useIsFocused} from "@react-navigation/native";



export default function SettingsScreen({navigation, route}) {

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  // // PK: Going back
  // ownGoBack(navigation);

  // PK: Change e-mail if going back from ConfirmScreen
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused || !route?.params?.updatedEmail) return;
    console.log(`Zmieniono email na ${route.params.updatedEmail}`);
    global.userEmail = route.params.updatedEmail;

    setSnackbarVisible(true);
    setSnackbarText("E-mail został zmieniony :)");
    setEmail('');
  }, [isFocused]);

  // ===== PROPERTIES =============================================================================================== //

  const [user, setUser] = useState(null);
  const {userId} = useContext(GlobalContext);

  const [emailPhoneTitle, setEmailPhoneTitle] = useState('Zmień e-mail lub numer telefonu:');
  const [email, setEmail] = useState('');
  const [wrongEmail, setWrongEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wrongPhone, setWrongPhone] = useState('');

  const [curPass, setCurPass] = useState('');
  const [wrongCurPass, setWrongCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [wrongNewPass, setWrongNewPass] = useState('');
  const [repNewPass, setRepNewPass] = useState('');
  const [wrongRepNewPass, setWrongRepNewPass] = useState('');

  // Password visibility
  const [curPassVisible, setCurPassVisible] = useState(true);
  const [newPassVisible, setNewPassVisible] = useState(true);
  const [repNewPassVisible, setRepNewPassVisible] = useState(true);

  const [buttonActive, setButtonActive] = useState(false);

  const [emailDisabled, setEmailDisabled] = useState(false);
  const [phoneDisabled, setPhoneDisabled] = useState(false);
  const [bottomFieldsDisabled, setBottomFieldsDisabled] = useState(false);

  // ===== VALIDATION =============================================================================================== //
  const emailExists = async (email) => {
    const users = await getAllUsers();
    return users.some((user) => user.email === email);
  };

  const phoneExists = async (phone) => {
    const users = await getAllUsers();
    return users.some((user) => user.phone_number === phone);
  };

  const validateEmail = async (email) => {
    if (!email) {
      setWrongEmail("");
    } else if (email === user.email) {
      setWrongEmail("Podaj inny e-mail.");
    } else if (!isEmail(email)) {
      setWrongEmail("Podaj prawidłowy e-mail.");
    } else if (await emailExists(email)) {
      setWrongEmail("Podany e-mail już istnieje.");
    } else {
      setWrongEmail("");
    }
  };

  const validatePhone = async (phone) => {
    if (!phone) {
      setWrongPhone("");
    } else if (phone === user.phone_number) {
      setWrongPhone("Podaj inny numer telefonu.");
    } else if (phone.length < 9 || !["45", "50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"].includes(phone.slice(0, 2))) {
      setWrongPhone("Podaj prawidłowy numer telefonu.");
    } else if (await phoneExists(phone)) {
      setWrongPhone("Podany numer telefonu już istnieje.");
    } else {
      setWrongPhone("");
    }
  };

  const validateCurPass = (pass) => {
    if (!pass) {
      setWrongCurPass("");
    } else if (pass !== user.password) {
      setWrongCurPass("Błędne hasło.");
    } else {
      setWrongCurPass("");
    }
  };

  const validateNewPass = (pass) => {
    if (!pass) {
      setWrongNewPass("");
    } else if (pass.length < 8) {
      setWrongNewPass("Hasło musi mieć conajmniej 8 znaków.");
    } else {
      setWrongNewPass("");
    }
  };

  const validateRepNewPass = (pass) => {
    if (!pass) {
      setWrongRepNewPass("");
    } else if (pass !== newPass) {
      setWrongRepNewPass("Hasła są różne.");
    } else {
      setWrongRepNewPass("");
    }
  };


  // PK: Validate email
  useEffect(() => {
    if (email && !wrongEmail) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }

    if (email) {
      setEmailPhoneTitle("Zmień e-mail:");
      setPhoneDisabled(true);
      setBottomFieldsDisabled(true);
    } else {
      setEmailPhoneTitle("Zmień e-mail lub numer telefonu:");
      setPhoneDisabled(false);
      setBottomFieldsDisabled(false);
    }

  }, [email, wrongEmail]);

  // PK: Validate phone
  useEffect(() => {
    if (phone && !wrongPhone) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }

    if (phone) {
      setEmailPhoneTitle("Zmień numer telefonu:");
      setEmailDisabled(true);
      setBottomFieldsDisabled(true);
    } else {
      setEmailPhoneTitle("Zmień e-mail lub numer telefonu:");
      setEmailDisabled(false);
      setBottomFieldsDisabled(false);
    }

  }, [phone, wrongPhone]);

  // PK: Validate bottom fields
  useEffect(() => {
    if (curPass && !wrongCurPass && newPass && !wrongNewPass && repNewPass && !wrongRepNewPass) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }

    if (curPass || newPass || repNewPass) {
      setEmailDisabled(true);
      setPhoneDisabled(true);
    } else {
      setEmailDisabled(false);
      setPhoneDisabled(false);
    }
  }, [curPass, wrongCurPass, newPass, wrongNewPass, repNewPass, wrongRepNewPass]);

  // const validateFields = () => {
  //   return !(wrongEmail || wrongPhone || wrongCurPass || wrongNewPass || wrongRepNewPass);
  // };

  const validateFieldsOnSubmit = () => {
    if (
      newPass &&
      (newPass.length < 8 ||
        !/^[a-zA-Z]/.test(newPass) ||
        !/^[a-zA-Z0-9!#$._@-]+$/.test(newPass) ||
        !/[0-9]/.test(newPass) ||
        !/[!#$._@-]/.test(newPass)
      )
    ) {
      setWrongNewPass(
        "Hasło powinno zaczynać się od litery\ni zawierać conajmniej:\n*1 cyfrę\n*1 znak specjalny (-, _, ., #, !, $, @)."
      );
      return false;
    }
    return true;
  };


  // PK: Setting user data
  useEffect(() => {
    if (!isFocused) return;

    (async () => {
      const users = await getAllUsers();
      setUser(users.find((user) => user.id === userId));
    })();
  }, [isFocused]);

  const emailInputProps = useTextInputProps(wrongEmail);
  const phoneInputProps = useTextInputProps(wrongPhone);

  // PK: Scrolling methods when TextInputs get focus
  const scrollRef = useRef(null);
  const scrollToTop = () => {
    scrollRef.current.scrollTo({y: 0});
  };
  const scrollToBottom = () => {
    scrollRef.current.scrollTo({y: 120});
  };

  // PK: Button animation
  const buttonBottom = useRef(new Animated.Value(160)).current;
  const animateButton = (height) => {
    Animated.timing(buttonBottom, {
      toValue: height,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        animateButton(10);
      }
    );
    const hideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        animateButton(140);
      }
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);


  // PK: SnackBar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');


  return (
    <_Container style={{padding: 0, paddingBottom: "15%"}}>

      {/* PK: If loading */}
      <ActivityIndicator
        animating={!user} size="large"
        style={{zIndex: 1, position: 'absolute', top: "7%"}}
        color={useTheme().colors.primary}/>

      <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="always" ref={scrollRef}>
        <_Container>
          <Text
            style={[styles.subSection, {opacity: emailDisabled && phoneDisabled ? 0.4 : 1}]}>{emailPhoneTitle}</Text>
          {user ? (
            <>
              <TextInput
                {...emailInputProps}
                placeholder={user.email}
                label="e-mail"
                autoComplete="email"
                textContentType="emailAddress"
                autoCapitalize="none"
                value={email}
                disabled={emailDisabled}
                onChangeText={async (text) => {
                  if (text.includes(" ")) return;
                  text = text.replace(/[^a-zA-Z0-9._%+@-]/g, "");
                  setEmail(text);
                  await validateEmail(text);
                }}
                onFocus={scrollToTop}
              />
              <_ErrorText text={wrongEmail}/>

              <TextInput
                {...phoneInputProps}
                label="numer telefonu"
                placeholder={user.phone_number}
                maxLength={12}
                left={<TextInput.Affix text="+48 |" textStyle={{marginRight: -10}}/>}
                autoComplete="tel"
                keyboardType="phone-pad"
                value={phone}
                disabled={phoneDisabled}
                onChangeText={async (text) => {
                  text.slice(0, 3) === "+48" && (text = text.slice(3));
                  text = text.replace(/[^0-9]/g, "");
                  if (text.length > 9) return;
                  setPhone(text);
                  await validatePhone(text);
                }}
                onFocus={scrollToTop}
              />
              <_ErrorText text={wrongPhone}/>
            </>
          ) : (
            <>
              <TextInput
                {...phoneInputProps}
                disabled
                outlineStyle={{display: "none"}}
                value="Ładowanie..."
              />
              <TextInput
                {...emailInputProps}
                disabled
                outlineStyle={{display: "none"}}
                value="Ładowanie..."
              />
            </>
          )}

          <Text style={[styles.subSection, {opacity: bottomFieldsDisabled ? 0.4 : 1}]}>Zmień hasło:</Text>
          <TextInput
            {...useTextInputProps(wrongCurPass)}
            label="aktualne hasło"
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="currentPassword"
            disabled={bottomFieldsDisabled}
            secureTextEntry={curPassVisible}
            right={<TextInput.Icon
              icon={curPassVisible ? "eye" : "eye-off"}
              onPress={() => setCurPassVisible(!curPassVisible)}
              forceTextInputFocus={false}/>
            }
            value={curPass}
            onChangeText={(text) => {
              text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
              setCurPass(text);
              validateCurPass(text);
            }}
            onFocus={() => {
              setTimeout(() => {
                scrollToBottom();
              }, 200);
            }}
          />
          <_ErrorText text={wrongCurPass}/>

          <TextInput
            {...useTextInputProps(wrongNewPass)}
            label="nowe hasło"
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            disabled={bottomFieldsDisabled}
            secureTextEntry={newPassVisible}
            right={<TextInput.Icon
              icon={newPassVisible ? "eye" : "eye-off"}
              onPress={() => setNewPassVisible(!newPassVisible)}
              forceTextInputFocus={false}/>
            }
            value={newPass}
            onChangeText={(text) => {
              text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
              repNewPass && setRepNewPass('');
              setNewPass(text);
              validateNewPass(text);
            }}
            onFocus={() => {
              setTimeout(() => {
                scrollToBottom();
              }, 200);
            }}
          />
          <_ErrorText text={wrongNewPass}/>

          <TextInput
            {...useTextInputProps(wrongRepNewPass)}
            label="powtórz nowe hasło"
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="currentPassword"
            disabled={bottomFieldsDisabled}
            secureTextEntry={repNewPassVisible}
            right={<TextInput.Icon
              icon={repNewPassVisible ? "eye" : "eye-off"}
              onPress={() => setRepNewPassVisible(!repNewPassVisible)}
              forceTextInputFocus={false}/>
            }
            value={repNewPass}
            onChangeText={(text) => {
              text = text.replace(/[^a-zA-Z0-9!#$@._-]/g, "");
              setRepNewPass(text);
              validateRepNewPass(text);
            }}
            onFocus={() => {
              setTimeout(() => {
                scrollToBottom();
              }, 500);
            }}
          />
          <_ErrorText text={wrongRepNewPass}/>

        </_Container>
      </ScrollView>
      <Animated.View style={{position: "absolute", alignSelf: "center", bottom: buttonBottom}}>
        <_Button
          style={{minWidth: "35%"}}
          text="Zapisz"
          disabled={!buttonActive}
          onPress={async () => {

            if (!validateFieldsOnSubmit()) {
              setNewPass("");
              Keyboard.dismiss();
              return;
            }

            if (!emailDisabled) {
              // PK: Email change
              navigation.navigate("Confirm", {
                name: user.name,
                email,
                phone: user.phone,
                password: user.password,
                userId,
              });
            } else if (!phoneDisabled) {
              // PK: Phone change
              try {
                const updatedUser = await updateUser(userId, {phone_number: phone});
                if (updatedUser) {
                  setSnackbarVisible(true);
                  setSnackbarText("Numer telefonu został zmieniony :)");
                  setUser(updatedUser);
                } else {
                  setSnackbarVisible(true);
                  setSnackbarText("Nie udało się zmienić numeru telefonu :(");
                }
                setPhone('');
                Keyboard.dismiss();
              } catch (ev) {
                console.error(ev.message);
              }
            } else {
              // PK: Password change
              try {
                const updatedUser = await updateUser(userId, {password: newPass});
                if (updatedUser) {
                  setSnackbarVisible(true);
                  setSnackbarText("Hasło zostało zmienione :)");
                  setUser(updatedUser);

                } else {
                  setSnackbarVisible(true);
                  setSnackbarText("Nie udało się zmienić hasła :(");
                }
                setCurPass('');
                setNewPass('');
                setRepNewPass('');
                Keyboard.dismiss();
              } catch (ev) {
                console.error(ev.message);
              }
            }

          }}/>
      </Animated.View>

      <Snackbar
        visible={snackbarVisible}
        // style={{minHeight: "20%", bottom: 30}}
        onTouchMove={() => setSnackbarVisible(false)}
        onDismiss={() => setSnackbarVisible(false)}
        onTouchEnd={() => setSnackbarVisible(false)}
        action={{
          label: 'Ok',
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}>
        {snackbarText}
      </Snackbar>
    </_Container>
  );
}

const styles = StyleSheet.create({
  subSection: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    paddingLeft: "6%",
    minWidth: "100%",
  },
});
