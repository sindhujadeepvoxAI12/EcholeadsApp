import React, { useEffect, useRef, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Platform, Alert, View, Text, Button, ScrollView } from "react-native";

import { ThemeProvider } from "../contexts/ThemeContext";
import { CampaignProvider } from "../contexts/CampaignContext";
import { AgentProvider } from "../contexts/AgentContext";

import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import {
  registerForPushNotificationsAsync,
  sendLocalTestNotification,
} from "../app/utils/notifications";
// import { chatAPI } from "./services/chatService";
import Constants from "expo-constants";
import whatsappMessagingService from "./services/whatsappMessagingService";

export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Avoid registering push notifications in Expo Go
      if (Constants.appOwnership !== "expo") {
        const token = await registerForPushNotificationsAsync();
        if (token && token !== expoPushToken) setExpoPushToken(token);
      }

      // Initialize WhatsApp 24h background service (no UI)
      try {
        if (Constants.appOwnership !== "expo") {
          await whatsappMessagingService.initialize();
        }
      } catch (e) {
        console.log("WhatsApp background service init failed:", e?.message);
      }
    })();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📩 Notification received in foreground:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("📲 Notification tapped:", response);
        const data = response.notification.request.content.data;
        if (data?.chatId) router.push(`/chat/${data.chatId}`);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CampaignProvider>
          <AgentProvider>
            <SafeAreaView style={{flex: 1}}>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade",
                  contentStyle: { backgroundColor: "#fff" },
                }}
              />
            </SafeAreaView>
          </AgentProvider>
        </CampaignProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
