import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking, Dimensions, SafeAreaView,
} from "react-native";
import {goBack} from "../../backend/CommonMethods";
import {StatusBar} from "expo-status-bar";
import {useRoute} from "@react-navigation/native";



export default function GuideScreen({navigation, route}) {
  useEffect(() => {
    navigation.getParent().setOptions({tabBarStyle: {display: 'none'}});
    return () => {
      navigation.getParent().setOptions({tabBarStyle: {height: 65, borderTopLeftRadius: 10,  borderTopRightRadius: 10}});
    };
  }, []);
  const [sliderState, setSliderState] = useState({currentPage: 0});

  const setSliderPage = (event: any) => {
    const { currentPage } = sliderState;

    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  // Pk: Going back
  goBack(navigation);
  const {width, height} = Dimensions.get('window');
  const {currentPage: pageIndex} = sliderState;
  return (
    <>
      <StatusBar barStyle="dark-content"/>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={{flex: 1}}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event: any) => {
            setSliderPage(event);
          }}
        >
          <View style={styles.guideContainer}>
            <Text style={styles.guideTitle}>Przewodnik po aplikacji</Text>
            <Text style={styles.guideDescription}>
              Aplikacja składa się z czterech głównych funkcjonalności:
            </Text>
            <View style={styles.guideList}>
              <Text style={styles.guideItem}>• wyszukiwarka</Text>
              <Text style={styles.guideItem}>• wybory</Text>
              <Text style={styles.guideItem}>• tablica</Text>
              <Text style={styles.guideItem}>• więcej</Text>
            </View>
          </View>
          <View style={{width, height}}>
            <Text style={styles.sectionTitle}>🔍 Wyszukiwarka</Text>
            <Text style={styles.sectionDescription}>
              Zakładka służąca do znajdywania i oceniania osób.
            </Text>
          </View>
          <View style={{width, height}}>
            <Text style={styles.sectionTitle}>📄 Wyborcze ABC</Text>
            <Text style={styles.sectionDescription}>
              Miejsce, w którym znajdują się wszystkie podstawowe informacje o
              wyborach.
            </Text>
          </View>
          <View style={{width, height}}>
            <Text style={styles.sectionTitle}>📰 Tablica</Text>
            <Text style={styles.sectionDescription}>
              Tu wyświetlane są posty z social mediów osób, które obserwujesz.
            </Text>
          </View>
          <View style={{width, height}}>
            <Text style={styles.sectionTitle}>≡ Więcej</Text>
            <Text style={styles.sectionDescription}>
              Odnośniki do ustawień, podsumowania ocen i innych funkcji.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.paginationWrapper}>
          {Array.from(Array(5).keys()).map((key, index) => (
            <View
              style={[
                styles.paginationDots,
                { opacity: sliderState.currentPage === index ? 1 : 0.2 }, // Upewnij się, że używasz aktualnego currentPage
              ]}
              key={index}
            />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Przyjemny ciemnoszary
    textAlign: 'center',
    marginVertical: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666', // Jaśniejszy szary dla kontrastu
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 20, // Umieszczenie nad krawędzią ekranu
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
    backgroundColor: '#26518a', // Niebieski dla aktywnego punktu
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Delikatny jasnoszary jako kolor tła
  },
  slide: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF', // Białe tło dla slajdu
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Efekt podniesienia dla Androida
  },
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB', // Jasne tło dla sekcji
  },
  guideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dobrze widoczny kolor
    textAlign: 'center',
    marginBottom: 10,
  },
  guideDescription: {
    fontSize: 16,
    color: '#666', // Subtelny szary dla opisu
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  guideList: {
    width: '100%', // Pełna szerokość kontenera
    paddingHorizontal: 10,
  },
  guideItem: {
    fontSize: 16,
    color: '#444', // Lekko ciemniejszy odcień szarości dla listy
    marginVertical: 5, // Odstęp między elementami
  },
});