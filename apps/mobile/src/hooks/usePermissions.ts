import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export interface PermissionFlags {
  location: boolean;
  notifications: boolean;
  camera: boolean;
}

export async function getPermissionStatus(): Promise<PermissionFlags> {
  const [location, notifications, camera] = await Promise.all([
    Location.getForegroundPermissionsAsync(),
    Notifications.getPermissionsAsync(),
    ImagePicker.getCameraPermissionsAsync(),
  ]);

  return {
    location: location.granted,
    notifications: notifications.granted,
    camera: camera.granted,
  };
}

export async function requestLocationPermission(): Promise<boolean> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) return true;

  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function requestCameraPermission(): Promise<boolean> {
  const current = await ImagePicker.getCameraPermissionsAsync();
  if (current.granted) return true;

  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
}

export async function requestPermission(key: keyof PermissionFlags): Promise<boolean> {
  switch (key) {
    case "location":
      return requestLocationPermission();
    case "notifications":
      return requestNotificationPermission();
    case "camera":
      return requestCameraPermission();
  }
}

export async function applyPermissions(flags: PermissionFlags): Promise<PermissionFlags> {
  const result: PermissionFlags = { ...flags };

  for (const key of Object.keys(flags) as (keyof PermissionFlags)[]) {
    if (flags[key]) {
      result[key] = await requestPermission(key);
    }
  }

  return result;
}
