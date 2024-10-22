import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from "react-native";
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
        
        for(let year = currentYear+5; year >= 2010; year--) {
            years.push(
                <View>
                    <View style={styles.yearDiv}>
                        <Text style={styles.yearTileText}>{year}</Text>
                        {data.sejm.map((oneYear) => {
                            if (year == new Date(oneYear.data).getFullYear()) {
                                return (<View key={oneYear.nazwa} style={styles.circleSejm}/>)
                            }
                        })}
                        {data.prezydent.map((oneYear) => {
                            if (year == new Date(oneYear.data).getFullYear()) {
                                return (<View key={oneYear.nazwa} style={styles.circlePrezydent}/>)
                            }
                        })}
                        {data.eu.map((oneYear) => {
                            if (year == new Date(oneYear.data).getFullYear()) {
                                return (<View key={oneYear.nazwa} style={styles.circleEu}/>)
                            }
                        })}
                    </View>
                    
                </View>
            )
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
            <View style={{width: '100%', paddingBottom: 10, borderBottomWidth: 3}}>
                <View style={styles.colorsMeaningDiv}>
                    <View style={styles.circleSejm}/>
                    <Text style={styles.colorsMeaningText} >Sejm</Text>
                </View>
                <View style={styles.colorsMeaningDiv}>
                    <View style={styles.circlePrezydent}/>
                    <Text style={styles.colorsMeaningText} >Prezydent</Text>
                </View>
                <View style={styles.colorsMeaningDiv}>
                    <View style={styles.circleEu}/>
                    <Text style={styles.colorsMeaningText} >Parlament Europejski</Text>
                </View>
            </View>
            <ScrollView style={styles.scrollView}>
                {years.map((yearItem, index) => (
                    <View key={index} style={styles.yearItemContainer}>
                        <TouchableHighlight
                            style={styles.yearTile} 
                            onPress={ () => { console.log(yearItem) } }
                            >
                            {yearItem}
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

    colorsMeaningDiv: {
        alignSelf: 'left',
        flexDirection: 'row',
    },
    colorsMeaningText: {
        color: 'black',
        fontSize: 25,
        fontWeight: '700',
        marginLeft: 10
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

    yearDiv: {
        alignSelf: 'center',
        flexDirection: 'row',
    },
      
    yearTileText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: '700',
    },

    circleSejm: {
        width: 20,
        height: 20,
        borderRadius: 20,
        marginLeft: 10,
        marginVertical: 7,
        backgroundColor: '#12cdd4',
    },
    circlePrezydent: {
        width: 20,
        height: 20,
        borderRadius: 20,
        marginLeft: 10,
        marginVertical: 7,
        backgroundColor: '#f24726',
    },
    circleEu: {
        width: 20,
        height: 20,
        borderRadius: 20,
        marginLeft: 10,
        marginVertical: 7,
        backgroundColor: '#8fd14f',
    }
});