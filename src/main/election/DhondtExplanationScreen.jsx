import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, TextInput } from "react-native";
import { DataTable } from "react-native-paper";

export default function DhondtExplanationScreen({ navigation }) {
  useEffect(() => {
    navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent().setOptions({ tabBarStyle: { height: 65, borderTopLeftRadius: 10, borderTopRightRadius: 10 } });
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleDiv}>
        <Text style={styles.title}>metoda d'Hondta</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewText}>
            W wyborach do Sejmu obowiązuje liczenie głosów metodą d'Hondta. Proces ten można podzielić na kilka kroków:
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Zliczenie głosów</Text>
          <Text style={styles.scrollViewText}>
            Najpierw obliczana jest liczba głosów oddanych na poszczególne komitety wyborcze w danym okręgu wyborczym
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Uwzględnienie progów wyborczych</Text>
          <Text style={styles.scrollViewText}>
            Komitety wyborcze, które zdobyły mniej niż 5% głosów w skali kraju (lub 8% w przypadku koalicji), nie uczestniczą w podziale mandatów.
            Wyjątek stanowią komitety mniejszości narodowych, które nie podlegają progowi wyborczemu
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Tworzenie tabeli ilorazów</Text>
          <Text style={styles.scrollViewText}>
            Liczba głosów każdego komitetu wyborczego w danym okręgu dzielona jest przez kolejne liczby naturalne: 1, 2, 3, 4, ... aż do liczby
            mandatów do przydzielenia w tym okręgu. Otrzymane wyniki (ilorazy) są wpisywane do tabeli.
          </Text>
          <Text style={styles.scrollViewText}>Przykład dla okręgu, w którym przydzielane są 5 mandaty:</Text>
          <DataTable style={styles.tablecontainer}>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title></DataTable.Title>
              <DataTable.Title>Komitet A</DataTable.Title>
              <DataTable.Title>Komitet B</DataTable.Title>
              <DataTable.Title>Komitet C</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
              <DataTable.Cell>Głosy ÷ 1</DataTable.Cell>
              <DataTable.Cell>100 000</DataTable.Cell>
              <DataTable.Cell>80 000</DataTable.Cell>
              <DataTable.Cell>40 000</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Głosy ÷ 2</DataTable.Cell>
              <DataTable.Cell>50 000</DataTable.Cell>
              <DataTable.Cell>40 000</DataTable.Cell>
              <DataTable.Cell>20 000</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Głosy ÷ 3</DataTable.Cell>
              <DataTable.Cell>33 333</DataTable.Cell>
              <DataTable.Cell>26 667</DataTable.Cell>
              <DataTable.Cell>13 333</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Głosy ÷ 4</DataTable.Cell>
              <DataTable.Cell>25 000</DataTable.Cell>
              <DataTable.Cell>20 000</DataTable.Cell>
              <DataTable.Cell>10 000</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Głosy ÷ 5</DataTable.Cell>
              <DataTable.Cell>20 000</DataTable.Cell>
              <DataTable.Cell>16 000</DataTable.Cell>
              <DataTable.Cell>8 000</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <View style={styles.scrollViewDiv}>
            <Text style={styles.scrollViewTitle}>Wybór najwyższych wyników</Text>
            <Text style={styles.scrollViewText}>
              Spośród wszystkich ilorazów wybiera się najwyższe wartości, odpowiadające liczbie mandatów w danym okręgu. Każdy „wybrany” wynik oznacza
              przyznanie mandatu komitetowi, który osiągnął ten wynik.
            </Text>
            <Text style={styles.scrollViewSubtitle}>W przykładzie z tabeli najwyższe ilorazy to:</Text>
            <Text style={styles.scrollViewText}>100 000 (Komitet A)</Text>
            <Text style={styles.scrollViewText}>80 000 (Komitet B)</Text>
            <Text style={styles.scrollViewText}>50 000 (Komitet A)</Text>
            <Text style={styles.scrollViewText}>40 000 (Komitet C)</Text>
            <Text style={styles.scrollViewText}>40 000 (Komitet B)</Text>

            <Text style={styles.scrollViewSubtitle}>Przydział mandatów</Text>
            <Text style={styles.scrollViewText}>Komitet A: 2 mandaty (za wyniki 100 000 i 50 000)</Text>
            <Text style={styles.scrollViewText}>Komitet B: 2 mandaty (za wyniki 80 000 i 40 000)</Text>
            <Text style={styles.scrollViewText}>Komitet C: 1 mandat (za wynik 40 000)</Text>
          </View>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Zasady faworyzacji większych komitetów</Text>
          <Text style={styles.scrollViewText}>
            Metoda d'Hondta nie jest idealnie proporcjonalna – preferuje większe komitety wyborcze, co oznacza, że mogą one zdobyć więcej mandatów w
            stosunku do liczby głosów, jakie uzyskały. Ma to na celu:
          </Text>
          <Text style={styles.scrollViewText}>-ułatwienie formowania stabilnej większości w parlamencie</Text>
          <Text style={styles.scrollViewText}>-zmniejszenie rozdrobnienia politycznego</Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Zastosowanie w Polsce</Text>
          <Text style={styles.scrollViewText}>Metoda d'Hondta jest stosowana w Polsce m.in.:</Text>
          <Text
            style={[styles.scrollViewText, styles.textLink]}
            onPress={() => {
              navigation.navigate("SejmExplanation");
            }}
          >
            -w wyborach do Sejmu
          </Text>
          <Text
            style={[styles.scrollViewText, styles.textLink]}
            onPress={() => {
              navigation.navigate("EuExplanation");
            }}
          >
            -w wyborach do Parlamentu Europejskiego
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
  scrollViewDiv: {
    marginBottom: 15,
  },
  scrollViewTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  scrollViewSubtitle: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: "400",
  },
  scrollViewText: {
    fontSize: 18,
    fontWeight: "300",
  },

  textLink: {
    color: "#009982",
  },

  tablecontainer: {
    paddingVertical: 10,
  },
  tableHeader: {
    backgroundColor: "#DCDCDC",
  },

  titleDiv: {
    alignSelf: "left",
    flexDirection: "row",
    marginBottom: 5,
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
  circleSejm: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 10,
    marginVertical: 7,
    backgroundColor: "#12cdd4",
  },
});
