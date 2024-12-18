import {useState, useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CheckBox from "react-native-check-box";
import _Container from "../styles/Container";
import {tabBarAnim} from "../../backend/CommonMethods";
import {useTheme, TextInput, Icon} from "react-native-paper";
import {useTextInputProps} from "../styles/TextInput";



export default function CalculatorScreen({navigation}) {
  const [parties, setParties] = useState([]);

  const [inputValues, setInputValues] = useState([]);
  const [outputValues, setOutputValues] = useState([]);
  const [overThreshold, setOverThreshold] = useState([]);

  const [sum, setSum] = useState(0);
  const [theRestValue, setTheRestValue] = useState("100");
  const [theRestMandatesValue, setTheRestMandatesValue] = useState("460");


  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  useEffect(() => {
    setParties([{}]);
  }, []);

  // adds new party to the calculations
  function addParty() {
    if (parties.length < 9 && sum < 100) {
      setParties((prevParties) => [...prevParties, 0]);
    }
    onPercentageChange();
    onPercentageChange();
  }

  // deletes party from further calculations
  function deleteParty(indexToDelete) {
    if (parties.length > 1) {
      setParties((parties) => parties.filter((i, index) => index !== indexToDelete));
      setInputValues((inputValues) => inputValues.filter((i, index) => index !== indexToDelete));
      setOutputValues((outputValues) => outputValues.filter((i, index) => index !== indexToDelete));
      inputValues[indexToDelete] = 0;
      outputValues[indexToDelete] = 0;
    }
    onPercentageChange();
    onPercentageChange();
  }

  // called whenever user changes something in the inputBoxes
  function onPercentageChange() {
    let sumTemp = 0;
    for (let index = 0; index < inputValues.length; index++) {
      inputValues[index] = inputValues[index].replace(",", ".");

      inputValues[index] = inputValues[index].replace(/[^0-9.]/g, '');

      // makes sure that empty percentage input is considered like as 0
      if (inputValues[index] === "") {
        inputValues[index] = 0;
      } else if (inputValues[index].toString().includes(".")) {
        const dividedByComma = inputValues[index].toString().split(".");
        if (dividedByComma.length - 1 > 1) {
          inputValues[index] = dividedByComma[0] + "." + dividedByComma[1];
        }
      }

      setTheRestValue("0");
      if (sumTemp < 100) {
        sumTemp += parseFloat(inputValues[index]);

        const shortage = 100 - sumTemp;
        if (shortage > 0) {
          setTheRestValue(shortage.toString().includes('.') ? shortage.toFixed(2).toString() : shortage.toString());
        }
      }

      if (sumTemp >= 100) {
        const surplus = sumTemp - 100;
        inputValues[index] = (inputValues[index] - surplus).toString();
        sumTemp = sumTemp - surplus;
      }
    }

    setInputValues((prevInputValues) => prevInputValues.map((value, index) => value.toString().replace(",", ".")));
    setSum(sumTemp);

    calculateDhondtMandates();

    for (let index = 0; index < inputValues.length; index++) {
      if (inputValues[index] === 0) {
        inputValues[index] = "";
      }
    }
  }

  // starts process of calculating mandates
  function calculateDhondtMandates() {
    const votes = [];
    let sumTemp = 100;

    for (let index = 0; index < inputValues.length; index++) {
      if (!overThreshold[index]) {
        votes[index] = parseFloat(inputValues[index]) * 100000;
        sumTemp -= parseFloat(inputValues[index]);
      } else {
        votes[index] = 0;
      }
    }
    votes[votes.length] = sumTemp.toFixed(2) * 10000;

    const districts = [
      {votes, seats: 12},
      {votes, seats: 8},
      {votes, seats: 14},
      {votes, seats: 12},
      {votes, seats: 13},
      {votes, seats: 15},
      {votes, seats: 12},
      {votes, seats: 12},
      {votes, seats: 10},
      {votes, seats: 9},
      {votes, seats: 12},
      {votes, seats: 8},
      {votes, seats: 14},
      {votes, seats: 10},
      {votes, seats: 9},
      {votes, seats: 10},
      {votes, seats: 9},
      {votes, seats: 12},
      {votes, seats: 20},
      {votes, seats: 12},
      {votes, seats: 12},
      {votes, seats: 11},
      {votes, seats: 15},
      {votes, seats: 14},
      {votes, seats: 12},
      {votes, seats: 14},
      {votes, seats: 9},
      {votes, seats: 7},
      {votes, seats: 9},
      {votes, seats: 9},
      {votes, seats: 12},
      {votes, seats: 9},
      {votes, seats: 16},
      {votes, seats: 8},
      {votes, seats: 10},
      {votes, seats: 12},
      {votes, seats: 9},
      {votes, seats: 9},
      {votes, seats: 10},
      {votes, seats: 8},
      {votes, seats: 12},
    ];

    const results = simulateElections(districts);

    for (let index = 0; index < results.length - 1; index++) {
      if (!overThreshold[index]) {
        outputValues[index] = results[index].toFixed(0).toString();
      } else {
        outputValues[index] = "0";
      }
    }

    setTheRestMandatesValue(results[results.length - 1].toFixed(0).toString());
  }

  // applies given percentage for each district
  function simulateElections(districts) {
    const totalParties = districts[0].votes.length;
    const totalMandates = Array(totalParties).fill(0);

    districts.forEach((district) => {
      const districtResult = dHondtInDistrict(district.votes, district.seats);
      for (let i = 0; i < totalParties; i++) {
        totalMandates[i] += districtResult[i];
      }
    });

    return totalMandates;
  }

  // calculates mandates for given district
  function dHondtInDistrict(votes, seats) {
    const mandates = Array(votes.length).fill(0);
    const voteCounts = votes.map((vote) => vote);

    for (let i = 0; i < seats; i++) {
      let maxIndex = 0;
      let maxScore = 0;

      for (let j = 0; j < voteCounts.length; j++) {
        const score = voteCounts[j] / (mandates[j] + 1);
        if (score > maxScore) {
          maxScore = score;
          maxIndex = j;
        }
      }
      mandates[maxIndex]++;
    }

    return mandates;
  }


  const theme = useTheme();

  //PK: Styles have to be here (else useTheme() won't work)
  const styles = StyleSheet.create({
    scrollView: {
      width: "100%",
      flex: 1,
      paddingHorizontal: "2%",
      marginHorizontal: 20,
    },

    viewHorizontal: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },

    partyTile: {
      backgroundColor: theme.colors.primary,
      minHeight: 80,
      width: "96%",
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginTop: 20,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 10,
    },

    partyTileText: {
      color: theme.colors.onPrimary,
      fontSize: 25,
      fontWeight: "700",
    },
    percent: {
      color: theme.colors.onPrimary,
      fontSize: 23,
      marginLeft: 3,
      marginRight: 25,
    },
    mandatesText: {
      position: "absolute",
      left: "57%",
      fontSize: 20,
      fontWeight: "400"
    },

    checkBoxText: {
      flex: 0,
      color: theme.colors.onPrimary,
      fontSize: 15,
      marginLeft: 5,
    },
    partyTileInput: {
      maxHeight: "75%",
      minWidth: "19%",
      justifyContent: "center",
      fontSize: 22,
      backgroundColor: theme.colors.secondaryContainer,
      textAlign: "center",
    },
    partyTileInputContent: {
      minWidth: 0,
      paddingLeft: 10,
      paddingRight: 10,
    },
    partyTileOutput: {
      position: "absolute",
      left: "36%",
      fontSize: 24,
      backgroundColor: theme.colors.inversePrimary,
      opacity: 0.85,
      fontWeight: "700",
    },
    partyTileOutputContent: {
      paddingLeft: 5,
      paddingRight: 5,
    },

    addButton: {
      alignSelf: "center",
      marginTop: "2%",
    },


    calculatorDescDiv: {
      marginTop: "17%",
    },
    calculatorDescTitle: {
      fontSize: 22,
      fontWeight: "800",
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

  const textInputProps = useTextInputProps();

  /**
   * Checks suffix for word 'mandaty'.
   * @param {string} mandates - number of mandates from outputs.
   * @returns {string} word 'mandaty' with appropriate suffix.
   */
  const checkSuffix = (mandates) => {
    if (!mandates) return '';
    if (mandates === "1") return "mandat";
    if (["2", "3", "4"].includes(mandates.slice(-1))) return "mandaty";
    return "mandatów";
  };


  return (
    <_Container style={{padding: "4%"}}>
      <ScrollView keyboardShouldPersistTaps={"always"} keyboardDismissMode="on-drag" style={styles.scrollView}>
        {parties.map((partyItem, index) => (
          <View key={index} style={styles.partyTile}>
            <View style={{width: "100%"}}>
              <Text style={styles.partyTileText}>Partia {index + 1}</Text>
              <View style={styles.viewHorizontal}>
                <TextInput
                  {...textInputProps}
                  selectionColor={theme.colors.outlineVariant}
                  selectionHandleColor={theme.colors.onSecondaryContainer}
                  style={styles.partyTileInput}
                  contentStyle={styles.partyTileInputContent}
                  outlineStyle={{borderColor: theme.colors.onPrimaryContainer}}
                  value={inputValues[index]}
                  onChangeText={(newValue) => {
                    inputValues[index] = newValue;
                    onPercentageChange();
                  }}
                  keyboardType="numeric"
                  maxLength={inputValues[index] === "100" ? 3 : 5}
                />
                <Text style={styles.percent}>%</Text>
                <TextInput
                  {...textInputProps}
                  style={[styles.partyTileInput, styles.partyTileOutput]}
                  // textColor={theme.colors.onPrimary}
                  contentStyle={styles.partyTileOutputContent}
                  readOnly
                  value={outputValues[index]}
                />
                <Text style={[styles.percent, styles.mandatesText]}>{checkSuffix(outputValues[index])}</Text>
              </View>
              <CheckBox
                style={[{paddingVertical: 10}, !inputValues[index] && {opacity: 0.3}]}
                checkBoxColor={theme.colors.onPrimary}
                isChecked={overThreshold[index]}
                disabled={!inputValues[index]}
                onClick={() => {
                  overThreshold[index] = !overThreshold[index];
                  onPercentageChange();
                }}
                rightText="Nie przekroczono progu wyborczego"
                rightTextStyle={styles.checkBoxText}
              />
            </View>
            {/* PK: Show remove button if more parties then one */}
            {parties.length > 1 && (
              <TouchableOpacity style={{position: "absolute", right: "3%", top: "10%"}} activeOpacity={0.7}
                                onPress={() => deleteParty(index)}>
                <Icon color={theme.colors.onPrimary} source="close-circle-outline" size={50}/>
              </TouchableOpacity>
            )}

          </View>
        ))}


        {/* PK: Rest party tile */}
        <View style={[styles.partyTile, {backgroundColor: theme.colors.outlineVariant}]}>
          <View style={{width: "100%"}}>
            <Text style={styles.partyTileText}>Reszta</Text>
            <View style={styles.viewHorizontal}>
              <TextInput
                {...textInputProps}
                style={styles.partyTileInput}
                contentStyle={styles.partyTileInputContent}
                outlineStyle={{borderColor: theme.colors.onPrimaryContainer}}
                value={theRestValue}
                readOnly
              />
              <Text style={styles.percent}>%</Text>
              <TextInput
                {...textInputProps}
                style={[styles.partyTileInput, styles.partyTileOutput]}
                contentStyle={styles.partyTileOutputContent}
                readOnly
                value={theRestMandatesValue}
              />
              <Text style={[styles.percent, styles.mandatesText]}>{checkSuffix(theRestMandatesValue)}</Text>
            </View>
          </View>
        </View>


        {/* PK: Add party button */}
        <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={addParty}>
          <Icon color={theme.colors.onSurfaceVariant} source="plus-circle" size={69}/>
        </TouchableOpacity>


        {/* PK: Description */}
        <View style={styles.calculatorDescDiv}>
          <Text style={styles.calculatorDescTitle}>{'  '}Uwaga</Text>
          <Text style={styles.calculatorDescText}>Dane wyliczone przez kalkulator są tylko{'\n'}szacunkiem. Nie należy
            się do nich przywiązywać.</Text>
          <Text style={styles.calculatorDescText}>
            Zalecamy uzupełnić dane w taki sposób, aby "Reszta" miała jak najmniej % głosów. W przeciwnym wypadku
            dostaną oni nieproporcjonalnie dużo mandatów.{'\n'}Wynika to z algorytmu liczenia głosów.
          </Text>
          <Text style={styles.calculatorDescText}>
            <Text>Kalkulator szacuje liczbę mandatów przy pomocy metody{' '}
              <Text
                style={[styles.calculatorDescText, styles.textLink]}
                onPress={() => {
                  navigation.navigate("DhondtExplanation");
                }}
              >
                d'Hondta
              </Text>
              , nieuwzględniającej okręgów wyborczych.</Text>
          </Text>
        </View>

      </ScrollView>

    </_Container>
  );
}
