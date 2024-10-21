import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from 'react'; // Upewnij się, że useState jest importowane

export default function SearchScreen({ navigation }) {
    const [searchResults, setSearchResults] = useState([]);

    // Funkcja wyszukiwania
    const searchPolitician = async () => {
        try {
            const response = await fetch('http://192.168.137.1:3000/api/dane'); // Upewnij się, że adres URL jest poprawny
            const data = await response.json();
            // Przefiltruj wyniki (zmień 'nazwa' na odpowiednie pole w danych)
            const filteredResults = data.filter(item => item.nazwa.includes('polityk')); // Przykład filtracji
            setSearchResults(filteredResults); // Zaktualizuj stan wyników
            
            // Przekaż wyniki do ekranu Profile
            navigation.navigate('Profile', { results: filteredResults });
        } catch (error) {
            console.error('Błąd podczas wyszukiwania:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>To jest wyszukiwarka.</Text>
            <TouchableHighlight
                style={styles.button}
                onPress={searchPolitician} // Wywołaj funkcję wyszukiwania
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