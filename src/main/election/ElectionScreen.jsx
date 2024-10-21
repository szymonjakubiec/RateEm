import { StyleSheet, Text, View, Button, TouchableHighlight } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useRoute } from "@react-navigation/native";


export default function ElectionScreen({ navigation }){
    const route = useRoute();





    return(
        <View style={styles.container}>
                
            <TouchableHighlight
                style={styles.button} >
                <Text style={styles.buttonText}>Wytłumaczenie wyborów</Text>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.button} >
                <Text style={styles.buttonText}>Okręgi wyborcze</Text>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.button} >
                <Text style={styles.buttonText}>Komisje wyborcze</Text>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.button} 
                onPress={ () => { navigation.navigate('Calendar') } }
            >
                <Text style={styles.buttonText}>Kalendarz wyborczy</Text>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.button} 
                onPress={ () => { navigation.navigate('Calculator') } }
            >
                <Text style={styles.buttonText}>Kalkulator mandatów</Text>
            </TouchableHighlight>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
    
    button: {
        backgroundColor: '#000',
        height: 100,
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8,
        margin: 10,
        borderRadius: 20,
        justifyContent: 'center',
    },
      
    buttonText: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 25,
        fontWeight: '700',
    },
});