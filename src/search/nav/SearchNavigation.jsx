import { createStackNavigator } from "@react-navigation/stack"
import SearchScreen from "../SearchScreen";
import ProfileScreen from "../ProfileScreen";

var Stack = createStackNavigator();

export default function SearchNavigation(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name='Search'
                component={SearchScreen}
                options={() => ({
                  headerTitle: 'PoliTica',
                  headerTitleAlign: 'center',
                  headerLeft: () => null,
                  gestureEnabled: false, // wyłącza swipe back na IOS
                })}
            />
            <Stack.Screen
                name='Profile'
                component={ProfileScreen}
                options={() => ({
                  headerTitle: 'PoliTica',
                  headerTitleAlign: 'center',
                })}
            />
        </Stack.Navigator>
    )
}