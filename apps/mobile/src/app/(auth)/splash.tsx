/**
 * SplashIntro
 * Role: public
 * Entry: legacy cold-start route
 * Exit: redirect → login with intro video
 */
import { Redirect } from "expo-router";

export default function SplashIntroScreen() {
  return <Redirect href="/(auth)/login?fromIntro=1" />;
}
