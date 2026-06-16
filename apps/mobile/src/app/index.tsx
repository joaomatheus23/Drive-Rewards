/**
 * Index
 * Role: public
 * Entry: app cold start
 * Exit: login or driver home if session exists
 */
import { Redirect } from "expo-router";
import { useAuthStore } from "../store/auth.store";

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return null;

  if (user?.role === "partner_staff") {
    return <Redirect href="/(staff)/scanner" />;
  }

  if (user) {
    return <Redirect href="/(driver)" />;
  }

  return <Redirect href="/(auth)/login?fromIntro=1" />;
}
