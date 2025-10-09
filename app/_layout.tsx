import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithCustomToken, User } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React = require("react");

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await fetch(
            `https://securetoken.googleapis.com/v1/token?key=$AIzaSyDBSlOm54t726c5E8SUdHtLoqPE_-nyF_o`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
            }
          );

          const data = await response.json();
          console.log(data.refresh_token);

          if (data.id_token) {
            console.log("🟢 Sessão restaurada com ID:", data.user_id);

            await AsyncStorage.setItem("refreshToken", data.refresh_token);
            setUser({
              uid: data.user_id,
              email: data.user_email,
            } as User);

          } else {
            console.log("⚠️ Refresh token inválido ou expirado");
            await AsyncStorage.removeItem("refreshToken");
          }
        }
      } catch (err) {
        console.log("❌ Erro ao restaurar sessão:", err);
      } finally {
        if (initializing) setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      console.log("👤 Auth state:", usr?.uid || "nenhum");
      setUser(usr);

      if (usr) {
        await AsyncStorage.setItem("user", JSON.stringify(usr));
      } else {
        await AsyncStorage.removeItem("user");
      }

      // setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if(initializing) return;

    const inAuthGroup = segments[0] === null;

    if (user && !inAuthGroup) {
      router.replace('/MainAppScreen');
    } else {
      router.replace('/');
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="MainAppScreen" />
    </Stack>
  );
}

