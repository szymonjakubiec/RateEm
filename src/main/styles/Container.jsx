import {SafeAreaView, StyleSheet, StyleProp, ViewStyle} from "react-native";
import {useTheme} from "react-native-paper";



/**
 * Makes SafeAreaView Container for screens.
 * @param {any} children - Children structure wrapped in container (not passed as parameter).
 * @param {StyleProp<ViewStyle>} [style] - additional styles.
 * @returns {JSX.Element}
 */
export default function _Container({children, style}) {

  const containerStyle = StyleSheet.create({
    flex: 1,
    backgroundColor: useTheme().colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: "17%",
    paddingTop: 0,
  });

  return (
    <SafeAreaView style={[containerStyle, style]}>{children}</SafeAreaView>
  );
}
