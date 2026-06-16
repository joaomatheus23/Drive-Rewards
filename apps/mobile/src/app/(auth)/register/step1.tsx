/**
 * RegisterStep1
 * Role: public
 * Entry: login → Cadastre-se
 * Exit: success → /(auth)/register/step2
 */
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import {
  AppButton,
  AppInput,
  AuthBackButton,
  AuthDivider,
  AuthProgressBar,
  GoogleLogo,
  HomeIndicator,
  PasswordStrength,
  SafeScreen,
} from "../../../components";
import { useHaptic } from "../../../hooks/useHaptic";
import { usePressScale } from "../../../hooks/usePressScale";
import { useAuthStore } from "../../../store/auth.store";
import { getPasswordStrength } from "../../../utils/password-strength";
import { Colors, Spacing, Typography } from "../../../theme";

interface Step1Form {
  name: string;
  email: string;
  password: string;
}

interface Step1Errors {
  name?: string;
  email?: string;
  password?: string;
}

function validateStep1(form: Step1Form): Step1Errors {
  const errors: Step1Errors = {};

  if (!form.name.trim()) errors.name = "Enter your full name";
  if (!form.email.trim()) {
    errors.email = "Enter your email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Invalid email";
  }
  if (!form.password) {
    errors.password = "Enter your password";
  } else if (form.password.length < 6) {
    errors.password = "Minimum 6 characters";
  }

  return errors;
}

export default function RegisterStep1() {
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { trigger } = useHaptic();
  const loginScale = usePressScale();

  const [form, setForm] = useState<Step1Form>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Step1Errors>({});

  const updateField = (field: keyof Step1Form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleContinue = async () => {
    const validation = validateStep1(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      void trigger("light");
      return;
    }

    const strength = getPasswordStrength(form.password);
    if (strength.score < 2) {
      setErrors({ password: "Choose a stronger password" });
      void trigger("light");
      return;
    }

    try {
      void trigger("medium");
      await register(form.name.trim(), form.email.trim(), form.password);
      router.push("/(auth)/register/step2");
    } catch (error) {
      Alert.alert(
        "Registration error",
        error instanceof Error ? error.message : "Try again",
      );
    }
  };

  const handleLogin = () => {
    void trigger("light");
    router.replace("/(auth)/login");
  };

  return (
    <SafeScreen showHomeIndicator={false}>
      <View style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        >
          <View style={styles.topBar}>
            <AuthBackButton onPress={() => router.replace("/(auth)/login")} />
            <AuthProgressBar currentStep={1} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Your data is secure and never shared with third parties.
            </Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Full name"
              labelVariant="auth"
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
              placeholder="Marcus Oliveira"
              autoCapitalize="words"
              textContentType="name"
              error={errors.name}
            />
            <View style={styles.fieldGap} />
            <AppInput
              label="Email"
              labelVariant="auth"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              placeholder="marcus@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              error={errors.email}
            />
            <View style={styles.fieldGap} />
            <AppInput
              label="Password"
              labelVariant="auth"
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
              placeholder="Enter your password"
              secureTextEntry
              textContentType="newPassword"
              error={errors.password}
            />
            <PasswordStrength password={form.password} />
          </View>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <AppButton
            label="Continue"
            onPress={handleContinue}
            haptic="medium"
            loading={isLoading}
            fullWidth
            size="lg"
          />
          <AuthDivider compact />
          <AppButton
            label=""
            onPress={() => void trigger("light")}
            variant="glass"
            haptic="light"
            fullWidth
            size="lg"
            icon={<GoogleLogo size={22} />}
          />
          <View style={styles.footerLinks}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Animated.View style={loginScale.animatedStyle}>
              <Pressable
                onPress={handleLogin}
                onPressIn={loginScale.onPressIn}
                onPressOut={loginScale.onPressOut}
                hitSlop={8}
              >
                <Text style={styles.loginLink}>Sign in</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.heading1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  fieldGap: {
    height: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  footerText: {
    ...Typography.body,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.purpleLt,
    fontWeight: "700",
  },
});
