import {StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from "react-native-paper";



/**
 * Creates a button.
 * @param {string} buttonText - text for button.
 * @param {function()} onPress - what happens on press.
 * @param {StyleProp<ViewStyle>} [textStyle] - additional text styles.
 * @param {'standard'|'onlyText'} [mode='standard'] - button's mode.
 * @param {StyleProp<ViewStyle>} [style] - additional button styles.
 * @param {boolean} [disabled='false'] - if button is disabled.
 * @param [props]
 * @returns {JSX.Element}
 */
export default function _Button({
                                  buttonText,
                                  onPress,
                                  textStyle,
                                  mode = "standard",
                                  style,
                                  disabled = false,
                                  ...props
                                }) {

  const styles = StyleSheet.create({
    button: {
      backgroundColor: useTheme().colors.primary,
      borderColor: useTheme().colors.inversePrimary,
      paddingVertical: 8,
      paddingHorizontal: 25,
      minWidth: "65%",
      borderRadius: 20,
      elevation: 5,
      shadowColor: useTheme().colors.primary,
      shadowOffset: {width: 2, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      borderWidth: 2,
      justifyContent: "center",
    },
    disabled: {
      opacity: disabled ? 0.6 : 1,
    },
    buttonText: {
      alignSelf: "center",
      textAlign: "center",
      color: useTheme().colors.onPrimary,
      fontWeight: "600",
      fontSize: 16,
      textShadowColor: '#00000066',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 4
    },
    onlyText: {
      fontSize: 14,
      fontWeight: "400",
      color: "blue",
      textShadowColor: '#0000ff22',
    }
  });

  return (
    mode === "standard" ?
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        style={[styles.button, styles.disabled, style]}
        onPress={onPress}
        {...props}>
        <Text style={[styles.buttonText, textStyle]}> {buttonText} </Text>
      </TouchableOpacity>
      : mode === "onlyText" ?
        <TouchableOpacity
          activeOpacity={0.4}
          disabled={disabled}
          style={[styles.disabled, style]}
          onPress={onPress}
          {...props}>
          <Text style={[styles.buttonText, styles.onlyText, textStyle]}> {buttonText} </Text>
        </TouchableOpacity>
        : <Text style={{color: "red"}}>Invalid button mode!</Text>
  );

}



