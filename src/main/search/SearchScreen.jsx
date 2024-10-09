import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";

export default function SearchScreen({ navigation }){
    return(
        <View style={styles.container}>
            <Text>To jest wyszukiwarka.</Text>
            <TouchableHighlight
                style={styles.button}
                onPress={() => {navigation.navigate('Profile')}}
            >
                <Text style={styles.searchText}>Wyszukaj polityka</Text>
            </TouchableHighlight>
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
    button: {
        backgroundColor: '#000',
        paddingTop: 8,
        paddingBottom: 8,
        width: '70%',
        borderRadius: 20,
    },
    searchText: {
        color: '#fff',
        textAlign: 'center',
    },
});