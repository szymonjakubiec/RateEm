import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../nav/GlobalContext";
import {getTrendingPoliticians} from "../../backend/database/Politicians";
import {SelectList} from "react-native-dropdown-select-list";



const BottomTab = createBottomTabNavigator();

export default function TrendingScreen({navigation}) {
  // const {userId} = useContext(GlobalContext);
  const {width} = Dimensions.get('window'); // screen width

  const timePeriods = [
    {key: 1, value: "dzisiaj"},
    {key: 7, value: "tydzień"},
    {key: 30, value: "miesiąc"},
    {key: 90, value: "3 miesiące"},
  ];
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("dzisiaj");
  const [dropdownTimePeriodVisible, setDropdownTimePeriodVisible] = useState(false);
  
  // const [selectedPolitician, setSelectedPolitician] = useState(null);
  const [trending, setTrending] = useState([]);
  const [sliderState, setSliderState] = useState({currentPage: 0});
  
  const numberOfResults = [
    {key: 3, value: 3},
    {key: 5, value: 5},
    {key: 10, value: 10},
  ];
  const [selectedNumberOfResults, setSelectedNumberOfResults] = useState(10);

  // User selections
  const [numberOfPoliticians, setNumberOfPoliticians] = useState(3); // default to 3
  const [days, setDays] = useState(30); // default to 30 days
  const [dropdownResultsVisible, setDropdownResultsVisible] = useState(false);

  useEffect(() => {
    async function fetchRatings() {
      const fetchedRatings = await getTrendingPoliticians(numberOfPoliticians, days);
      setTrending(fetchedRatings);
    }

    fetchRatings();
  }, [numberOfPoliticians, days]); // Rerun effect when selections change

  const setSliderPage = (event) => {
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

  const renderRatingItem = ({item}) => (
    <View style={styles.ratingContainer}>
      <View style={[styles.item, {width}]}>
        <TouchableOpacity
          style={styles.ratingItem}
          onPress={() => handlePoliticianClick(item)}
        >
          <Image
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
              // uri: item.picture,
              cache: "force-cache",
            }}
            style={styles.ratingImage}
          />
          <Text style={styles.ratingItemText}>
            {item.names_surname}
          </Text>
          <Text style={styles.ratingScore}>
            {item.global_rating ? item.global_rating.toFixed(2) : '—'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handlePoliticianClick = (item) => {
    const selectedPoliticianId = item.id;
    navigation.navigate("Profile", {
      selectedPoliticianId,
    });
  };

  

  
  
  const TimePeriodItem = ({item}) => {
    function onTimePeriodSelect() {
      setSelectedTimePeriod(item.value);
      setDropdownTimePeriodVisible(false);
      setDays(item.key);
      console.log(item.value);
    }
    
    return(
      <TouchableHighlight style={styles.timePeriodItem} onPress={onTimePeriodSelect}>
        <Text>{item.value}</Text>
      </TouchableHighlight>
    );
  }

  const ResultsItem = ({item}) => {
    function onResultsSelect() {
      setSelectedNumberOfResults(item.value);
      setDropdownResultsVisible(false);
      setNumberOfPoliticians(item.key);
      console.log(item.value);
    }
    
    return(
      <TouchableHighlight style={styles.timePeriodItem} onPress={onResultsSelect}>
        <Text>{item.value}</Text>
      </TouchableHighlight>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Politycy na czasie</Text>
        <View style={styles.filterLine}>
          <Text style={styles.setting}>Filtruj według: </Text>
          
          <View>
            <TouchableHighlight style={styles.dropdownBox} onPress={() => setDropdownTimePeriodVisible(!dropdownTimePeriodVisible)} >
              <Text>{selectedTimePeriod}</Text>
            </TouchableHighlight>
            {dropdownTimePeriodVisible && ( <FlatList
                data={timePeriods}
                renderItem={({item}) => (<TimePeriodItem item={item} />)}
                keyExtractor={(item) => item.key}
                style={styles.flatList}
              />
            )}
            
          </View>
        </View>

        <View style={styles.filterLine}>
          <Text style={styles.setting}>Ilość polityków:</Text>

          <View>
            <TouchableHighlight style={styles.dropdownBox} onPress={() => setDropdownResultsVisible(!dropdownResultsVisible)} >
              <Text>{numberOfPoliticians}</Text>
            </TouchableHighlight>
            {dropdownResultsVisible && ( <FlatList
                data={numberOfResults}
                renderItem={({item}) => (<ResultsItem item={item} />)}
                keyExtractor={(item) => item.key}
                style={styles.flatList}
              />
            )}

          </View>
        </View>
      </View>

      {/* Politicians List */}
      {trending.length > 0 ? (
        <View style={styles.ratingContainer}>
          <FlatList
            data={trending}
            renderItem={renderRatingItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.scrollContainer}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={setSliderPage}
            scrollEventThrottle={16}
            bounces={true}
          />
          <View style={styles.paginationWrapper}>
            {Array.from(Array(trending.length).keys()).map((key, index) => (
              <View
                style={[
                  styles.paginationDots,
                  {
                    backgroundColor: sliderState.currentPage === index ? '#26518a' : '#d3d3d3',
                    transform: sliderState.currentPage === index ? [{scale: 1.2}] : [{scale: 1}],
                  },
                ]}
                key={index}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.container, styles.container]}>
          <Text style={{fontSize: 20}}>Wygląda na to, że nie udało się pobrać tych danych. Sprawdź swoje połączenie z
            internetem!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 75,
    // backgroundColor: '#F9FAFB',
    // padding: 30,
    // marginTop: 170,
    // backgroundColor: "blue",
    // height: "100%",
  },
  inputContainer: {
    // MaxHeight: "40%",
    paddingVertical: 15,
    // paddingHorizontal: 60,
    // marginBottom: 20,
    width: '65%',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    alignSelf: "center",
    marginBottom: 15,
  },
  filterLine: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "#afe86a",
    paddingVertical: 5,
  },
  setting:{
    fontSize: 16,
    fontWeight: "600"
  },
  flatList: {
    display: "flex",
    backgroundColor: "#fff",
    position: "absolute",
    zIndex: 1,
    top: 25,
    borderWidth: 1
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: "35%",
  },
  timePeriodItem: {
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: "100%",
  },
  // inputLabel: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   marginBottom: 5,
  // },
  // inputField: {
  //   height: 40,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   marginBottom: 20,
  //   paddingHorizontal: 10,
  //   fontSize: 16,
  // },
  ratingContainer: {
    flex: 1,
    display: "flex",
    alignItems: 'center',
    paddingBottom: 25,
    backgroundColor: '#f8f9fa',
  },
  item: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  ratingItem: {
    alignItems: 'center',
    padding: 15,
  },
  ratingImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: '#d3d3d3',
    borderWidth: 2,
  },
  ratingItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    height: 20,
  },
  paginationDots: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: '#d3d3d3',
    transition: 'transform 0.2s ease-in-out',
  },
});
