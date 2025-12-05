import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
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


  return <Stack screenOptions={{ headerShown: false}}/>;
}
