import React, {useEffect, useState} from "react";
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {goBack} from "../../backend/CommonMethods";
import {StatusBar} from "expo-status-bar";



export default function GuideScreen({navigation, route}) {
  useEffect(() => {
    navigation.getParent().setOptions({tabBarStyle: {display: 'none'}});
    return () => {
      navigation.getParent().setOptions({tabBarStyle: {height: 65, borderTopLeftRadius: 10, borderTopRightRadius: 10}});
    };
  }, []);
  const [sliderState, setSliderState] = useState({currentPage: 0});

  const setSliderPage = (event: any) => {
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
          {/* General guide*/}
          <View style={[{width, height}]}>
            <Text style={styles.guideTitle}>Przewodnik po aplikacji</Text>
            <Text style={styles.guideDescription}>
              Aplikacja składa się z czterech głównych funkcjonalności:
            </Text>
            <View style={styles.guideList}>
              <Text style={styles.guideItem}>• wyszukiwarka</Text>
              <Text style={styles.guideItem}>• wybory</Text>
              <Text style={styles.guideItem}>• ekran główny</Text>
              <Text style={styles.guideItem}>• więcej</Text>
            </View>
          </View>

          {/* Search screen guide*/}
          <View style={{width, height}}>
            <View style={styles.ratingContainer}>
              <Text style={styles.sectionTitle}>🔍 Wyszukiwarka Polityków:</Text>
              <Text style={styles.sectionDescription}>
                Przypisz ocenę politykowi, wyrażając swoje emocje na temat jego działań.
                Wybierz od 1 do 5 gwiazdek, aby wyrazić swoje odczucia. Twoja opinia ma znaczenie!
              </Text>
            </View>
          </View>

          {/* Election screen guide*/}
          <View style={{width, height}}>
            <Text style={styles.sectionTitle}>📄 Wyborcze ABC</Text>
            <Text style={styles.sectionDescription}>
              W tym miejscu znajdziesz wszystkie podstawowe informacje na temat nadchodzących wyborów.
              Zapewniamy Ci dostęp do dat, sprawdzenia swojego okręgu wyborczego oraz kalkulatora mandatów.
            </Text>
          </View>

          {/* Main Screen guide*/}
          <View style={{width, height}}>
            <Text style={styles.sectionTitle}>Ekran Główny</Text>
            <Text style={styles.sectionDescription}>
              Na ekranie głównym wyświetlani są politycy, którzy w danym momencie cieszą się największą popularnością
              wśród naszych użytkowników.
            </Text>
            <Text style={styles.sectionDescription}>
              (Na dobre i na złe)
            </Text>
          </View>

          {/* Extras screen guide*/}
          <View style={{width, height}}>
            <Text style={styles.sectionTitle}>≡ Więcej</Text>
            <Text style={styles.sectionDescription}>
              Odnośniki do ustawień, podsumowania ocen i innych funkcji.
            </Text>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                navigation.popToTop();
              }}
            >
              <Text style={styles.buttonText}>Zaczynamy!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Pagination dots*/}
        <View style={styles.paginationWrapper}>
          {Array.from(Array(5).keys()).map((key, index) => (
            <View
              style={[
                styles.paginationDots,
                {opacity: sliderState.currentPage === index ? 1 : 0.2},
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
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  guideDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  guideList: {
    width: '100%',
    paddingHorizontal: 10,
  },
  guideItem: {
    fontSize: 16,
    color: '#444',
    marginVertical: 5,
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
    backgroundColor: '#005BB5',  // Niebieskie tło przycisku
    borderRadius: 30,  // Zaokrąglone rogi
    paddingVertical: 15,  // Wysokość przycisku
    paddingHorizontal: 40,  // Szerokość przycisku
    alignItems: 'center',  // Wyrównanie tekstu
    justifyContent: 'center',  // Centrowanie
    elevation: 5,  // Cień dla Androida
    shadowColor: '#000',  // Cień dla iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Kolor tekstu przycisku
    textAlign: 'center',
  },
});