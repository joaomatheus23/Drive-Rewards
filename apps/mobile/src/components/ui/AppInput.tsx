/**
 * AppInput
 * Role: shared
 * Entry: auth and profile forms
 * Exit: onChangeText / onBlur callbacks
 */
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { GlassSurface } from "./GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export type AppInputState = "default" | "focused" | "filled" | "error";

export interface AppInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelVariant?: "default" | "auth";
  appearance?: "default" | "glass";
}

function resolveState(
  focused: boolean,
  hasValue: boolean,
  hasError: boolean,
): AppInputState {
  if (hasError) return "error";
  if (focused) return "focused";
  if (hasValue) return "filled";
  return "default";
}

function glassStyleForState(state: AppInputState): {
  borderColor: string;
  overlayColor: string;
} {
  if (state === "error") {
    return {
      borderColor: "rgba(239,68,68,0.55)",
      overlayColor: "rgba(239,68,68,0.10)",
    };
  }
  if (state === "focused") {
    return {
      borderColor: "rgba(196,132,252,0.55)",
      overlayColor: "rgba(124,58,237,0.14)",
    };
  }
  if (state === "filled") {
    return {
      borderColor: "rgba(255,255,255,0.26)",
      overlayColor: "rgba(255,255,255,0.10)",
    };
  }
  return {
    borderColor: "rgba(255,255,255,0.20)",
    overlayColor: "rgba(255,255,255,0.08)",
  };
}

export function AppInput({
  label,
  error,
  value,
  onFocus,
  onBlur,
  containerStyle,
  labelVariant = "default",
  appearance = "glass",
  ...rest
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value && String(value).length > 0);
  const state = resolveState(focused, hasValue, Boolean(error));

  const inputStateStyle =
    state === "focused"
      ? styles.inputFocused
      : state === "filled"
        ? styles.inputFilled
        : state === "error"
          ? styles.inputError
          : styles.inputDefault;

  const labelStyle = labelVariant === "auth" ? styles.labelAuth : styles.label;
  const isGlass = appearance === "glass";
  const glassStyle = glassStyleForState(state);

  const inputElement = (
    <TextInput
      {...rest}
      value={value}
      placeholderTextColor={isGlass ? "rgba(255,255,255,0.35)" : Colors.t4}
      style={[styles.input, isGlass ? styles.glassInput : inputStateStyle]}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
    />
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={labelStyle}>{label}</Text>
      {isGlass ? (
        <GlassSurface
          borderRadius={Radius.input}
          intensity={60}
          tint="dark"
          borderColor={glassStyle.borderColor}
          overlayColor={glassStyle.overlayColor}
        >
          {inputElement}
        </GlassSurface>
      ) : (
        inputElement
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  labelAuth: {
    ...Typography.body,
    color: Colors.t2,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.body,
    color: Colors.t1,
    borderWidth: 1,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  glassInput: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
  inputDefault: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  inputFocused: {
    borderColor: "rgba(124,58,237,0.70)",
    backgroundColor: Colors.surface2,
  },
  inputFilled: {
    borderColor: Colors.borderMd,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: "rgba(239,68,68,0.50)",
    backgroundColor: "#160E0E",
  },
  error: {
    ...Typography.caption,
    color: Colors.red,
    marginTop: Spacing.sm,
  },
});
