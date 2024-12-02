import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from "react-native";
import { getAllSejmElections } from "../../backend/database/SejmElections";
import { getAllPresidentElections } from "../../backend/database/PresidentElections";
import { getAllEuElections } from "../../backend/database/EuElections";

export default function CalendarScreen({navigation}) {
  const [years, setYears] = useState([]);

  useEffect(() => {
    currentYear = new Date().getFullYear();
    showYears();
    navigation.getParent().setOptions({tabBarStyle: {display: 'none'}});
    return () => {
      navigation.getParent().setOptions({tabBarStyle: {height: 65, borderTopLeftRadius: 10,  borderTopRightRadius: 10}});
    };
  }, []);

  async function showYears() {
    var yearsTemp = [];
    const data = await getWybory();

    for (let year = currentYear + 5; year >= 2010; year--) {
      yearsTemp.push(
        <View>
          <View style={styles.yearDiv}>
            <Text style={styles.yearTileText}>{year}</Text>
            {data.sejm.map((oneYear) => {
              if (year == new Date(oneYear.date).getFullYear()) {
                return <View key={oneYear.name} style={styles.circleSejm} />;
              }
            })}
            {data.prezydent.map((oneYear) => {
              if (year == new Date(oneYear.date).getFullYear()) {
                return <View key={oneYear.name} style={styles.circlePrezydent} />;
              }
            })}
            {data.eu.map((oneYear) => {
              if (year == new Date(oneYear.date).getFullYear()) {
                return <View key={oneYear.name} style={styles.circleEu} />;
              }
            })}
          </View>
        </View>
      );
    }

    setYears(yearsTemp);
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
                console.log(yearItem);
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
});
