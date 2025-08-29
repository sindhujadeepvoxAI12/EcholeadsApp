import React, { useEffect, useRef, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, SafeAreaView, Alert, View, Text, Button, ScrollView } from "react-native";

import { ThemeProvider } from "../contexts/ThemeContext";
import { CampaignProvider } from "../contexts/CampaignContext";
import { AgentProvider } from "../contexts/AgentContext";

import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import { registerForPushNotificationsAsync, sendLocalTestNotification } from "../app/utils/notifications";
// import { chatAPI } from "./services/chatService";

export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token && token !== expoPushToken) setExpoPushToken(token);
    })();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("📩 Notification received in foreground:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("📲 Notification tapped:", response);
      const data = response.notification.request.content.data;
      if (data?.chatId) router.push(`/chat/${data.chatId}`);
    });

    // Poll chat list every 10 seconds for new messages
    // const interval = setInterval(async () => {
    //   await chatAPI.getChatList();
    // }, 10000);

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      // clearInterval(interval);
    };
  }, []);

  // const copyToken = async () => {
  //   if (!expoPushToken) return Alert.alert("Token not ready yet");
  //   await Clipboard.setStringAsync(expoPushToken);
  //   Alert.alert("Copied", "Expo push token copied to clipboard");
  // };

  // const sendLocal = async () => await sendLocalTestNotification();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CampaignProvider>
          <AgentProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === "android" ? 24 : 0 }}>
              <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
              <StatusBar style="auto" />

              {/* <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Expo Push Token</Text>
                <Text selectable style={{ fontFamily: "monospace" }}>{expoPushToken || "(fetching...)"}</Text>
                <View style={{ height: 12 }} />
                <Button title="Copy token" onPress={copyToken} />
                <View style={{ height: 12 }} />
                <Button title="Send local test notification" onPress={sendLocal} />
                <View style={{ height: 24 }} />
                <Text>Notifications will show on screen if app is open. Otherwise they’ll go to system tray as usual.</Text>
              </ScrollView> */}
            </SafeAreaView>
          </AgentProvider>
        </CampaignProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
