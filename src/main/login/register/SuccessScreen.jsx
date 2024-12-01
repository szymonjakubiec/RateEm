import {StyleSheet, Text, TouchableHighlight, View} from "react-native";



export default function SuccessScreen({navigation, route}) {


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sukces!</Text>
      <Text style={styles.subTitle}>Konto zostało założone.</Text>

      <TouchableHighlight
        style={styles.button}

        // PK: Goes to logging screen with clearing the navigation stack
        onPress={() => {
          navigation.navigate("MainNav", {
            screen: "ExtrasNav",
            params: {
              screen: "Guide",
              options: {
                animationEnabled: true,
              },
            },
          });

        }}
      >
        <Text style={styles.buttonText}>Powrót do menu</Text>
      </TouchableHighlight>

    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 70,
  },
  title: {
    fontSize: 24,
    alignSelf: "flex-start",
    left: 20,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 50,
    alignSelf: "flex-start",
    left: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingTop: 8,
    paddingBottom: 8,
    width: "70%",
    borderRadius: 20,
  },
  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontWeight: "700",
  },
});
