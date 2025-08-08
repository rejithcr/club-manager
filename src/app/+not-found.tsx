import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import ThemedView from "../components/themed-components/ThemedView";
import ThemedText from "../components/themed-components/ThemedText";

WebBrowser.maybeCompleteAuthSession();

const NotFound = () => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>404 - Not Found</ThemedText>
      <Link href="/">Go to Home</Link>
    </ThemedView>
  );
};

export default NotFound;
