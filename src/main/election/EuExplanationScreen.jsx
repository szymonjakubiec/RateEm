import {StyleSheet, Text, View, ScrollView} from "react-native";
import _Container from "../styles/Container";



export default function SejmExplanation({navigation}) {

  return (
    <_Container style={{padding: "4%"}}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Opis</Text>
          <Text style={styles.scrollViewText}>
            Wybory do Parlamentu Europejskiego to proces demokratyczny, w którym obywatele krajów członkowskich Unii
            Europejskiej wybierają swoich
            przedstawicieli do jednej z głównych instytucji UE. Parlament Europejski jest jedynym organem Unii
            wybieranym bezpośrednio przez
            obywateli, co czyni te wybory kluczowym elementem unijnej demokracji.
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Charakterystyka wyborów</Text>

          <Text style={styles.scrollViewSubtitle}>Termin wyborów</Text>
          <Text style={styles.scrollViewText}>
            Wybory do Parlamentu Europejskiego odbywają się co pięć lat we wszystkich 27 państwach członkowskich UE.
            Terminy wyborów mogą się różnić w
            poszczególnych krajach, ale muszą mieścić się w ustalonym przedziale czasowym, zazwyczaj czterodniowym.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Liczba europosłów</Text>
          <Text style={styles.scrollViewText}>
            Parlament Europejski liczy obecnie 705 posłów, a liczba miejsc przypadających na poszczególne państwa zależy
            od liczby ludności kraju.
            Polska ma w Parlamencie Europejskim 52 mandaty.
          </Text>

          <Text style={styles.scrollViewSubtitle}>System wyborczy</Text>
          <Text style={styles.scrollViewText}>
            Wszystkie kraje członkowskie stosują system proporcjonalny, co oznacza, że mandaty są przydzielane
            proporcjonalnie do liczby głosów
            oddanych na poszczególne listy wyborcze. W Polsce obowiązuje dodatkowo próg wyborczy wynoszący 5%, co
            oznacza, że komitet wyborczy musi
            zdobyć co najmniej tyle głosów w skali kraju, aby wziąć udział w podziale mandatów.
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Proces wyborczy</Text>

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
            W Polsce wybory do Parlamentu Europejskiego odbywają się w 13 okręgach wyborczych, z których każdy ma
            przydzieloną określoną liczbę
            mandatów. Liczba mandatów zależy od liczby ludności w danym okręgu.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Kto może głosować</Text>
          <Text style={styles.scrollViewText}>
            Prawo do głosowania w wyborach do Parlamentu Europejskiego mają wszyscy obywatele Polski i innych państw UE,
            którzy:
          </Text>
          <Text style={styles.scrollViewText}>-ukończyli 18 lat najpóźniej w dniu wyborów.</Text>
          <Text style={styles.scrollViewText}>-nie zostali pozbawieni praw wyborczych na mocy wyroku sądowego lub
            orzeczenia Trybunału Stanu.</Text>
          <Text style={styles.scrollViewText}>-są wpisani do rejestru wyborców w swojej gminie lub zgłosili chęć
            głosowania za granicą.</Text>

          <Text style={styles.scrollViewSubtitle}>Kto może kandytować</Text>
          <Text style={styles.scrollViewText}>Kandydatem na posła do Parlamentu Europejskiego może być osoba,
            która:</Text>
          <Text style={styles.scrollViewText}>-posiada obywatelstwo państwa członkowskiego UE</Text>
          <Text style={styles.scrollViewText}>-ukończyła 21 lat</Text>
          <Text style={styles.scrollViewText}>-posiada pełnię praw wyborczych</Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>System liczenia głosów</Text>
          <Text style={styles.scrollViewText}>
            <Text>W wyborach do Parlamentu Europejskiego obowiązuje liczenie głosów metodą{' '}
              <Text
                style={[styles.scrollViewText, styles.textLink]}
                onPress={() => navigation.navigate("DhondtExplanation")}
              >
                d'Hondta
              </Text>
              {'.'}</Text>
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
          <Text style={styles.scrollViewTitle}>Rola Parlamentu Europejskiego</Text>
          <Text style={styles.scrollViewText}>
            Parlament Europejski odgrywa kluczową rolę w funkcjonowaniu Unii Europejskiej. Posłowie, czyli
            eurodeputowani, zajmują się m.in.:
          </Text>
          <Text style={styles.scrollViewText}>tworzeniem prawa unijnego wspólnie z Radą Unii Europejskiej</Text>
          <Text style={styles.scrollViewText}>przyjmowaniem budżetu UE</Text>
          <Text style={styles.scrollViewText}>kontrolą działań Komisji Europejskiej i innych instytucji unijnych</Text>
          <Text style={styles.scrollViewText}>reprezentowaniem interesów obywateli UE na arenie międzynarodowej</Text>
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
    marginTop: 10,
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
});
