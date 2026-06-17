/**
 * AppAvatar
 * Role: shared
 * Entry: profile, home header, session summary
 * Exit: display-only avatar
 */
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Typography } from "../../theme";

export type AppAvatarSize = "sm" | "md" | "lg" | "xl";

export interface AppAvatarProps {
  name: string;
  imageUri?: string | null;
  size?: AppAvatarSize;
}

function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

export function AppAvatar({ name, imageUri, size = "md" }: AppAvatarProps) {
  const shellStyle = styles[`size_${size}`];
  const textStyle = styles[`text_${size}`];

  if (imageUri) {
    return <Image source={{ uri: imageUri }} style={[styles.image, shellStyle]} />;
  }

  return (
    <View style={[styles.fallback, shellStyle]}>
      <Text style={[styles.initial, textStyle]}>{getInitial(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: Radius.full,
  },
  fallback: {
    borderRadius: Radius.full,
    backgroundColor: Colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    ...Typography.title,
    color: Colors.t1,
  },
  size_sm: {
    width: 32,
    height: 32,
  },
  size_md: {
    width: 44,
    height: 44,
  },
  size_lg: {
    width: 56,
    height: 56,
  },
  size_xl: {
    width: 80,
    height: 80,
  },
  text_sm: {
    fontSize: 13,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 20,
  },
  text_xl: {
    fontSize: 32,
  },
});
