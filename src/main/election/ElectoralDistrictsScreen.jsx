import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { getUserAddress } from "../../backend/GetAddress";
import { getSejmDistrict, getEuDistrict } from "../../backend/database/Districts";

export default function ElectoralDistricts() {
  const [refreshing, setRefreshing] = useState(false);
  const [locationCurrent, setLocationCurrent] = useState(null);
  const [addressCurrent, setAddressCurrent] = useState(null);
  const [sejmDistrictCurrent, setSejmDistrictCurrent] = useState("");
  const [euDistrictCurrent, setEuDistrictCurrent] = useState("");

  const [locationMap, setLocationMap] = useState(null);
  const [addressMap, setAddressMap] = useState(null);
  const [sejmDistrictMap, setSejmDistrictMap] = useState("");
  const [euDistrictMap, setEuDistrictMap] = useState("");

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
    setLocationCurrent({
      latitude: parseFloat(locationTemp.coords.latitude.toFixed(5)),
      longitude: parseFloat(locationTemp.coords.longitude.toFixed(5)),
    });
    const result = await getAddress(parseFloat(locationTemp.coords.latitude.toFixed(5)), parseFloat(locationTemp.coords.longitude.toFixed(5)));
    setAddressCurrent(result.address);
    setSejmDistrictCurrent(result.sejmDistrict);
    setEuDistrictCurrent(result.euDistrict);

    setRefreshing(false);
  };

  async function onLocationMapChange(location) {
    setLocationMap({ latitude: parseFloat(location.latitude.toFixed(5)), longitude: parseFloat(location.longitude.toFixed(5)) });
    const result = await getAddress(parseFloat(location.latitude.toFixed(5)), parseFloat(location.longitude.toFixed(5)));
    setAddressMap(result.address);
    setSejmDistrictMap(result.sejmDistrict);
    setEuDistrictMap(result.euDistrict);
  }

  // problem z zebraniem adresu => mówi że zagranica
  const getAddress = async (latitude, longitude) => {
    try {
      const adderssData = await getUserAddress(latitude, longitude);
      if (adderssData.results[0].address_components[3].long_name) {
        var powiatName = adderssData.results[0].address_components[3].long_name.toString().split("Powiat ")[1];

        const sejmDistrictData = (await getSejmDistrict(powiatName))[0];
        const euDistrictData = (await getEuDistrict(powiatName))[0];

        if (sejmDistrictData.powiat_name == "Zagranica" || euDistrictData.powiat_name == "Zagranica") {
          powiatName = "Zagranica";
        }
        return { address: powiatName, sejmDistrict: sejmDistrictData.district_number, euDistrict: euDistrictData.district_number };
      } else {
        return { address: "Morze", sejmDistrict: 19, euDistrict: 4 };
      }
    } catch (error) {
      return { address: "Zagranica", sejmDistrict: 19, euDistrict: 4 };
    }
  };

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
          <Text style={styles.districtElementText}>CURRENT LOCATION</Text>
          {locationCurrent ? (
            <View>
              <Text style={styles.districtElementText}>
                Latitude: {locationCurrent.latitude}, Longitude: {locationCurrent.longitude}
              </Text>
              <Text style={styles.districtElementText}>Powiat name: {addressCurrent}</Text>
              <Text style={styles.districtElementText}>SEJM District number: {sejmDistrictCurrent}</Text>
              <Text style={styles.districtElementText}>EU District number: {euDistrictCurrent}</Text>
            </View>
          ) : (
            <Text style={styles.districtElementText}>Fetching location...</Text>
          )}
        </View>

        <View style={styles.districtElementMap}>
          <Text style={styles.districtElementText}>PICEKD LOCATION</Text>
          <MapView
            provider={PROVIDER_GOOGLE}
            region={locationMap}
            onRegionChange={onLocationMapChange}
            initialRegion={{
              latitude: 50.25962,
              longitude: 19.021725,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            style={styles.map}
          />
          {locationMap ? (
            <View>
              <Text style={styles.districtElementText}>
                Latitude: {locationMap.latitude}, Longitude: {locationMap.longitude}
              </Text>
              <Text style={styles.districtElementText}>Powiat name: {addressMap}</Text>
              <Text style={styles.districtElementText}>SEJM District number: {sejmDistrictMap}</Text>
              <Text style={styles.districtElementText}>EU District number: {euDistrictMap}</Text>
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
    minHeight: 400,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "4%",
  },

  scrollView: {
    width: "100%",
    minHeight: 400,
    height: "100%",
    marginHorizontal: 20,
  },

  districtElement: {
    backgroundColor: "#000",
    width: "100%",
    padding: 15,
    marginTop: 20,
    borderRadius: 20,
    justifyContent: "center",
  },

  districtElementMap: {
    backgroundColor: "#000",
    width: "100%",
    minHeight: 300,
    padding: 15,
    marginTop: 20,
    borderRadius: 20,
    justifyContent: "center",
  },

  districtElementText: {
    color: "#ffffff",
  },

  map: {
    width: "100%",
    height: 300,
  },
});
