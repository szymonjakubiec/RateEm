import { StyleSheet, Text, View, Button, TouchableHighlight } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useRoute } from "@react-navigation/native";

export default function ElectionScreen(){
    return(
        <View style={styles.container}>
            <Text>To jest kalkulator mandatów.</Text>
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