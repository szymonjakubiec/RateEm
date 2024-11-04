import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import * as Location from "expo-location";
import { getUserAddress } from "../../backend/GetAddress";
import { getSejmDistrict } from "../../backend/database/Districts";

export default function ElectoralDistricts() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [district, setDistrict] = useState(null);

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
    var powiatName = adderssData.results[0].address_components[3].long_name.toString().split("Powiat ")[1];
    setAddress(powiatName);

    const districtData = (await getSejmDistrict(powiatName))[0];
    setDistrict(districtData.district_number);
    console.log(districtData);

    // ogarnąć zagranice i morze
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {location ? (
          <View>
            <Text>
              Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
            </Text>
            <Text>SEJM</Text>
            <Text>District name: {address}</Text>
            <Text>District number: {district}</Text>
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
