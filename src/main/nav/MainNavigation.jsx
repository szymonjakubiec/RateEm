import {useNavigationState, useRoute} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "../home/HomeScreen";
import ElectionNavigation from "../election/nav/ElectionNavigation";
import SearchNavigation from "../search/nav/SearchNavigation";
import TrendingScreen from "../trending/TrendingScreen";
import ExtrasNavigation from "../extras/nav/ExtrasNavigation";
import {Icon} from "react-native-paper";
import {useEffect} from "react";
import {BackHandler} from "react-native";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
    const route = useRoute();
    const _title = route.params?._title;

    const navigationState = useNavigationState((state) => state);

    useEffect(() => {
        const backAction = () => {
            const currentRoute = navigationState.routes[navigationState.index].name;

            if (currentRoute === "Home") {
                BackHandler.exitApp(); // Exit the app
                return true;
            }

            return false; // Default behavior (navigate back)
        };

        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [navigationState]);

    return (
        <Tab.Navigator
            backBehavior="initialRoute"
            initialRouteName="Home"
            screenOptions={{unmountOnBlur: true}}
        >
            <Tab.Screen
                name="SearchNav"
                component={SearchNavigation}
                initialParams={{_title}}
                options={{
                    title: "Wyszukaj",
                    headerShown: false,
                    gestureEnabled: false,
                    tabBarIcon: () => <Icon source="account-search" size={36}/>,
                    tabBarIconStyle: {top: 1},
                    // tabBarShowLabel: false,
                    // tabBarBadge: "+1"
                }}
            />
            <Tab.Screen
                name="Election"
                component={ElectionNavigation}
                options={{
                    title: "Wybory",
                    headerTitle: _title,
                    headerTitleAlign: "center",
                    headerLeft: () => null,
                    gestureEnabled: false,
                    tabBarIcon: () => (
                        // <Icon source="draw" size={36}/>
                        <Icon source="email-newsletter" size={32}/>
                    ),
                    tabBarIconStyle: {top: 4},
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Strona główna",
                    headerTitle: _title,
                    headerTitleAlign: "center",
                    headerLeft: () => null,
                    gestureEnabled: false,
                    tabBarIcon: () => <Icon source="home" size={36}/>,
                    tabBarIconStyle: {top: 1},
                }}
            />
            <Tab.Screen
                name="Trending"
                component={TrendingScreen}
                options={{
                    title: "Na czasie",
                    headerTitle: _title,
                    headerTitleAlign: "center",
                    headerLeft: () => null,
                    gestureEnabled: false,
                    tabBarIcon: () => <Icon source="trending-up" size={36}/>,
                    tabBarIconStyle: {top: 1},
                }}
            />
            <Tab.Screen
                name="ExtrasNav"
                component={ExtrasNavigation}
                options={{
                    title: "Więcej",
                    headerTitle: _title,
                    headerTitleAlign: "center",
                    headerLeft: () => null,
                    gestureEnabled: false,
                    tabBarIcon: () => <Icon source="menu" size={36}/>,
                    tabBarIconStyle: {top: 2},
                }}
            />
        </Tab.Navigator>
    );
}
