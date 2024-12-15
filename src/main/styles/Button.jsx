import {StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle, View} from 'react-native';
import {Icon, useTheme} from "react-native-paper";



/**
 * Creates a button.
 * @param {string} text - text for button.
 * @param {function()} onPress - what happens on press.
 * @param {StyleProp<TextStyle>} [textStyle] - additional text styles.
 * @param {'standard'|'onlyText'|'tile'} [mode='standard'] - button's mode.
 * @param {StyleProp<ViewStyle>} [style] - additional button styles.
 * @param {object} [iconLeft] - icon to display on the left of text.
 * @param {string} iconLeft.icon - icon to display on the left of text.
 * @param {number} [iconLeft.size=24] - size of icon.
 * @param {string} [iconLeft.color="white"] - color of icon.
 * @param {object} [iconRight] - icon to display on the right of text.
 * @param {string} iconRight.icon - icon to display on the right of text.
 * @param {number} [iconRight.size=24] - size of icon.
 * @param {string} [iconRight.color="white"] - color of icon.
 * @param {boolean} [multiline=false] - if text should be on multiple lines.
 * @param {boolean} [disabled='false'] - if button is disabled.
 * @param [props]
 * @returns {JSX.Element}
 */
export default function _Button({
                                  text,
                                  onPress,
                                  textStyle,
                                  mode = "standard",
                                  style,
                                  iconLeft,
                                  iconRight,
                                  multiline = false,
                                  disabled = false,
                                  ...props
                                }) {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: useTheme().colors.primary,
      borderColor: useTheme().colors.inversePrimary,
      paddingVertical: mode === "tile" ? 16 : 8,
      paddingHorizontal: 25,
      marginVertical: mode === "tile" ? 5 : 0,
      minWidth: "65%",
      width: mode === "tile" ? "100%" : "auto",
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
      fontSize: mode === "tile" ? 18 : 16,
      textShadowColor: '#00000066',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 4,
    },
    onlyText: {
      fontSize: 14,
      fontWeight: "400",
      color: "blue",
      textShadowColor: '#0000ff22',
    }
  });

  iconLeft = {
    icon: "",
    color: useTheme().colors.onPrimary,
    size: 26,
    ...iconLeft
  };

  iconRight = {
    icon: "",
    color: useTheme().colors.onPrimary,
    size: 26,
    ...iconRight
  };


  return (
    mode === "standard" || mode === "tile" ?
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        style={[styles.button, styles.disabled, style, iconLeft.icon !== "" && {paddingLeft: "6%"}]}
        onPress={onPress}
        {...props}>
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          {iconLeft.icon ? (
            <Icon color={iconLeft.color} size={iconLeft.size} source={iconLeft.icon}/>
          ) : null}
          <Text numberOfLines={multiline ? 0 : 1} adjustsFontSizeToFit={!multiline}
                style={[styles.buttonText, textStyle, iconLeft.icon !== "" && {paddingLeft: "5%"},
                  iconRight.icon !== "" && {paddingRight: "5%"}, multiline && {textAlign: "left"}]}>{text}</Text>
          {iconRight.icon ? (
            <Icon color={iconRight.color} size={iconRight.size} source={iconRight.icon}/>
          ) : null}
        </View>
      </TouchableOpacity>
      : mode === "onlyText" ?
        <TouchableOpacity
          activeOpacity={0.4}
          disabled={disabled}
          style={[styles.disabled, style]}
          onPress={onPress}
          {...props}>
          <Text style={[styles.buttonText, styles.onlyText, textStyle]}> {text} </Text>
        </TouchableOpacity>
        : <Text style={{color: "red"}}>Invalid button mode!</Text>
  );

}



