import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, TouchableHighlight } from "react-native";
import axios from 'axios';

export default function ElectionScreen(){

    const [years, setYears] = useState([]);

    useEffect( () => {
        currentYear = new Date().getFullYear()
        
        showYears()
    }, []);

    async function showYears() {
        var years = []

        const data = await getWybory()

        const futureWyborySejm = new Date(data.sejm[0].data)
        const futureWyboryPrezydent = new Date(data.prezydent[0].data)
        const futureWyboryEu = new Date(data.eu[0].data)
        
        for(let year = currentYear; year < currentYear+11; year++) {
            let wyboryThisYear = ''
            if (futureWyborySejm.getFullYear() == year) {
                wyboryThisYear += ', sejm'
            }
            if (futureWyboryPrezydent.getFullYear() == year) {
                wyboryThisYear += ', prezydent'
            }
            if (futureWyboryEu.getFullYear() == year) {
                wyboryThisYear += ', eu'
            }

            years.push( year + wyboryThisYear )
        }

        setYears(years)
    }

    async function getWybory() {
        try{
            const sejm = (await axios.get('http://10.0.2.2:3000/wyborysejm')).data;
            const prezydent = (await axios.get('http://10.0.2.2:3000/wyboryprezydent')).data;
            const eu = (await axios.get('http://10.0.2.2:3000/wyboryeu')).data;
            return {sejm, prezydent, eu}
        } catch(error) {
            console.log(error);
        };
    }

    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
            {years.map((yearItem, index) => (
                <View key={index} style={styles.yearItemContainer}>
                    <TouchableHighlight
                        style={styles.yearTile} 
                        onPress={ () => { console.log(yearItem) } }
                        >
                        <Text style={styles.yearTileText}>{yearItem}</Text>
                    </TouchableHighlight>
                </View>
            ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: "4%",
    },

    scrollView: {
        width: '100%',
        marginHorizontal: 20,
    },
    
    yearTile: {
        backgroundColor: '#000',
        height: 70,
        width: '96%',
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 20,
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius: 20,
        justifyContent: 'center',
    },
      
    yearTileText: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 25,
        fontWeight: '700',
    },
});