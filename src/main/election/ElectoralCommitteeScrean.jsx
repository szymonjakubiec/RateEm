import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, TextInput } from "react-native";

export default function ElectoralCommittee({navigation}) {
  useEffect(() => {
    navigation.getParent().setOptions({tabBarStyle: {display: 'none'}});
    return () => {
      navigation.getParent().setOptions({tabBarStyle: {height: 65, borderTopLeftRadius: 10,  borderTopRightRadius: 10}});
    };
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text>To komitety wyborcze.</Text>
      </View>
      <ScrollView style={styles.scrollView}></ScrollView>
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
