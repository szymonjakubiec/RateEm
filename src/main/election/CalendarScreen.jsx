import {useState, useEffect} from "react";
import {StyleSheet, Text, View, ScrollView, TouchableHighlight, LayoutAnimation, Alert} from "react-native";
import {getAllSejmElections} from "../../backend/database/SejmElections";
import {getAllPresidentElections} from "../../backend/database/PresidentElections";
import {getAllEuElections} from "../../backend/database/EuElections";
import _Container from "../styles/Container";
import {tabBarAnim} from "../../backend/CommonMethods";
import _Button from "../styles/Button";
import {Icon, useTheme} from "react-native-paper";



export default function CalendarScreen({navigation}) {
  const [years, setYears] = useState([]);
  const [yearData, setYearData] = useState([]);

  const theme = useTheme();

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  useEffect(() => {
    currentYear = new Date().getFullYear();
    showYears();
  }, []);

  async function showYears() {
    var yearsTemp = [];
    var yearDataTemp = [];
    const data = await getWybory();

    for (let year = currentYear + 5; year >= 2000; year--) {
      var yearDataTempTemp = [];
      yearsTemp.push(
        <View style={styles.yearDiv}>
          <Text style={styles.yearTileText}>{year}</Text>
          {data.sejm.map((oneYear) => {
            if (year === new Date(oneYear.date).getFullYear()) {
              yearDataTempTemp.push({date: oneYear.date, name: oneYear.name});
              return (
                <View key={oneYear.name} style={styles.circle}>
                  <Icon color={theme.colors.sejm} size={24} source="circle-slice-8"/>
                </View>
              );
            }
          })}
          {data.prezydent.map((oneYear) => {
            if (year === new Date(oneYear.date).getFullYear()) {
              yearDataTempTemp.push({date: oneYear.date, name: oneYear.name});
              return (
                <View key={oneYear.name} style={styles.circle}>
                  <Icon color={theme.colors.prezydent} size={24} source="circle-slice-8"/>
                </View>
              );
            }
          })}
          {data.eu.map((oneYear) => {
            if (year === new Date(oneYear.date).getFullYear()) {
              yearDataTempTemp.push({date: oneYear.date, name: oneYear.name});
              return (
                <View key={oneYear.name} style={styles.circle}>
                  <Icon color={theme.colors.parlament} size={24} source="circle-slice-8"/>
                </View>
              );
            }
          })}
        </View>
      );
      yearDataTemp.push(yearDataTempTemp);
    }

    setYears(yearsTemp);
    setYearData(yearDataTemp);
  }

  async function getWybory() {
    try {
      const sejm = await getAllSejmElections();
      const prezydent = await getAllPresidentElections();
      const eu = await getAllEuElections();
      return {sejm, prezydent, eu};
    } catch (error) {
      console.log(error);
    }
  }

  const showYearPrompt = (allData) => {
    if (allData.length > 0) {
      var message = "";
      var integer = 0;

      for (data of allData) {
        const electionType = data.name.split("_")[0];
        const electionDateStart = new Date(data.date);
        const electionDateEnd = new Date(data.date);
        var electionTypeString = "";

        if (electionType === "sejm") {
          electionDateEnd.setDate(electionDateStart.getDate() + 30);
          electionTypeString = "do Sejmu";
        } else if (electionType === "prezydent") {
          electionDateEnd.setDate(electionDateStart.getDate() + 25);
          electionTypeString = "na Prezydenta RP";
        } else if (electionType === "eu") {
          // can't estimate more accurate date because EU elections are random
          electionTypeString = "do Parlamentu Europejskiego";
        }

        const startMonth = electionDateStart.getMonth();
        const endMonth = electionDateEnd.getMonth();

        const startMonthString = getMonthString(startMonth);
        const endMonthString = getMonthString(endMonth);

        if (electionDateStart < new Date()) {
          message += "Wybory " + electionTypeString + " odbyły się " + electionDateStart.toISOString().substring(0, 10);
        } else if (startMonthString === endMonthString) {
          message += "Wybory " + electionTypeString + " powinny odbyć się " + startMonthString + " " + electionDateStart.getFullYear() + " roku";
        } else {
          message +=
            "Wybory " +
            electionTypeString +
            " powinny odbyć się " +
            startMonthString +
            " lub " +
            endMonthString +
            " " +
            electionDateStart.getFullYear() +
            " roku";
        }

        integer++;
        if (allData.length > 1 && integer !== allData.length) {
          message += "\n\n";
        }
      }

      showAlert(message);
    }
  };

  const showAlert = (text) => {
    Alert.alert(
      "",
      text,
      [
        {
          text: "ok",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const getMonthString = (index) => {
    if (index === 0) {
      return "w styczniu";
    } else if (index === 1) {
      return "w lutym";
    } else if (index === 2) {
      return "w marcu";
    } else if (index === 3) {
      return "w kwietniu";
    } else if (index === 4) {
      return "w maju";
    } else if (index === 5) {
      return "w czerwcu";
    } else if (index === 6) {
      return "w lipcu";
    } else if (index === 7) {
      return "w sierpniu";
    } else if (index === 8) {
      return "we wrześniu";
    } else if (index === 9) {
      return "w październiku";
    } else if (index === 10) {
      return "w listopadzie";
    } else if (index === 11) {
      return "w grudniu";
    } else {
      return "error";
    }
  };

  return (
    <_Container style={{padding: "4%"}}>
      <View style={{width: "100%", paddingBottom: 15, borderBottomWidth: 3}}>
        <View style={styles.colorsMeaningDiv}>
          <Icon color={theme.colors.sejm} size={24} source="circle-slice-8"/>
          <Text style={styles.colorsMeaningText}>wybory do sejmu i senatu</Text>
        </View>
        <View style={styles.colorsMeaningDiv}>
          <Icon color={theme.colors.prezydent} size={24} source="circle-slice-8"/>
          <Text style={styles.colorsMeaningText}>wybory prezydenckie</Text>
        </View>
        <View style={styles.colorsMeaningDiv}>
          <Icon color={theme.colors.parlament} size={24} source="circle-slice-8"/>
          <Text style={styles.colorsMeaningText}>wybory do parlamentu europejskiego</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {years.map((yearItem, index) => (
          <View key={index} style={{flexBasis: "50%", paddingTop: 10}}>
            <_Button style={styles.button} disabled={yearData[index]?.length === 0} mode="tile"
                     text={yearItem} onPress={() => showYearPrompt(yearData[index])}/>
          </View>
        ))}
      </ScrollView>
    </_Container>
  );
}

const styles = StyleSheet.create({
  colorsMeaningDiv: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
    height: 35,
  },
  colorsMeaningText: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  scrollView: {
    width: "100%",
  },

  scrollViewContent: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    paddingBottom: 10,
  },

  button: {
    alignSelf: "center",
    maxWidth: "90%",
    // height: "35%",
  },

  yearDiv: {
    flexDirection: "row",
    alignItems: "center",
  },

  yearTileText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  circle: {
    marginLeft: 5,
  },
});
