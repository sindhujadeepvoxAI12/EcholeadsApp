import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF9500',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: 10,
          paddingTop: 8,
          height: 74,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}
      initialRouteName="Dashboard"
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'grid' : 'grid-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="HireAgents"
        options={{
          title: 'Agents',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'people' : 'people-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="PhoneSettings"
        options={{
          title: 'Phone',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'call' : 'call-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="Calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'calendar' : 'calendar-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="Purchase"
        options={{
          title: 'Purchase',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'card' : 'card-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="LiveChat"
        options={{
          title: 'Live Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}