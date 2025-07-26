import React, { useContext, useEffect, useState } from "react";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { UserContext } from "../context/UserContext";
import { authenticate } from "@/src/helpers/auth_helper";
import * as AuthSession from "expo-auth-session";
import LoadingSpinner from "../components/LoadingSpinner";
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
