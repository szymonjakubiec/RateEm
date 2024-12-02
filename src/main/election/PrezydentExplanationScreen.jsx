import {useState, useEffect} from "react";
import {StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, TextInput, LayoutAnimation} from "react-native";
import _Container from "../styles/Container";



export default function PrezydentExplanation({navigation}) {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.getParent().setOptions({tabBarStyle: {height: 0}});
    return () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      navigation.getParent().setOptions({tabBarStyle: {height: 65, borderTopLeftRadius: 10, borderTopRightRadius: 10}});
    };
  }, []);

  return (
    <_Container style={{padding: "4%"}}>
      <View style={styles.titleDiv}>
        <View style={styles.circlePrezydent}/>
        <Text style={styles.title}>wybory Prezydenta RP</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Opis</Text>
          <Text style={styles.scrollViewText}>
            Wybory na Prezydenta Rzeczypospolitej Polskiej to jedno z najważniejszych wydarzeń politycznych w kraju,
            które odbywa się co pięć lat.
            Prezydent RP jest najwyższym przedstawicielem państwa, głową państwa oraz gwarantem ciągłości władzy
            państwowej. Jego mandat pochodzi z
            bezpośredniego wyboru przez obywateli, co podkreśla wyjątkowy charakter tej funkcji w polskim systemie
            demokratycznym.
          </Text>
        </View>

        <View style={styles.scrollViewDiv}>
          <Text style={styles.scrollViewTitle}>Proces wyborczy</Text>
          <Text style={styles.scrollViewText}>
            Prezydent RP jest wybierany na pięcioletnią kadencję i może sprawować urząd maksymalnie przez dwie kolejne
            kadencje.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Ogłoszenie terminu wyborów</Text>
          <Text style={styles.scrollViewText}>
            Wybory prezydenckie są zarządzane przez Marszałka Sejmu, który ogłasza ich datę na co najmniej 75 dni przed
            upływem kadencji urzędującego
            Prezydenta RP. Zwykle wybory odbywają się w jedną z niedziel w okresie od 75 do 100 dni przed końcem
            urzędującej kadencji.
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

          <Text style={styles.scrollViewSubtitle}>Pierwsza i druga tura</Text>
          <Text style={styles.scrollViewText}>
            Aby zostać wybranym na Prezydenta w pierwszej turze, kandydat musi uzyskać ponad 50% ważnych głosów. Jeśli
            żaden z kandydatów nie osiągnie
            tego wyniku, dwie osoby z najlepszymi wynikami przechodzą do drugiej tury, która odbywa się dwa tygodnie
            później. W drugiej turze
            zwycięzcą zostaje kandydat z większą liczbą głosów.
          </Text>

          <Text style={styles.scrollViewSubtitle}>Kto może głosować</Text>
          <Text style={styles.scrollViewText}>Prawo do głosowania w wyborach do Sejmu mają wszyscy obywatele Polski,
            którzy:</Text>
          <Text style={styles.scrollViewText}>-ukończyli 18 lat najpóźniej w dniu wyborów.</Text>
          <Text style={styles.scrollViewText}>-nie zostali pozbawieni praw wyborczych na mocy wyroku sądowego lub
            orzeczenia Trybunału Stanu.</Text>
          <Text style={styles.scrollViewText}>-są wpisani do rejestru wyborców w swojej gminie lub zgłosili chęć
            głosowania za granicą.</Text>

          <Text style={styles.scrollViewSubtitle}>Kto może kandytować</Text>
          <Text style={styles.scrollViewText}>Kandydatem na urząd Prezydenta RP może być obywatel Polski, który:</Text>
          <Text style={styles.scrollViewText}>-ukończył 35 lat</Text>
          <Text style={styles.scrollViewText}>-posiada pełnię praw wyborczych</Text>
          <Text style={styles.scrollViewText}>-zgromadził co najmniej 100 000 podpisów poparcia od obywateli</Text>
          <Text style={styles.scrollViewText}>-podpisy zostały pozytywnie zweryfikowane przez PKW (Państwowa Komisja
            Wyborcza)</Text>
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
          <Text style={styles.scrollViewTitle}>Rola Prezydenta RP</Text>
          <Text style={styles.scrollViewText}>
            Prezydent pełni funkcje reprezentacyjne, kontrolne i arbitrażowe. Jest zwierzchnikiem Sił Zbrojnych RP,
            mianuje premiera oraz członków
            rządu, podpisuje ustawy, a w niektórych przypadkach ma prawo weta. Reprezentuje Polskę na arenie
            międzynarodowej, podpisuje umowy
            międzynarodowe i pełni kluczową rolę w procesie politycznym, zwłaszcza w sytuacjach kryzysowych.
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
  circlePrezydent: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 10,
    marginVertical: 7,
    backgroundColor: "#f24726",
  },
});
