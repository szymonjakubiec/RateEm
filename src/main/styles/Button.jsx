import {StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle, View} from 'react-native';
import {Icon, useTheme} from "react-native-paper";



/**
 * Creates a button.
 * @param {string} text - text for button.
 * @param {function()} onPress - what happens on press.
 * @param {StyleProp<TextStyle>} [textStyle] - additional text styles.
 * @param {'standard'|'text'|'tile'} [mode='standard'] - button's mode.
 * @param {StyleProp<ViewStyle>} [style] - additional button styles.
 * @param {object} [iconLeft] - icon to display on the left of text.
 * @param {string} iconLeft.icon - icon to display on the left of text.
 * @param {number} [iconLeft.size=24] - size of icon.
 * @param {string} [iconLeft.color="white"] - color of icon.
 * @param {StyleProp<ViewStyle>} [iconLeft.style={paddingRight: "5%", marginLeft: "-10%"}] - additional style of icon.
 * @param {object} [iconRight] - icon to display on the right of text.
 * @param {string} iconRight.icon - icon to display on the right of text.
 * @param {number} [iconRight.size=24] - size of icon.
 * @param {string} [iconRight.color="white"] - color of icon.
 * @param {StyleProp<ViewStyle>} [iconRight.style={paddingLeft: "5%", marginRight: "-10%"}] - additional style of icon.
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

  const theme = useTheme(),
    styles = StyleSheet.create({
      button: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.inversePrimary,
        paddingVertical: mode === "tile" ? 16 : 8,
        paddingHorizontal: 25,
        marginVertical: mode === "tile" ? 5 : 0,
        minWidth: "65%",
        width: mode === "tile" ? "100%" : "auto",
        justifyContent: "center",

        borderRadius: 20,
        borderWidth: 2,
        elevation: 5,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      disabled: {
        opacity: disabled ? 0.6 : 1,
      },
      buttonText: {
        alignSelf: "center",
        textAlign: "center",
        color: theme.colors.onPrimary,
        fontWeight: "600",
        fontSize: mode === "tile" ? 18 : 16,
        textShadowColor: '#00000066',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
      },
      onlyText: {
        fontSize: 14,
        fontWeight: "500",
        color: theme.colors.primary,
        textShadowRadius: 10,
        textShadowColor: theme.colors.inversePrimary,
      }
    });

  /** @type {StyleProp<ViewStyle>} */
  const iconLeftDefaultStyle = {
    paddingRight: "5%",
    marginLeft: "-10%",
    marginVertical: "-10%",
  };

  /** @type {{color: (string|string), size: (number|number), icon: string, style: StyleProp<ViewStyle>}} */
  iconLeft = {
    icon: "",
    color: "",
    size: 26,
    style: {},
    ...iconLeft
  };

  /** @type {StyleProp<ViewStyle>} */
  const iconRightDefaultStyle = {
    paddingLeft: "5%",
    marginRight: "-10%",
    marginVertical: "-10%",
  };

  /** @type {{color: (string|string), size: (number|number), icon: string, style: StyleProp<ViewStyle>}} */
  iconRight = {
    icon: "",
    color: "",
    size: 26,
    style: {},
    ...iconRight
  };

  /**
   * Finds a color in a style.
   * @param {{}} style - style to search color in.
   * @returns {string|null}
   */
  function findColor(style) {
    if (Array.isArray(style))
      return style.find(obj => obj && obj.color)?.color || null;

    return style?.color || null;
  }

  return (
    mode === "standard" || mode === "tile" ?
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        style={[styles.button, styles.disabled, style]}
        onPress={onPress}
        {...props}>
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          {iconLeft.icon ? (
            <View style={[iconLeftDefaultStyle, iconLeft.style]}>
              <Icon
                color={iconLeft.color || findColor(textStyle) || theme.colors.onPrimary}
                size={iconLeft.size} source={iconLeft.icon}
              />
            </View>
          ) : null}
          <Text
            numberOfLines={multiline ? 0 : 1}
            adjustsFontSizeToFit={!multiline}
            style={[styles.buttonText, textStyle, multiline && {textAlign: "left"}]}
          >
            {text}
          </Text>
          {iconRight.icon ? (
            <View style={[iconRightDefaultStyle, iconRight.style]}>
              <Icon
                color={iconRight.color || findColor(textStyle) || theme.colors.onPrimary}
                size={iconRight.size} source={iconRight.icon}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
      : mode === "text" ?
        <TouchableOpacity
          activeOpacity={0.4}
          disabled={disabled}
          style={[styles.disabled, style]}
          onPress={onPress}
          {...props}
        >
          <Text style={[styles.buttonText, styles.onlyText, textStyle]}> {text} </Text>
        </TouchableOpacity>
        : <Text style={{color: "red"}}>Invalid button mode!</Text>
  );

}



