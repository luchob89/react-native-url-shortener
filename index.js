import { LogBox } from "react-native";

// Some dependency reads react-native's deprecated SafeAreaView export,
// which fires this warning as a side effect of loading expo-router's
// navigation setup. Must be registered before that happens, so this uses
// require() instead of a static import: ES import statements are hoisted
// above all other code regardless of source order, which would otherwise
// load expo-router/entry (and fire the warning) before this line runs.
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

require("expo-router/entry");
