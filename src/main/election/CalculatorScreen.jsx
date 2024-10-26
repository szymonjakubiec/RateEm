import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  TextInput,
} from "react-native";
var dhondt = require("dhondt");
const plusIcon = require("../../../assets/plus_icon.png");
const deleteIcon = require("../../../assets/delete_icon.png");

export default function ElectionScreen() {
  const [parties, setParties] = useState([]);

  const [inputValues, setInputValues] = useState([]);
  const [outputValues, setOutputValues] = useState([]);

  const [sum, setSum] = useState(0);
  const [theRestValue, setTheRestValue] = useState("100");
  const [theRestMandatesValue, setTheRestMandatesValue] = useState(0);

  useEffect(() => {
    setParties([{}]);
  }, []);

  function addParty() {
    if (parties.length < 9 && sum < 100) {
      setParties((prevParties) => [...prevParties, 0]);
    }
    onPersentageChange();
  }

  function deleteParty(indexToDelete) {
    if (parties.length > 1) {
      setParties((parties) =>
        parties.filter((p, index) => index != indexToDelete)
      );
      setInputValues((inputValues) =>
        inputValues.filter((i, index) => index != indexToDelete)
      );
      inputValues[indexToDelete] = 0;
      outputValues[indexToDelete] = 0;
    }
    onPersentageChange();
  }

  function onPersentageChange() {
    var sumTemp = 0;
    for (var index = 0; index < inputValues.length; index++) {
      setTheRestValue("0");
      if (sumTemp < 100) {
        sumTemp += parseFloat(inputValues[index]);
        const shortage = 100 - sumTemp;
        if (shortage > 0) {
          setTheRestValue(shortage.toString());
        }
      }

      if (sumTemp >= 100) {
        const surplus = sumTemp - 100;
        inputValues[index] = (inputValues[index] - surplus).toString();
        sumTemp = sumTemp - surplus;
      }
    }

    setInputValues((prevInputValues) =>
      prevInputValues.map((value, index) => value)
    );
    setSum(sumTemp);

    calculateDhondtMandates();
  }

  function calculateDhondtMandates() {
    var votes = [];
    var sumTemp = 100;
    for (var index = 0; index < inputValues.length; index++) {
      votes[index] = parseFloat(inputValues[index]);
      sumTemp -= parseFloat(inputValues[index]);
    }
    votes[votes.length] = sumTemp;

    var mandates = 460;
    var results = dhondt.compute(votes, mandates);

    for (var index = 0; index < results.length - 1; index++) {
      outputValues[index] = results[index].toString();
    }
    setTheRestMandatesValue(results[results.length - 1].toString());
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>To jest kalkulator mandatónw.</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {parties.map((partyItem, index) => (
          <View key={index} style={styles.partyTile}>
            <Text style={styles.partyTileText}>Partia {index + 1}</Text>
            <TextInput
              style={styles.partyTileInput}
              value={inputValues[index]}
              onChangeText={(newValue) => {
                inputValues[index] = newValue;
                onPersentageChange();
              }}
              keyboardType="numeric"
              maxLength={5}
            />
            <Text style={styles.partyTileText}>%</Text>
            <TextInput
              style={styles.partyTileInput}
              readOnly={true}
              value={outputValues[index]}
            />
            <TouchableHighlight onPress={() => deleteParty(index)}>
              <Image source={deleteIcon} style={styles.deleteIcon} />
            </TouchableHighlight>
          </View>
        ))}
        <View style={styles.partyTile}>
          <Text style={styles.partyTileText}>Reszta </Text>
          <TextInput
            style={styles.partyTileInput}
            value={theRestValue}
            readOnly={true}
          />
          <Text style={styles.partyTileText}>%</Text>
          <TextInput
            style={styles.partyTileInput}
            value={theRestMandatesValue}
            readOnly={true}
          />
        </View>
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
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "4%",
  },

  scrollView: {
    width: "100%",
    height: "100%",
    marginHorizontal: 20,
  },

  partyTile: {
    backgroundColor: "#000",
    height: 80,
    width: "96%",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
    marginLeft: "2%",
    marginRight: "2%",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  partyTileText: {
    color: "white",
    fontSize: 25,
    fontWeight: "700",
  },
  partyTileInput: {
    color: "white",
    width: 60,
    marginLeft: 10,
    fontSize: 20,
    borderColor: "white",
    borderWidth: 1,
  },

  addPartyTile: {
    height: 80,
    width: "96%",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
    marginLeft: "2%",
    marginRight: "2%",
    borderColor: "black",
    borderWidth: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    color: "white",
    width: 60,
    height: 60,
  },
  deleteIcon: {
    color: "white",
    width: 50,
    height: 50,
    marginLeft: 10,
  },
});
