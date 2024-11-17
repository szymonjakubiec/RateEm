import { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableHighlight, Linking, Alert, AppState } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { getUserAddress } from "../../backend/GetAddress";
import { getSejmDistrict, getEuDistrict } from "../../backend/database/Districts";

export default function ElectoralDistricts() {
  // const [appState, setAppState] = useState(AppState.currentState);

  const [refreshing, setRefreshing] = useState(false);
  // const [locationCurrent, setLocationCurrent] = useState(null);
  const [addressCurrent, setAddressCurrent] = useState(null);
  const [sejmDistrictCurrent, setSejmDistrictCurrent] = useState("");
  const [euDistrictCurrent, setEuDistrictCurrent] = useState("");
  const [locationMap, setLocationMap] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const [mapComponent, setMapComponent] = useState(null);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    setMapComponent(createMap());
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState == "active") {
      handleGettingDistrict();
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status == "granted") {
      setLocationPermission(true);
      return true;
    } else {
      setLocationPermission(false);
      return false;
    }
  };

  const requestLocationPermissionAgain = async () => {
    Alert.alert(
      "Location Permission Required",
      "Please go to your device settings to allow location access.",
      [
        {
          text: "Open Settings",
          onPress: async () => {
            try {
              await Linking.openSettings();
            } catch (err) {
              console.error("Error opening settings:", err);
            }
          },
        },
        {
          text: "Cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleGettingDistrict = async () => {
    var permissionResponse = await requestLocationPermission();
    var locationTemp;

    if (permissionResponse) {
      locationTemp = await Location.getCurrentPositionAsync({});

      const result = await getAddress(parseFloat(locationTemp.coords.latitude.toFixed(5)), parseFloat(locationTemp.coords.longitude.toFixed(5)));
      setAddressCurrent(result.address);
      setSejmDistrictCurrent(result.sejmDistrict);
      setEuDistrictCurrent(result.euDistrict);

      setRefreshing(false);
      return { latitude: parseFloat(locationTemp.coords.latitude.toFixed(5)), longitude: parseFloat(locationTemp.coords.longitude.toFixed(5)) };
    }
  };

  function setMapLocation(location) {
    setLocationMap({ latitude: parseFloat(location.latitude.toFixed(5)), longitude: parseFloat(location.longitude.toFixed(5)) });
  }

  async function onLocationMapChange(location) {
    const result = await getAddress(parseFloat(location.latitude), parseFloat(location.longitude));
    setAddressCurrent(result.address);
    setSejmDistrictCurrent(result.sejmDistrict);
    setEuDistrictCurrent(result.euDistrict);
  }

  const getAddress = async (latitude, longitude) => {
    try {
      const adderssData = await getUserAddress(latitude, longitude);
      var countyName = getCountryName(adderssData);
      var powiatName = getPowiatName(adderssData);

      if (countyName == "PL") {
        if (powiatName != "") {
          const sejmDistrictData = (await getSejmDistrict(powiatName))[0];
          const euDistrictData = (await getEuDistrict(powiatName))[0];

          if (sejmDistrictData.powiat_name == "Zagranica" || euDistrictData.powiat_name == "Zagranica") {
            powiatName = "Zagranica";
          }
          return { address: powiatName, sejmDistrict: sejmDistrictData.district_number, euDistrict: euDistrictData.district_number };
        } else {
          return { address: "błąd", sejmDistrict: 0, euDistrict: 0 };
        }
      } else if (countyName == "") {
        return { address: "Morze", sejmDistrict: 19, euDistrict: 4 };
      } else {
        return { address: "Zagranica", sejmDistrict: 19, euDistrict: 4 };
      }
    } catch (error) {
      return { address: "błąd", sejmDistrict: 0, euDistrict: 0 };
    }
  };

  const getCountryName = (adderssData) => {
    var returnValue = "";
    adderssData.results.map((oneAdderss) => {
      oneAdderss.address_components.map((element) => {
        if (element.types[0] == "country") {
          returnValue = element.short_name;
        }
      });
    });
    return returnValue;
  };

  const getPowiatName = (adderssData) => {
    var returnValue = "";
    adderssData.results.map((oneAdderss) => {
      oneAdderss.address_components.map((element) => {
        if (element.types[0] == "administrative_area_level_2") {
          if (element.long_name.toString().includes("Powiat")) {
            element.long_name = element.long_name.toString().replace("Powiat ", "");
            returnValue = element.long_name;
          }
        }
      });
    });
    return returnValue;
  };

  async function createMap() {
    var locationMap = await handleGettingDistrict();

    if (locationMap != null) {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          region={locationMap}
          onRegionChange={setMapLocation}
          initialRegion={{
            latitude: locationMap.latitude,
            longitude: locationMap.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          style={styles.map}
        />
      );
    } else {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          region={locationMap}
          onRegionChange={setMapLocation}
          initialRegion={{
            latitude: 50.25962,
            longitude: 19.021725,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          style={styles.map}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.districtElementMap}>
          {mapComponent}
          {locationMap ? (
            <View>
              <Text style={styles.districtElementText}>
                Latitude: {locationMap.latitude.toFixed(5)}, Longitude: {locationMap.longitude.toFixed(5)}
              </Text>
              <Text style={styles.districtElementText}>Powiat name: {addressCurrent}</Text>
              <Text style={styles.districtElementText}>SEJM District number: {sejmDistrictCurrent}</Text>
              <Text style={styles.districtElementText}>EU District number: {euDistrictCurrent}</Text>
              <TouchableHighlight onPress={() => onLocationMapChange(locationMap)} style={styles.applyButton}>
                <Text>apply</Text>
              </TouchableHighlight>
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

  applyButton: {
    backgroundColor: "#ffffff",
    padding: 10,
    alignItems: "center",
  },
});
