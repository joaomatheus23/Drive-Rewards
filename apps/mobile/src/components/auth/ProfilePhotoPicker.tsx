/**
 * ProfilePhotoPicker
 * Role: public
 * Entry: register step 2
 * Exit: onPick local image URI
 */
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { IconCamera } from "@tabler/icons-react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface ProfilePhotoPickerProps {
  uri: string | null;
  onPick: (uri: string) => void;
  compact?: boolean;
}

export function ProfilePhotoPicker({
  uri,
  onPick,
  compact = false,
}: ProfilePhotoPickerProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePick = async () => {
    void trigger("light");

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Allow access to photos to add your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onPick(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Text style={styles.label}>Profile photo</Text>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePick}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <GlassSurface
            borderRadius={Radius.card}
            style={[styles.row, compact && styles.rowCompact]}
          >
            <View style={styles.avatarWrap}>
              {uri ? (
                <Image
                  source={{ uri }}
                  style={[styles.avatar, compact && styles.avatarCompact]}
                />
              ) : (
                <View style={[styles.avatarPlaceholder, compact && styles.avatarCompact]}>
                  <IconCamera size={compact ? 18 : 22} color={Colors.t3} strokeWidth={1.8} />
                </View>
              )}
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.title, compact && styles.titleCompact]}>
                Add photo
              </Text>
              <Text style={styles.subtitle}>JPG or PNG • Up to 5MB</Text>
            </View>
          </GlassSurface>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.xl,
  },
  wrapCompact: {
    marginTop: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: Colors.t2,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  rowCompact: {
    padding: Spacing.md,
  },
  avatarWrap: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
  },
  avatarCompact: {
    width: 44,
    height: 44,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...Typography.title,
    marginBottom: Spacing.xs,
  },
  titleCompact: {
    fontSize: 15,
  },
  subtitle: {
    ...Typography.caption,
  },
});
