import {useState, useEffect} from "react";
import {StyleSheet, Text, View} from "react-native";
import * as Location from "expo-location";
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps";
import {getUserAddress, tabBarAnim} from "../../backend/CommonMethods";
import {getSejmDistrict, getEuDistrict} from "../../backend/database/Districts";
import _Container from "../styles/Container";
import {ActivityIndicator, useTheme} from "react-native-paper";



export default function ElectoralDistricts({navigation}) {
  const [addressCurrent, setAddressCurrent] = useState('');
  const [sejmDistrictCurrent, setSejmDistrictCurrent] = useState("");
  const [euDistrictCurrent, setEuDistrictCurrent] = useState("");

  const [mapComponent, setMapComponent] = useState();

  const theme = useTheme();

  // PK: Hide bottom TabBar
  useEffect(() => {
    return tabBarAnim(navigation);
  }, []);

  useEffect(() => {
    (async () => {
      setMapComponent(await createMap());
    })();
  }, []);

  const requestLocationPermission = async () => {
    const {status} = await Location.requestForegroundPermissionsAsync();

    return status === "granted";
  };

  const handleGettingDistrict = async () => {
    const permissionResponse = await requestLocationPermission();
    let locationTemp;

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

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  async function onLocationMapChange(location) {
    try {
      setAddressCurrent("Ładowanie...");
      setSejmDistrictCurrent("Ładowanie...");
      setEuDistrictCurrent("Ładowanie...");

      const result = await getAddress(parseFloat(location.latitude.toFixed(5)), parseFloat(location.longitude.toFixed(5)));

      setAddressCurrent(result.address);
      setSejmDistrictCurrent(result.sejmDistrict);
      setEuDistrictCurrent(result.euDistrict);
    } catch (error) {
      setAddressCurrent("błąd");
      setSejmDistrictCurrent("");
      setEuDistrictCurrent("");
    }
  }

  async function getAddress(latitude, longitude) {
    try {
      const addressData = await getUserAddress(latitude, longitude);
      const countyName = getCountryName(addressData);
      let powiatName = getPowiatName(addressData);

      if (countyName === "PL") {
        if (powiatName !== "") {
          const sejmDistrictData = (await getSejmDistrict(powiatName))[0];
          const euDistrictData = (await getEuDistrict(powiatName))[0];

          if (sejmDistrictData.powiat_name === "Zagranica" || euDistrictData.powiat_name === "Zagranica") {
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
      } else if (countyName === "") {
        return {address: "Teren morski", sejmDistrict: 19, euDistrict: 4};
      } else {
        return {address: "Za granicą", sejmDistrict: 19, euDistrict: 4};
      }
    } catch (error) {
      return {address: "błąd", sejmDistrict: 0, euDistrict: 0};
    }
  }

  const getCountryName = (addressData) => {
    let returnValue = "";
    addressData.results.map((oneAddress) => {
      oneAddress.address_components.map((element) => {
        if (element.types[0] === "country") {
          returnValue = element.short_name;
        }
      });
    });
    return returnValue;
  };

  const getPowiatName = (addressData) => {
    let returnValue = "";
    addressData.results.map((oneAddress) => {
      oneAddress.address_components.map((element) => {
        if (element.types[0] === "administrative_area_level_2") {
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
    const locationMap = await handleGettingDistrict();

    if (locationMap != null) {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          region={locationMap}
          showsCompass={true}
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

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: "4%",
      paddingTop: "15%",
      justifyContent: "flex-start",
    },
    tile: {
      backgroundColor: theme.colors.primary,
      width: "95%",
      minHeight: 300,
      padding: 25,
      borderRadius: 15,
      justifyContent: "center",
      elevation: 10,
      shadowColor: theme.colors.shadow,
      shadowOffset: {width: 2, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    text: {
      color: theme.colors.onPrimary,
      fontSize: 24,
    },
    powiat: {
      fontSize: 22,
      marginBottom: 10,
    },
    sejmEURow: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    sejmEU: {
      width: "23%",
      fontSize: 18,
    },
    textBlock: {
      marginTop: 20,
      backgroundColor: theme.colors.onSurfaceVariant,
      padding: 15,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    map: {
      width: "100%",
      height: 300,
    },
  });

  return (
    <_Container style={styles.container}>
      <View style={styles.tile}>
        <View>{mapComponent}</View>
        {mapComponent ? (<>
          <View style={styles.textBlock}>
            <Text
              style={[styles.text, styles.powiat]}>{
              addressCurrent !== "Za granicą" && addressCurrent !== "Teren morski" && addressCurrent !== "Ładowanie..."
                ? `Powiat ${addressCurrent}` : addressCurrent}</Text>
            <View style={styles.sejmEURow}>
              <Text style={[styles.text, styles.sejmEU]}>SEJM:</Text>
              <Text style={styles.text}>{sejmDistrictCurrent}</Text>
            </View>
            <View style={styles.sejmEURow}>
              <Text style={[styles.text, styles.sejmEU]}>EU:</Text>
              <Text style={styles.text}>{euDistrictCurrent}</Text>
            </View>
          </View>
        </>) : (
          <ActivityIndicator animating={true} color={theme.colors.onPrimary} size={45}/>
        )}
      </View>
    </_Container>
  );


}



