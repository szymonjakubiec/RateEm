import {Animated, Keyboard, SafeAreaView} from "react-native";
import {useEffect, useRef} from "react";
import {useTheme} from "react-native-paper";



/**
 * Moves children when keyboard is open.
 * @param {number} [margin=100] - how many pixels to move from top.
 * @param {any} children - Children structure wrapped in animated view (not passed as parameter).
 * @returns {JSX.Element}
 */
export default function _AnimViewKeyboard({margin = 100, children}) {

  // PK: To add padding when keyboard is shown
  const marginTopAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(marginTopAnim, {
        toValue: margin,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(marginTopAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [marginTopAnim]);


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: useTheme().colors.background}}>
      <Animated.View style={{
        flex: 1,
        backgroundColor: useTheme().colors.background,
        marginTop: marginTopAnim
      }}>{children}</Animated.View>
    </SafeAreaView>
  );
}
