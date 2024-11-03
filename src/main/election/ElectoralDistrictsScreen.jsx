import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import * as Location from "expo-location";
import { getUserAddress } from "../../backend/GetAddress";

export default function ElectoralDistricts() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    handleGettingDistrict();
  }, []);

  const handleGettingDistrict = async () => {
    await requestLocationPermission();

    const locationTemp = await Location.getCurrentPositionAsync({});
    setLocation(locationTemp);

    getAddress(locationTemp);
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return;
    }
  };

  const getAddress = async (loc) => {
    const adderssData = await getUserAddress(loc.coords.latitude, loc.coords.longitude);
    // console.log(adderssData.results[0].address_components[3].long_name);
    // setAddress(adderssData.results[0].address_components[3].long_name);

    // brać 'adderssData.results[0].address_components[3].long_name
    // usunąć 'Powiat '
    // wyszukać w tablicy okręgów

    // tablica okręgów:
    // przechodzi przez wszystkie pod strony "https://sejmsenat2023.pkw.gov.pl/sejmsenat2023/pl/sejm/wynik/okr/1" od 1 do 41
    // dodaje do niej powiaty i miasta na prawach powiatów
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {location ? (
          <View>
            <Text>
              Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
            </Text>
            <Text>Address: {address}</Text>
          </View>
        ) : (
          <Text>Fetching location...</Text>
        )}
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
});
