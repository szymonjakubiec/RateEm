import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, TextInput } from "react-native";
const plusIcon = require('../../../assets/plus_icon.png');
const deleteIcon = require('../../../assets/delete_icon.png');

export default function ElectionScreen(){
    const [parties, setParties] = useState([]);
    const [partyNumber, setPartyNumber] = useState(1);
    const [inputValues, setInputValues] = useState([]);

    useEffect( () => {
        setParties([ {}, {}, {} ])
        setPartyNumber(partyNumber+1)
    }, []);

    function addParty() {
        setParties(prevParties => [...prevParties, {}])
        setPartyNumber(partyNumber+1)
    }

    function deleteParty(indexToDelete) {
        setParties(parties.filter((_, index) => index!==indexToDelete))
    }

    return(
        <View style={styles.container}>
            <View>
                <Text>To jest kalkulator mandatónw.</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {parties.map((partyItem, index) => (
                    <View key={index} style={styles.partyTile}>
                        <Text style={styles.partyTileText}>Partia {index+1}</Text>
                        <TextInput style={styles.partyTileInput} value={inputValues[index]}/>
                        <Text style={styles.partyTileText}>%</Text>
                        <TextInput style={styles.partyTileInput} readOnly={true} value={inputValues[index]}/>
                        <TouchableHighlight onPress={() => deleteParty(index)}>
                            <Image source={deleteIcon} style={styles.deleteIcon} />
                        </TouchableHighlight>
                    </View>
                ))}
                <TouchableHighlight style={styles.addPartyTile} onPress={addParty}>
                    <Image source={plusIcon} style={styles.plusIcon} />
                </TouchableHighlight>
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
        height: '100%',
        marginHorizontal: 20,
    },
    
    partyTile: {
        backgroundColor: '#000',
        height: 80,
        width: '96%',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 20,
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    partyTileText: {
        color: 'white',
        fontSize: 25,
        fontWeight: '700',
    },
    partyTileInput: {
        color: 'white',
        width: 60,
        marginLeft: 10,
        fontSize: 20,
        borderColor: 'white',
        borderWidth: 1,
    },
    
    addPartyTile: {
        height: 80,
        width: '96%',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 20,
        marginLeft: '2%',
        marginRight: '2%',
        borderColor: 'black',
        borderWidth: 5, 
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        color: 'white',
        width: 60,
        height: 60,
    },
    deleteIcon: {
        color: 'white',
        width: 50,
        height: 50,
        marginLeft: 10,
    },
});
