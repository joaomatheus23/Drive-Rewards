/**
 * DriverLayout
 * Role: driver
 * Entry: successful login as driver
 * Exit: driver tab screens
 */
import { Tabs, useSegments } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DriverTabBar } from "../../components/layout/DriverTabBar";
import { Colors } from "../../theme";

export default function DriverLayout() {
  const segments = useSegments();
  const hideTabBar = segments.some((segment) => segment === "qr");

  return (
    <GestureHandlerRootView style={styles.root}>
      <Tabs
      tabBar={(props) =>
        hideTabBar ? null : (
          <DriverTabBar
            state={props.state}
            navigation={props.navigation}
          />
        )
      }
      screenOptions={{
        headerShown: false,
        sceneStyle: styles.screen,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="session" options={{ title: "Session" }} />
      <Tabs.Screen name="coupons" options={{ title: "Coupons" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  screen: {
    backgroundColor: Colors.bg,
  },
});
