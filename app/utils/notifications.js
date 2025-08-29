import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PROJECT_ID =
  (Constants?.expoConfig?.extra?.eas?.projectId) ||
  '3299e7d7-3dc9-4a5f-835d-44695c672e1d'; // fallback

// Foreground notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Register device for push notifications
export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push permission!');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { data } = await Notifications.getExpoPushTokenAsync({
      projectId: PROJECT_ID,
    });

    console.log('✅ Expo Push Token:', data);
    return data;
  } catch (e) {
    console.log('❌ registerForPushNotificationsAsync error:', e);
    alert('Error setting up notifications. Check logs.');
    return null;
  }
}

// Local test notification
export async function sendLocalTestNotification() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Local shiva',
      body: 'this is shiva testing122435 ✅',
      data: { ping: true },
    },
    trigger: null,
  });
}

// Trigger notification for new chat message
export async function sendNewMessageNotification(chatName, messageText, chatId) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: `New message from ${chatName || 'Chat'}`,
      body: messageText || 'You have a new message',
      data: { chatId },
      sound: 'default',
    },
    trigger: null,
  });
}

// Default export for the notifications module
export default {
  registerForPushNotificationsAsync,
  sendLocalTestNotification,
  sendNewMessageNotification,
};
