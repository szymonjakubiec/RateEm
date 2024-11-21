import { BackHandler, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";

export default function HomeScreen({ navigation }) {
  // Pk: Exiting app from HomeScreen
  useEffect(() => {
    const backAction = () => {
      if (navigation.getState().index === 2) {
        BackHandler.exitApp();
        return true;
      }
      navigation.goBack();

      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text>To jest strona główna.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 70,
  },
});
