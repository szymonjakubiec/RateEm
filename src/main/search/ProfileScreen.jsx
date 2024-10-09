import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";

export default function ProfileScreen(){
    return(
        <View style={styles.container}>
            <Text>To jest profil wybranego polityka.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 70,
    },
});