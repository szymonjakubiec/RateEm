import {useContext, useEffect, useState} from "react";
import {PoliticianNameContext} from "./PoliticianNameContext.jsx";
import SearchFlatList from "./searchScreenComponents/SearchFlatList.jsx";
import _Container from "../styles/Container";



export default function SearchScreen({navigation}) {
  const politicianNameData = useContext(PoliticianNameContext);
  const [selectedPoliticianId, setSelectedPoliticianId] = useState(0);

  function handlePress(selected) {
    setSelectedPoliticianId(selected);
  }

  useEffect(() => {
    setSelectedPoliticianId(0);
  }, []);

  /**
   * Navigation to the ProfileScreen.js after selection of politician.
   */
  useEffect(() => {
    if (selectedPoliticianId > 0) {
      navigation.navigate("Profile", {
        selectedPoliticianId,
      });
      setSelectedPoliticianId(0);
    }
  }, [selectedPoliticianId]);

  return (
    <_Container style={{justifyContent: "flex-start", padding: 0}}>
      <SearchFlatList data={politicianNameData} handleOnPress={handlePress}/>
    </_Container>
  );
}
