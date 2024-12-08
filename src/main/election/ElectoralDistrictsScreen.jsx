import {useState, useEffect} from "react";
import {StyleSheet, Text, View, ScrollView, Linking, Alert, AppState, LayoutAnimation} from "react-native";
import * as Location from "expo-location";
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps";
import {getUserAddress, tabBarAnim} from "../../backend/CommonMethods";
import {getSejmDistrict, getEuDistrict} from "../../backend/database/Districts";
import _Container from "../styles/Container";



export default function ElectoralDistricts({navigation}) {
  const [addressCurrent, setAddressCurrent] = useState(null);
  const [sejmDistrictCurrent, setSejmDistrictCurrent] = useState("");
  const [euDistrictCurrent, setEuDistrictCurrent] = useState("");
  const [locationMap, setLocationMap] = useState(null);

  const [mapComponent, setMapComponent] = useState(null);

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  useEffect(() => {
    setMapComponent(createMap());
  }, []);

  const requestLocationPermission = async () => {
    const {status} = await Location.requestForegroundPermissionsAsync();

    if (status == "granted") {
      return true;
    } else {
      return false;
    }
  };

  const handleGettingDistrict = async () => {
    var permissionResponse = await requestLocationPermission();
    var locationTemp;

    if (permissionResponse) {
      locationTemp = await Location.getCurrentPositionAsync({});
    } else {
      locationTemp = {coords: {latitude: 50.25962, longitude: 19.021725}};
    }

    const result = await getAddress(parseFloat(locationTemp.coords.latitude.toFixed(5)), parseFloat(locationTemp.coords.longitude.toFixed(5)));
    setAddressCurrent(result.address);
    setSejmDistrictCurrent(result.sejmDistrict);
    setEuDistrictCurrent(result.euDistrict);

    return {
      latitude: parseFloat(locationTemp.coords.latitude.toFixed(5)),
      longitude: parseFloat(locationTemp.coords.longitude.toFixed(5)),
    };
  };

  function setMapLocation(location) {
    try {
      setLocationMap({
        latitude: parseFloat(location.latitude.toFixed(5)),
        longitude: parseFloat(location.longitude.toFixed(5)),
      });
    } catch (error) {
      setLocationMap({latitude: 50.25962, longitude: 19.021725});
    }
  }

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  async function onLocationMapChange(location) {
    try {
      setAddressCurrent("Ładowanie");
      setSejmDistrictCurrent("Ładowanie");
      setEuDistrictCurrent("Ładowanie");

      const result = await getAddress(parseFloat(location.latitude.toFixed(5)), parseFloat(location.longitude.toFixed(5)));

      setAddressCurrent(result.address);
      setSejmDistrictCurrent(result.sejmDistrict);
      setEuDistrictCurrent(result.euDistrict);
    } catch (error) {
      setAddressCurrent("błąd");
      setSejmDistrictCurrent(0);
      setEuDistrictCurrent(0);
    }
  }

  async function getAddress(latitude, longitude) {
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
          return {
            address: powiatName,
            sejmDistrict: sejmDistrictData.district_number,
            euDistrict: euDistrictData.district_number,
          };
        } else {
          return {address: "błąd", sejmDistrict: 0, euDistrict: 0};
        }
      } else if (countyName == "") {
        return {address: "Morze", sejmDistrict: 19, euDistrict: 4};
      } else {
        return {address: "Zagranica", sejmDistrict: 19, euDistrict: 4};
      }
    } catch (error) {
      return {address: "błąd", sejmDistrict: 0, euDistrict: 0};
    }
  }

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
          showsCompass={true}
          onRegionChange={setMapLocation}
          onRegionChangeComplete={debounce((region, gesture) => {
            if (gesture.isGesture) {
              onLocationMapChange(region);
            }
          }, 500)}
          showsMyLocationButton={true}
          showsUserLocation={true}
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
          showsCompass={true}
          onRegionChange={setMapLocation}
          onRegionChangeComplete={debounce((region, gesture) => {
            if (gesture.isGesture) {
              onLocationMapChange(region);
            }
          }, 500)}
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
    <_Container style={{padding: "4%"}}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.districtElementMap}>
          <View>{mapComponent}</View>
          <View>
            <Text style={styles.districtElementText}>Powiat: {addressCurrent}</Text>
            <Text style={styles.districtElementText}>Okręg wyborczy - SEJM: {sejmDistrictCurrent}</Text>
            <Text style={styles.districtElementText}>Okręg wyborczy - EU: {euDistrictCurrent}</Text>
          </View>
        </View>
      </ScrollView>
    </_Container>
  );
}

const styles = StyleSheet.create({
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
