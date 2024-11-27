import {StyleSheet} from 'react-native';



const styles = StyleSheet.create({
  textInput: {
    width: "90%",
    marginVertical: 2,
  }
});

export const textInputProps = {
  mode: "outlined",
  activeOutlineColor: "black",
  selectTextOnFocus: true,
  returnKeyType: "next",
  style: styles.textInput,
  selectionColor: "#bc15d279",
  cursorColor: "#b01ec386",
};
