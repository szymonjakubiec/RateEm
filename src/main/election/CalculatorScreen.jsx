import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, TextInput } from "react-native";
import CheckBox from "react-native-check-box";

var dhondt = require("dhondt");
const plusIcon = require("../../../assets/plus_icon.png");
const deleteIcon = require("../../../assets/delete_icon.png");

export default function CalculatorScreen({ navigation }) {
  const [parties, setParties] = useState([]);

  const [inputValues, setInputValues] = useState([]);
  const [outputValues, setOutputValues] = useState([]);
  const [overThreshold, setOverThreshold] = useState([]);

  const [sum, setSum] = useState(0);
  const [theRestValue, setTheRestValue] = useState("100");
  const [theRestMandatesValue, setTheRestMandatesValue] = useState(0);

  useEffect(() => {
    setParties([{}]);
    navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent().setOptions({ tabBarStyle: { height: 65, borderTopLeftRadius: 10, borderTopRightRadius: 10 } });
    };
  }, []);

  function addParty() {
    if (parties.length < 9 && sum < 100) {
      setParties((prevParties) => [...prevParties, 0]);
    }
    onPersentageChange();
  }

  function deleteParty(indexToDelete) {
    if (parties.length > 1) {
      setParties((parties) => parties.filter((p, index) => index != indexToDelete));
      setInputValues((inputValues) => inputValues.filter((i, index) => index != indexToDelete));
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
          setTheRestValue(shortage.toFixed(2).toString());
        }
      }

      if (sumTemp >= 100) {
        const surplus = sumTemp - 100;
        inputValues[index] = (inputValues[index] - surplus).toString();
        sumTemp = sumTemp - surplus;
      }
    }

    setInputValues((prevInputValues) => prevInputValues.map((value, index) => value));
    setSum(sumTemp);

    calculateDhondtMandates();
  }

  function calculateDhondtMandates() {
    var votes = [];
    var sumTemp = 100;

    for (var index = 0; index < inputValues.length; index++) {
      if (!overThreshold[index]) {
        votes[index] = parseFloat(inputValues[index]) * 100000;
        sumTemp -= parseFloat(inputValues[index]);
      } else {
        votes[index] = 0;
      }
    }
    votes[votes.length] = sumTemp * 10000;

    var mandates = 460;
    var results = dhondt.compute(votes, mandates);

    for (var index = 0; index < results.length - 1; index++) {
      if (!overThreshold[index]) {
        outputValues[index] = results[index].toFixed(0).toString();
      } else {
        outputValues[index] = "0";
      }
    }

    setTheRestMandatesValue(results[results.length - 1].toFixed(0).toString());
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {parties.map((partyItem, index) => (
          <View key={index} style={styles.partyTile}>
            <View>
              <View style={styles.viweHorizontal}>
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
                <TextInput style={styles.partyTileOutput} readOnly={true} value={outputValues[index]} />
              </View>
              <View style={styles.viweHorizontal}>
                <CheckBox
                  style={styles.thresholdCheckbox}
                  checkBoxColor="white"
                  onClick={() => {
                    overThreshold[index] = !overThreshold[index];
                    // console.log(index, overThreshold[index]);
                    onPersentageChange();
                  }}
                  isChecked={overThreshold[index]}
                />
                <Text style={styles.partyTileSubText}>nie przekroczono prógu wyborczego</Text>
              </View>
            </View>
            <TouchableHighlight onPress={() => deleteParty(index)}>
              <Image source={deleteIcon} style={styles.deleteIcon} />
            </TouchableHighlight>
          </View>
        ))}
        <View style={styles.partyTileRest}>
          <Text style={styles.partyTileText}>Reszta </Text>
          <TextInput style={styles.partyTileInput} value={theRestValue} readOnly={true} />
          <Text style={styles.partyTileText}>%</Text>
          <TextInput style={styles.partyTileOutput} value={theRestMandatesValue} readOnly={true} />
        </View>
        <TouchableHighlight style={styles.addPartyTile} onPress={addParty}>
          <Image source={plusIcon} style={styles.plusIcon} />
        </TouchableHighlight>

        <View style={styles.calculatorDescDiv}>
          <Text style={styles.calculatorDescTitle}>Uwaga</Text>
          <Text style={styles.calculatorDescText}>Dane wyliczone przez kalkulator są tylko szacunkiem. Nie należy się do nich przywiązywać.</Text>
          <Text style={styles.calculatorDescText}>
            Zalecamy uzupełnić dane w taki sposób, aby "Inni" mieli jak najmniej % głosów. W przeciwnym wypadku dostaną oni nieproporcjonalnie dużo
            mandatów. Wynika to z algorytmu liczenia głosów.
          </Text>
          <Text style={styles.calculatorDescText}>
            <Text>Kalkulator szacuje liczbę mandatów przy pomocy metody </Text>
            <Text
              style={[styles.calculatorDescText, styles.textLink]}
              onPress={() => {
                navigation.navigate("DhondtExplanation");
              }}
            >
              d'Hondta
            </Text>
            <Text>, nieuwzględniającej okręgów wyborczych.</Text>
          </Text>
        </View>
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

  viweHorizontal: {
    flexDirection: "row",
  },

  partyTile: {
    backgroundColor: "#000",
    height: 100,
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
  partyTileRest: {
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
  partyTileSubText: {
    color: "white",
    fontSize: 15,
    fontWeight: "300",
    marginTop: 10,
  },
  partyTileInput: {
    color: "white",
    width: 60,
    marginLeft: 10,
    fontSize: 20,
    borderColor: "white",
    borderWidth: 1,
  },
  partyTileOutput: {
    color: "white",
    width: 60,
    marginLeft: 10,
    fontSize: 20,
    borderColor: "gray",
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
    width: 60,
    height: 60,
  },
  deleteIcon: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  thresholdCheckbox: {
    marginTop: 10,
    color: "white",
  },

  calculatorDescDiv: {
    marginTop: 50,
  },
  calculatorDescTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  calculatorDescSubtitle: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "400",
  },
  calculatorDescText: {
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 10,
  },

  textLink: {
    color: "#009982",
  },
});
