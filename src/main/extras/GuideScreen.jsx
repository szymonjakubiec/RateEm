import React, {useEffect, useState} from "react";
import {BackHandler, Dimensions, ScrollView, StyleSheet, Text, View,} from "react-native";
import {tabBarAnim} from "../../backend/CommonMethods";
import {StatusBar} from "expo-status-bar";
import _Container from "../styles/Container";
import _Button from "../styles/Button";



const {width, height} = Dimensions.get('window');

export default function GuideScreen({navigation}) {

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  // Pk: Preventing navigating back
  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const [sliderState, setSliderState] = useState({currentPage: 0});
  const setSliderPage = (event) => {
    const {currentPage} = sliderState;

    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };
  return (
    <_Container style={{paddingHorizontal: 0}}>
      <StatusBar barStyle="dark-content"/>
      <ScrollView
        style={{flex: 1}}
        horizontal={true}
        scrollEventThrottle={16}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          setSliderPage(event);
        }}
      >
        {/* General guide*/}
        <View style={[{
          width,
          height,
          flexDirection: 'column',
          padding: 20,
          alignItems: 'center'
        }]}>
          {/* Title */}
          <Text style={[styles.guideTitle, {alignSelf: 'center', fontSize: 26, fontWeight: 'bold', marginBottom: 15}]}>
            Przewodnik po aplikacji
          </Text>

          {/* Description */}
          <Text style={[styles.guideDescription, {
            alignSelf: 'center',
            fontSize: 18,
            textAlign: 'center',
            marginBottom: 20
          }]}>
            Aplikacja składa się z czterech głównych funkcjonalności:
          </Text>

          {/* List of functionalities */}
          <View style={[styles.guideList, {alignSelf: 'center', paddingHorizontal: 15}]}>
            <Text style={styles.guideItem}>• wybory</Text>
            <Text style={styles.guideItem}>• ekran główny</Text>
            <Text style={styles.guideItem}>• więcej</Text>
          </View>

          {/* Additional styling for better readability */}
          <View style={[{
            marginTop: 30,
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            width: '100%'
          }]}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10}}>Jak korzystać z
              aplikacji:</Text>
            <Text style={{fontSize: 16, color: '#555', textAlign: 'center'}}>
              Przewodnik pomoże Ci zapoznać się z funkcjami aplikacji i efektywnie je wykorzystać. Przejdź przez każdy
              krok, aby odkryć nowe możliwości!
            </Text>
          </View>
        </View>

        <View style={{width, height}}>
          <Text style={styles.sectionTitle}>🏛️ Strona Główna</Text>
          <Text style={styles.sectionDescription}>
            Na ekranie głównym możesz przeglądać polityków, sortować ich według różnych kryteriów, wyszukiwać konkretną
            osobę oraz sprawdzić, kto jest na czasie.
            {"\n"}
            Znajdziesz tutaj również ich globalne oceny oraz możliwość przejścia do szczegółowych profili, aby poznać
            więcej informacji, takich jak przynależność partyjna.
          </Text>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>🔥 Na Czasie</Text>
            <Text style={styles.subsectionDescription}>
              Sprawdź, którzy politycy są obecnie najczęściej oceniani przez naszych użytkowników. Możesz szybko
              przejrzeć ich oceny lub zobaczyć szczegóły, klikając na ich profil.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>🔍 Wyszukiwarka Polityków</Text>
            <Text style={{...styles.subsectionDescription, marginBottom: 15}}>
              Znajdź konkretnego polityka, korzystając z wyszukiwarki. Przeglądaj profile polityków, aby poznać ich
              szczegóły, takie jak przynależność partyjna i średnia ocena.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>⭐ Ocena Polityków</Text>
            <Text style={{...styles.subsectionDescription, marginBottom: 15}}>
              Oceń polityków, wyrażając swoje emocje na temat ich działań. Wybierz od 1 do 5 gwiazdek i dodaj komentarz,
              jeśli chcesz.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>📋 Twoje Oceny</Text>
            <Text style={styles.subsectionDescription}>
              Przeglądaj oceny, które wystawiłeś wcześniej. Śledź, jak zmieniały się Twoje opinie w czasie.
            </Text>
          </View>
        </View>

        {/* Election screen guide*/}
        <View style={{width, height}}>
          <Text style={styles.sectionTitle}>📄 Wyborcze ABC</Text>
          <Text style={styles.sectionDescription}>
            Kompleksowy przewodnik po wyborach. Znajdziesz tu wyjaśnienia dotyczące różnych typów wyborów, informacji o
            okręgach wyborczych, kalendarzu wyborczym oraz kalkulatorze mandatów.
          </Text>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>🗳 Typy Wyborów</Text>
            <Text style={styles.subsectionDescription}>
              - **Wybory do Sejmu RP**: Poznaj zasady wyborów i jak działa metoda d'Hondta przy podziale mandatów.{"\n"}
              - **Wybory Prezydenckie**: Jak wygląda proces wyboru głowy państwa?{"\n"}
              - **Wybory do Parlamentu Europejskiego**: Dowiedz się, jak wybierani są przedstawiciele Polski w UE.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>📍 Okręgi Wyborcze</Text>
            <Text style={styles.subsectionDescription}>
              Sprawdź swój okręg wyborczy. Dowiedz się, ile mandatów przypada na Twój region.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>📅 Kalendarz Wyborczy</Text>
            <Text style={styles.subsectionDescription}>
              Pozostań na bieżąco z terminami wyborów, rejestracji kandydatów i innymi ważnymi datami.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>📊 Kalkulator Mandatów</Text>
            <Text style={styles.subsectionDescription}>
              Przeanalizuj, jak głosy w Twoim okręgu mogą przełożyć się na mandaty. Zrozum podział mandatów za pomocą
              metody d'Hondta.
            </Text>
          </View>
        </View>


        {/* Extras screen guide*/}
        <View style={{width, height}}>
          <Text style={styles.sectionTitle}>≡ Więcej</Text>
          <Text style={styles.sectionDescription}>
            Odnośniki do ustawień, podsumowania ocen i innych funkcji.
          </Text>
          <_Button
            style={{minWidth: "40%", width: "40%", alignSelf: "center", marginTop: "15%"}}
            text="Zaczynamy!"
            onPress={() => {
              navigation.popToTop();
            }}
          />
        </View>
      </ScrollView>

      {/* Pagination dots*/}
      <View style={styles.paginationWrapper}>
        {Array.from(Array(4).keys()).map((key, index) => (
          <View
            style={[
              styles.paginationDots,
              {opacity: sliderState.currentPage === index ? 1 : 0.2},
            ]}
            key={index}
          />
        ))}
      </View>
    </_Container>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  sectionDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: "center",
  },
  subsectionDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#26518a',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  slide: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  guideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  guideDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  guideList: {
    marginTop: 20,
  },
  guideItem: {
    fontSize: 18,
    color: '#444',
    marginVertical: 8,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: '#005BB5',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  panel: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  politicianPanel: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  politicianImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  rating: {
    fontSize: 16,
    color: '#666',
  },
});
