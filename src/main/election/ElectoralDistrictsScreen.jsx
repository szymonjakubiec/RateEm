import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import * as Location from "expo-location";
import { getUserAddress } from "../../backend/GetAddress";
import { getSejmDistrict, getEuDistrict } from "../../backend/database/Districts";

export default function ElectoralDistricts() {
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [sejmDistrict, setSejmDistrict] = useState("");
  const [euDistrict, setEuDistrict] = useState("");

  useEffect(() => {
    handleGettingDistrict();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return;
    }
  };

  const handleGettingDistrict = async () => {
    await requestLocationPermission();

    const locationTemp = await Location.getCurrentPositionAsync({});
    setLocation(locationTemp);
    getAddress(locationTemp);

    setRefreshing(false);
  };

  const getAddress = async (loc) => {
    const adderssData = await getUserAddress(loc.coords.latitude, loc.coords.longitude);
    if (adderssData.results.length > 0) {
      var powiatName = adderssData.results[0].address_components[3].long_name.toString().split("Powiat ")[1];
      setAddress(powiatName);

      const sejmDistrictData = (await getSejmDistrict(powiatName))[0];
      setSejmDistrict(sejmDistrictData.district_number);

      const euDistrictData = (await getEuDistrict(powiatName))[0];
      setEuDistrict(euDistrictData.district_number);

      if (sejmDistrictData.powiat_name == "Zagranica" || euDistrictData.powiat_name == "Zagranica") {
        setAddress("Zagranica");
      }
    } else {
      setAddress("Morze");
      setSejmDistrict(19);
      setEuDistrict(4);
    }
  };

  // biguny XD
  // wyszukanie miasta

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleGettingDistrict}
            tintColor="#333"
            colors={["#ff0000", "#00ff00", "#0000ff"]}
            progressViewOffset={10}
          />
        }
      >
        <View style={styles.districtElement}>
          {location ? (
            <View>
              <Text style={styles.districtElementText}>
                Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
              </Text>
              <Text style={styles.districtElementText}>Powiat name: {address}</Text>
              <Text style={styles.districtElementText}>SEJM District number: {sejmDistrict}</Text>
              <Text style={styles.districtElementText}>EU District number: {euDistrict}</Text>
            </View>
          ) : (
            <Text style={styles.districtElementText}>Fetching location...</Text>
          )}
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

  districtElement: {
    backgroundColor: "#000",
    width: "100%",
    padding: 15,
    borderRadius: 20,
    justifyContent: "center",
  },

  districtElementText: {
    color: "#ffffff",
  },
});
