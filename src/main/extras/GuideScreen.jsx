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



export default function GuideScreen({navigation}) {
  useEffect(() => {
    navigation.getParent().setOptions({tabBarStyle: {display: 'none'}});
    return () => {
      navigation.getParent().setOptions({tabBarStyle: null}); // Przywróć domyślny styl po opuszczeniu
    };
  }, []);
  const [sliderState, setSliderState] = useState({currentPage: 0});

  const setSliderPage = (event: any) => {
    const {currentPage} = sliderState;
    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
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
          <View style={{width, height}}>
            <Text>Przewodnik po aplikacji</Text>
            <Text>
              Aplikacja składa się z czterech głównych funkcjonalności:
            </Text>
            <Text>• wyszukiwarka</Text>
            <Text>• wybory</Text>
            <Text>• tablica</Text>
            <Text>• więcej</Text>
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
            <View style={[styles.paginationDots, {opacity: pageIndex === index ? 1 : 0.2}]} key={index}/>
          ))}
        </View>
      </SafeAreaView>
    </>
    //   <ScrollView contentContainerStyle={styles.container}>
    //     <Text style={styles.title}>Przewodnik po aplikacji</Text>
    //
    //     <Text style={styles.description}>
    //       Aplikacja składa się z czterech głównych funkcjonalności:
    //     </Text>
    //     <Text style={styles.listItem}>• wyszukiwarka</Text>
    //     <Text style={styles.listItem}>• wybory</Text>
    //     <Text style={styles.listItem}>• tablica</Text>
    //     <Text style={styles.listItem}>• więcej</Text>
    //
    //     <TouchableOpacity
    //       style={styles.section}
    //       onPress={() => {
    //         navigation.navigate("SearchNav");
    //         navigation.pop();
    //       }}
    //     >
    //     </TouchableOpacity>
    //
    //     <TouchableOpacity
    //       style={styles.section}
    //       onPress={() => {
    //         navigation.navigate("Election");
    //         navigation.pop();
    //       }}
    //     >
    //       <Text style={styles.sectionTitle}>📄 Wyborcze ABC</Text>
    //       <Text style={styles.sectionDescription}>
    //         Miejsce, w którym znajdują się wszystkie podstawowe informacje o
    //         wyborach.
    //       </Text>
    //     </TouchableOpacity>
    //
    //     <TouchableOpacity
    //       style={styles.section}
    //       onPress={() => {
    //         navigation.navigate("Trending");
    //         navigation.pop();
    //       }}
    //     >
    //       <Text style={styles.sectionTitle}>📰 Tablica</Text>
    //       <Text style={styles.sectionDescription}>
    //         Tu wyświetlane są posty z social mediów osób, które obserwujesz.
    //       </Text>
    //     </TouchableOpacity>
    //
    //     <TouchableOpacity
    //       style={styles.section}
    //       onPress={() => navigation.goBack()}
    //     >
    //       <Text style={styles.sectionTitle}>≡ Więcej</Text>
    //       <Text style={styles.sectionDescription}>
    //         Odnośniki do ustawień, podsumowania ocen i innych funkcji.
    //       </Text>
    //     </TouchableOpacity>
    //   </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 20,
  },
  section: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#0898A0',
    marginLeft: 10,
  },
});
