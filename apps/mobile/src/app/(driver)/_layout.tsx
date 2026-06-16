/**
 * DriverLayout
 * Role: driver
 * Entry: successful login as driver
 * Exit: driver tab screens
 */
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { DriverTabBar } from "../../components/layout/DriverTabBar";
import { Colors } from "../../theme";

export default function DriverLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <DriverTabBar
          state={props.state}
          navigation={props.navigation}
        />
      )}
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
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.bg,
  },
});
