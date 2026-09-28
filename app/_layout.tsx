import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// Layout component
export default function RootLayout() {
  // Load the custom fonts
  const [loaded] = useFonts({
    MachineryScript: require("../assets/fonts/MachineryScript_PERSONAL_USE_ONLY.otf"),
    GoodMatcha: require("../assets/fonts/GoodMatcha.otf"),
  });

  // Hide the splash screen when the fonts are loaded
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);
  // If the fonts are not loaded, return null (the splash screen will remain visible)
  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
