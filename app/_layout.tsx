import useAuthStore from "@/store/auth.store";
import * as Sentry from '@sentry/react-native';
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

Sentry.init({
  dsn: 'https://b809f8c8aaa5fb8daacb4208f23bfea7@o4510508174737408.ingest.de.sentry.io/4510508187582544',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const {isLoading, fetchAuthenticatedUser} = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "quicksandBold": require("../assets/fonts/QuickSand-Bold.ttf"),
    "quicksandSemiBold": require("../assets/fonts/QuickSand-SemiBold.ttf"),
    "quicksandMedium": require("../assets/fonts/QuickSand-Medium.ttf"),
    "quicksandRegular": require("../assets/fonts/QuickSand-Regular.ttf"),
    "quicksandLight": require("../assets/fonts/QuickSand-Light.ttf"),
});


  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  if (!fontsLoaded || isLoading) return null

  return <Stack screenOptions={{ headerShown: false}}/>;
});