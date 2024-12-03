import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableHighlight, Alert } from "react-native";
import { getAllSejmElections } from "../../backend/database/SejmElections";
import { getAllPresidentElections } from "../../backend/database/PresidentElections";
import { getAllEuElections } from "../../backend/database/EuElections";

export default function CalendarScreen({ navigation }) {
  const [years, setYears] = useState([]);
  const [yearData, setYearData] = useState([]);

  useEffect(() => {
    currentYear = new Date().getFullYear();
    showYears();
    navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent().setOptions({ tabBarStyle: { height: 65, borderTopLeftRadius: 10, borderTopRightRadius: 10 } });
    };
  }, []);

  async function showYears() {
    var yearsTemp = [];
    var yearDataTemp = [];
    const data = await getWybory();

    for (let year = currentYear + 5; year >= 2010; year--) {
      var yearDataTempTemp = [];
      yearsTemp.push(
        <View>
          <View style={styles.yearDiv}>
            <Text style={styles.yearTileText}>{year}</Text>
            {data.sejm.map((oneYear) => {
              if (year == new Date(oneYear.date).getFullYear()) {
                yearDataTempTemp.push({ date: oneYear.date, name: oneYear.name });
                return <View key={oneYear.name} style={styles.circleSejm} />;
              }
            })}
            {data.prezydent.map((oneYear) => {
              if (year == new Date(oneYear.date).getFullYear()) {
                yearDataTempTemp.push({ date: oneYear.date, name: oneYear.name });
                return <View key={oneYear.name} style={styles.circlePrezydent} />;
              }
            })}
            {data.eu.map((oneYear) => {
              if (year == new Date(oneYear.date).getFullYear()) {
                yearDataTempTemp.push({ date: oneYear.date, name: oneYear.name });
                return <View key={oneYear.name} style={styles.circleEu} />;
              }
            })}
          </View>
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
      return { sejm, prezydent, eu };
    } catch (error) {
      console.log(error);
    }
  }

  const showYearPrompt = (allData) => {
    if (allData.length > 0) {
      var message = "";
      var inteager = 0;

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

        inteager++;
        if (allData.length > 1 && inteager !== allData.length) {
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
      return "w lipicu";
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
    <View style={styles.container}>
      <View style={{ width: "100%", paddingBottom: 10, borderBottomWidth: 3 }}>
        <View style={styles.colorsMeaningDiv}>
          <View style={styles.circleSejm} />
          <Text style={styles.colorsMeaningText}>wybory do sejmu i senatu</Text>
        </View>
        <View style={styles.colorsMeaningDiv}>
          <View style={styles.circlePrezydent} />
          <Text style={styles.colorsMeaningText}>wybory prezydenckie</Text>
        </View>
        <View style={styles.colorsMeaningDiv}>
          <View style={styles.circleEu} />
          <Text style={styles.colorsMeaningText}>wybory do parlamentu europejskiego</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {years.map((yearItem, index) => (
          <View key={index}>
            <TouchableHighlight
              style={styles.yearTile}
              onPress={() => {
                showYearPrompt(yearData[index]);
              }}
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
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "4%",
  },

  colorsMeaningDiv: {
    alignSelf: "left",
    flexDirection: "row",
  },
  colorsMeaningText: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  scrollView: {
    width: "100%",
    marginHorizontal: 20,
  },

  yearTile: {
    backgroundColor: "#000",
    height: 70,
    width: "96%",
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 20,
    marginLeft: "2%",
    marginRight: "2%",
    borderRadius: 20,
    justifyContent: "center",
  },

  yearDiv: {
    marginLeft: "40%",
    flexDirection: "row",
  },

  yearTileText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
  },

  circleSejm: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 10,
    marginVertical: 7,
    backgroundColor: "#12cdd4",
  },
  circlePrezydent: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 10,
    marginVertical: 7,
    backgroundColor: "#f24726",
  },
  circleEu: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 10,
    marginVertical: 7,
    backgroundColor: "#8fd14f",
  },

  electionAlert: {
    fontSize: 20,
  },
});
