/**
 * CouponSearchBar
 * Role: driver
 * Entry: CouponsScreen header area
 * Exit: debounced search via parent callback
 */
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { IconSearch, IconX } from "@tabler/icons-react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";

export interface CouponSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function CouponSearchBar({ value, onChangeText }: CouponSearchBarProps) {
  const { trigger } = useHaptic();

  const handleClear = () => {
    void trigger("light");
    onChangeText("");
  };

  return (
    <View style={styles.container}>
      <IconSearch size={18} color={Colors.t3} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search coupons or partners"
        placeholderTextColor={Colors.t4}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable onPress={handleClear} hitSlop={8} style={styles.clearButton}>
          <IconX size={16} color={Colors.t3} strokeWidth={2.2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 46,
    marginHorizontal: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.t1,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
