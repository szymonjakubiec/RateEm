import {StyleSheet} from 'react-native';
import {useTheme} from "react-native-paper";



/**
 * TextInput style.
 * @type {{marginVertical: 2, width: "90%"}}
 */
const textInputStyle = StyleSheet.create({
  width: "90%",
  marginVertical: 2,
});


/**
 * TextInput params.
 * @param {string} [error] - error text.
 * @returns {{mode: "outlined", selectTextOnFocus: true, returnKeyType: "next", style: textInputStyle, selectionColor: theme.colors.inversePrimary,
 * selectionHandleColor: theme.colors.primary, cursorColor: theme.colors.primary, outlineColor: theme.colors.error|theme.colors.primary,
 * activeOutlineColor: theme.colors.error|theme.colors.primary}}
 */
export const useTextInputProps = (error) => {
  const theme = useTheme();

  return {
    mode: "outlined",
    selectTextOnFocus: true,
    returnKeyType: "next",

    style: textInputStyle,
    selectionColor: theme.colors.inversePrimary,
    selectionHandleColor: theme.colors.primary,
    cursorColor: theme.colors.primary,

    outlineColor: error ? theme.colors.error : theme.colors.primary,
    activeOutlineColor: error ? theme.colors.error : theme.colors.primary,
  };
};
