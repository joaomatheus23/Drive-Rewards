import type { UserRole } from "@driven-rewards/shared";
import { router } from "expo-router";

export function navigateByRole(role: UserRole): void {
  if (role === "partner_staff") {
    router.replace("/(staff)/scanner");
    return;
  }
  router.replace("/(driver)");
}
