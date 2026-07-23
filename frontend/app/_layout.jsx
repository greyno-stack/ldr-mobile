import { Stack } from "expo-router";
import { View, Text } from "react-native";
import SafeScreen from "../components/SafeScreen";

export default function RootLayout() {
  return (
    <View>
      <SafeScreen>
        <Text>Hello, World!</Text>
      </SafeScreen>
    </View>
  );
}
