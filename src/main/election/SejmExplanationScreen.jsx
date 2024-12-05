import {StyleSheet, Text, View, ScrollView} from "react-native";
import _Container from "../styles/Container";



export default function SejmExplanation({navigation}) {

  return (
    <_Container style={{padding: "4%"}}>
      <View style={styles.titleDiv}>
        <View style={styles.circleSejm}/>
        <Text style={styles.title}>wybory do Sejmu</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Opis</Text>
          <Text style={styles.scrollViewText}>
            Wybory do Sejmu w Polsce to jedno z najważniejszych wydarzeń demokratycznych w kraju, podczas którego
            obywatele wybierają swoich
            przedstawicieli do niższej izby polskiego parlamentu. Sejm składa się z 460 posłów, którzy są wybierani w
            wyborach powszechnych, równych,
            bezpośrednich, proporcjonalnych i tajnych.
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Proces wyborczy</Text>
          <Text style={styles.scrollViewText}>
            Wybory odbywają się co cztery lata, choć możliwe jest ich przyspieszenie w przypadku rozwiązania Sejmu przez
            Prezydenta RP lub upływu
            kadencji przed czasem. W głosowaniu mogą uczestniczyć wszyscy obywatele Polski, którzy osiągnęli
            pełnoletniość i posiadają pełne prawa
            wyborcze. W Polsce stosuje się system proporcjonalny, co oznacza, że mandaty są przydzielane proporcjonalnie
            do liczby głosów oddanych na
            poszczególne komitety wyborcze. Próg wyborczy wynosi 5% dla partii politycznych i 8% dla koalicji.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Jak wygląda proces głosowania</Text>
          <Text style={styles.scrollViewText}>
            -rejestracja w lokalu wyborczym: Wyborca przychodzi do lokalu wyborczego i musi okazać dokument tożsamości,
            np. dowód osobisty lub
            paszport. Po weryfikacji danych otrzymuje kartę do głosowania.
          </Text>
          <Text style={styles.scrollViewText}>
            -wyborca stawia znak „X” (dwie przecinające się linie) w kratce obok nazwiska jednego wybranego kandydata
          </Text>
          <Text style={styles.scrollViewText}>
            -oddanie głosu: Po wypełnieniu karty wyborca wrzuca ją do zamkniętej i zaplombowanej urny wyborczej. Ten
            proces odbywa się w sposób
            anonimowy, co gwarantuje tajność głosowania.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Alternatywne sposoby głosowania</Text>
          <Text style={styles.scrollViewText}>
            Głosowanie korespondencyjne: wyborcy mogą wcześniej zgłosić chęć głosowania listownego, szczególnie osoby
            przebywające za granicą,
            seniorzy, osoby z niepełnosprawnościami czy w izolacji (np. z powodu choroby zakaźnej). W tym przypadku
            wyborca otrzymuje pakiet wyborczy,
            który wypełnia i odsyła na wskazany adres.
          </Text>
          <Text style={styles.scrollViewText}>
            Głosowanie przez pełnomocnika: osoby starsze lub z niepełnosprawnościami mogą ustanowić pełnomocnika, który
            odda głos w ich imieniu.
            Pełnomocnictwo musi być zgłoszone odpowiednio wcześniej i zatwierdzone przez urząd gminy.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Okręgi wyborcze</Text>
          <Text style={styles.scrollViewText}>
            W Polsce istnieje 41 okręgów wyborczych do Sejmu. Każdy z tych okręgów odpowiada za wybór określonej liczby
            posłów, co zależy od liczby
            mieszkańców zamieszkujących dany obszar. Okręgi są ustalane na podstawie podziału administracyjnego kraju, z
            uwzględnieniem liczby
            ludności.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Kto może głosować</Text>
          <Text style={styles.scrollViewText}>Prawo do głosowania w wyborach do Sejmu mają wszyscy obywatele Polski,
            którzy:</Text>
          <Text style={styles.scrollViewText}>-ukończyli 18 lat najpóźniej w dniu wyborów</Text>
          <Text style={styles.scrollViewText}>-nie zostali pozbawieni praw wyborczych na mocy wyroku sądowego lub
            orzeczenia Trybunału Stanu</Text>
          <Text style={styles.scrollViewText}>-są wpisani do rejestru wyborców w swojej gminie lub zgłosili chęć
            głosowania za granicą</Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>System liczenia głosów</Text>
          <Text style={styles.scrollViewText}>
            <Text>W wyborach do Sejmu obowiązuje liczenie głosów metodą </Text>
            <Text
              style={[styles.scrollViewText, styles.textLink]}
              onPress={() => {
                navigation.navigate("DhondtExplanation");
              }}
            >
              d'Hondta
            </Text>
            <Text>.</Text>
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Kampania wyborcza</Text>
          <Text style={styles.scrollViewText}>
            Oficjalnie kampania wyborcza rozpoczyna się z chwilą ogłoszenia daty wyborów przez Prezydenta RP
            (nieoficjalnie wcześniej) i trwa aż do
            ciszy wyborczej, która rozpoczyna się 24 godziny przed głosowaniem. W trakcie kampanii partie polityczne
            oraz komitety wyborcze prezentują
            swoje programy, organizują spotkania z wyborcami, debaty i działania promocyjne w mediach.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Cisza wyborcza</Text>
          <Text style={styles.scrollViewText}>
            W Polsce obowiązuje cisza wyborcza, która rozpoczyna się 24 godziny przed dniem wyborów i trwa do
            zakończenia głosowania. W tym czasie
            zabronione jest prowadzenie kampanii wyborczej, publikowanie sondaży oraz wszelkie działania mogące wpłynąć
            na decyzje wyborców.
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Rola Sejmu</Text>
          <Text style={styles.scrollViewText}>
            Sejm ma kluczowe znaczenie w polskim systemie politycznym. Posłowie sprawują funkcje ustawodawcze, kontrolne
            wobec rządu i decyzyjne w
            wielu kwestiach kluczowych dla funkcjonowania państwa. Sejm zatwierdza budżet, podejmuje decyzje w sprawach
            międzynarodowych oraz ma
            możliwość wyrażenia wotum nieufności wobec rządu.
          </Text>
        </View>
      </ScrollView>
    </_Container>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 20,
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
