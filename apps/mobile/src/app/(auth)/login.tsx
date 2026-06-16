/**
 * LoginScreen
 * Role: public
 * Entry: app launch (index redirect)
 * Exit: success → role route | register → step1
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Haptics from "expo-haptics";
import {
  AppButton,
  AppInput,
  AuthDivider,
  GoogleLogo,
  HomeIndicator,
} from "../../components";
import {
  INTRO_PLAY_DURATION_MS,
  INTRO_VIDEO,
  INTRO_VIDEO_START_SECONDS,
} from "../../constants/intro-video";
import { useDropInEntrance } from "../../hooks/useDropInEntrance";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";
import { useAuthStore } from "../../store/auth.store";
import { Colors, Spacing, Typography } from "../../theme";

const LOGIN_HERO = require("../../../assets/images/login-hero.png");

const LOGIN_GRADIENT = {
  colors: [
    "rgba(13,13,26,0.20)",
    "rgba(13,13,26,0.55)",
    "rgba(13,13,26,0.92)",
  ] as const,
  locations: [0, 0.45, 1] as const,
};

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

function validateForm(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};

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

export default function LoginScreen() {
  const { fromIntro } = useLocalSearchParams<{ fromIntro?: string }>();
  const isIntro = fromIntro === "1";
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { trigger } = useHaptic();
  const registerScale = usePressScale();
  const forgotScale = usePressScale();

  const [uiReady, setUiReady] = useState(!isIntro);
  const introFinished = useRef(false);
  const playbackStarted = useRef(false);
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = useVideoPlayer(INTRO_VIDEO, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = true;
  });

  const finishIntroClip = useCallback(() => {
    if (introFinished.current) return;
    introFinished.current = true;

    if (playTimer.current) {
      clearTimeout(playTimer.current);
      playTimer.current = null;
    }

    player.pause();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUiReady(true);
  }, [player]);

  const beginIntroClip = useCallback(() => {
    if (playbackStarted.current) return;
    playbackStarted.current = true;

    player.currentTime = INTRO_VIDEO_START_SECONDS;
    player.play();
    playTimer.current = setTimeout(finishIntroClip, INTRO_PLAY_DURATION_MS);
  }, [finishIntroClip, player]);

  useEventListener(player, "statusChange", ({ status }) => {
    if (isIntro && status === "readyToPlay") {
      beginIntroClip();
    }
  });

  useEventListener(player, "playToEnd", () => {
    if (isIntro) finishIntroClip();
  });

  useEffect(() => {
    return () => {
      if (playTimer.current) clearTimeout(playTimer.current);
    };
  }, []);

  const headerDrop = useDropInEntrance(uiReady, 0, 120);
  const emailDrop = useDropInEntrance(uiReady, 90, 220);
  const passwordDrop = useDropInEntrance(uiReady, 190, 220);
  const forgotDrop = useDropInEntrance(uiReady, 280, 160);
  const signInDrop = useDropInEntrance(uiReady, 370, 200);
  const googleDrop = useDropInEntrance(uiReady, 460, 200);
  const footerDrop = useDropInEntrance(uiReady, 540, 160);

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});

  const updateField = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleLogin = async () => {
    const validation = validateForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      void trigger("light");
      return;
    }

    try {
      void trigger("medium");
      await login(form.email.trim(), form.password);
    } catch (error) {
      Alert.alert(
        "Login error",
        error instanceof Error ? error.message : "Try again",
      );
    }
  };

  const handleRegister = () => {
    void trigger("light");
    router.push("/(auth)/register/step1");
  };

  const loginContent = (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={styles.screen} pointerEvents={uiReady ? "auto" : "none"}>
        <View style={styles.panel}>
          <Animated.View style={[styles.header, headerDrop]}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to your account to continue
            </Text>
          </Animated.View>

          <View style={styles.center}>
            <View style={styles.form}>
              <Animated.View style={emailDrop}>
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
              </Animated.View>

              <View style={styles.fieldGap} />

              <Animated.View style={passwordDrop}>
                <AppInput
                  label="Password"
                  labelVariant="auth"
                  value={form.password}
                  onChangeText={(v) => updateField("password", v)}
                  placeholder="Enter your password"
                  secureTextEntry
                  textContentType="password"
                  error={errors.password}
                />
              </Animated.View>

              <Animated.View style={[styles.forgotWrap, forgotDrop]}>
                <Animated.View style={forgotScale.animatedStyle}>
                  <Pressable
                    onPress={() => void trigger("light")}
                    onPressIn={forgotScale.onPressIn}
                    onPressOut={forgotScale.onPressOut}
                    hitSlop={8}
                  >
                    <Text style={styles.forgotText}>Forgot password</Text>
                  </Pressable>
                </Animated.View>
              </Animated.View>
            </View>
          </View>

          <View style={styles.actions}>
            <Animated.View style={signInDrop}>
              <AppButton
                label="Sign in"
                onPress={handleLogin}
                variant="glassPrimary"
                haptic="medium"
                loading={isLoading}
                fullWidth
                size="lg"
              />
            </Animated.View>
            <AuthDivider compact />
            <Animated.View style={googleDrop}>
              <AppButton
                label=""
                onPress={() => void trigger("light")}
                variant="glass"
                haptic="light"
                fullWidth
                size="lg"
                icon={<GoogleLogo size={22} />}
              />
            </Animated.View>
            <Animated.View style={[styles.footerLinks, footerDrop]}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Animated.View style={registerScale.animatedStyle}>
                <Pressable
                  onPress={handleRegister}
                  onPressIn={registerScale.onPressIn}
                  onPressOut={registerScale.onPressOut}
                  hitSlop={8}
                >
                  <Text style={styles.registerLink}>Sign up</Text>
                </Pressable>
              </Animated.View>
            </Animated.View>
          </View>
        </View>
      </View>
      <HomeIndicator />
    </SafeAreaView>
  );

  return (
    <View style={styles.root}>
      {isIntro ? (
        <View style={styles.background}>
          <VideoView
            player={player}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            nativeControls={false}
            fullscreenOptions={{ enable: false }}
            allowsPictureInPicture={false}
          />
          <LinearGradient
            colors={[...LOGIN_GRADIENT.colors]}
            locations={[...LOGIN_GRADIENT.locations]}
            style={styles.overlay}
          />
          {loginContent}
        </View>
      ) : (
        <ImageBackground
          source={LOGIN_HERO}
          style={styles.background}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[...LOGIN_GRADIENT.colors]}
            locations={[...LOGIN_GRADIENT.locations]}
            style={styles.overlay}
          />
          {loginContent}
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safe: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  panel: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  header: {
    paddingTop: Spacing.xxxl + Spacing.xl,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    ...Typography.display,
    marginBottom: Spacing.md,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  subtitle: {
    ...Typography.body,
    lineHeight: 22,
    color: Colors.t2,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  form: {
    width: "100%",
  },
  fieldGap: {
    height: Spacing.xl,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: Spacing.md,
  },
  forgotText: {
    ...Typography.caption,
    color: Colors.purpleLt,
  },
  actions: {
    width: "100%",
    alignSelf: "stretch",
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
  registerLink: {
    ...Typography.body,
    color: Colors.purpleLt,
    fontWeight: "700",
  },
});
