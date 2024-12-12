import {StyleSheet, Text, StyleProp, ViewStyle, Animated} from "react-native";
import {useTheme} from "react-native-paper";
import {useEffect, useRef, useState} from "react";



/**
 * Creates an error text.
 * @param {string} text - text to display.
 * @param {StyleProp<ViewStyle>} [style] - additional text styles.
 * @returns {JSX.Element|null}
 */
export default function _ErrorText({text, style}) {
  const opacity = useRef(new Animated.Value(0)).current;
  // const height = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(!!text);

  useEffect(() => {
    if (text) {
      setVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start(() => {
        setVisible(false);
      });
    }
  }, [text]);

  const errorTextStyle = StyleSheet.create({
    fontSize: 14,
    color: useTheme().colors.error,
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginBottom: 6,
  });

  if (!visible) return null;

  return (
    <Animated.Text style={[errorTextStyle, {opacity}, style]}>{text}</Animated.Text>
  );
}
