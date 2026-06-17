/**
 * AppSearchInput
 * Role: shared
 * Entry: coupon list, partner search, filters
 * Exit: onChangeText callback
 */
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { IconSearch, IconX } from "@tabler/icons-react-native";
import { GlassSurface } from "./GlassSurface";
import { Colors, Layout, Radius, Spacing, Typography } from "../../theme";

export interface AppSearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function AppSearchInput({
  value,
  onChangeText,
  placeholder = "Search",
  autoFocus = false,
}: AppSearchInputProps) {
  const [focused, setFocused] = useState(false);
  const shellStyle = focused ? styles.shellFocused : styles.shellDefault;

  return (
    <GlassSurface
      borderRadius={Radius.input}
      borderColor={focused ? "rgba(196,132,252,0.55)" : "rgba(255,255,255,0.20)"}
      overlayColor={focused ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.08)"}
      style={shellStyle}
    >
      <View style={styles.row}>
        <IconSearch size={18} color={Colors.t3} strokeWidth={2} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.t4}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText("")} hitSlop={8} style={styles.clear}>
            <IconX size={16} color={Colors.t3} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  shellDefault: {
    minHeight: Layout.inputMinHeight,
  },
  shellFocused: {
    minHeight: Layout.inputMinHeight,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    minHeight: Layout.inputMinHeight,
  },
  input: {
    ...Typography.body,
    flex: 1,
    color: Colors.t1,
    marginLeft: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  clear: {
    marginLeft: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
