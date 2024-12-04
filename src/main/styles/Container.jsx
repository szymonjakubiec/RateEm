import {SafeAreaView, StyleSheet} from "react-native";
import {useTheme} from "react-native-paper";



/**
 * Makes SafeAreaView Container for screens.
 * @param {any} children - Children structure wrapped in container (not passed as parameter).
 * @param {object} [style] - additional styles.
 * @returns {JSX.Element}
 */
export default function _Container({children, style}) {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: useTheme().colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: "17%",
      paddingTop: 0,
    },
  });

  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
}
