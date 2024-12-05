import {StyleSheet} from 'react-native';
import {useTheme} from "react-native-paper";



const styles = StyleSheet.create({
  textInput: {
    width: "90%",
    marginVertical: 2,
  }
});


export const useTextInputProps = () => {
  const theme = useTheme();

  return {
    mode: "outlined",
    activeOutlineColor: "black",
    selectTextOnFocus: true,
    returnKeyType: "next",
    style: styles.textInput,
    selectionColor: theme.colors.inversePrimary,
    selectionHandleColor: theme.colors.primary,
    cursorColor: theme.colors.primary,
  };
};
