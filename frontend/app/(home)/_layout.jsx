import { useEffect } from 'react';
import { AppState } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { usePresenceStore } from '../../store/usePresenceStore';
import { axiosInstance } from '../../lib/axios';
import { registerForPushNotificationsAsync } from '../../lib/pushNotifications';
import { connectSocket, disconnectSocket } from '../../lib/socket';

export default function HomeLayout() {
  const { authUser } = useAuthStore();
  const { setPartnerStatus } = usePresenceStore();

  useEffect(() => {
    if (!authUser) return;
    registerForPushNotificationsAsync().then((pushToken) => {
      if (pushToken) {
        axiosInstance.patch('/auth/push-token', { pushToken }).catch(() => {});
      }
    });
  }, [authUser]);

  useEffect(() => {
    if (!authUser?.token) return;

    const socket = connectSocket(authUser.token);

    const handlePartnerStatus = ({ status }) => setPartnerStatus(status);
    const handleConnect = () => {
      socket.emit('presence:get', null, ({ status }) => setPartnerStatus(status));
    };
    const handleAppStateChange = (nextState) => {
      socket.emit('presence:state', { active: nextState === 'active' });
    };

    socket.on('connect', handleConnect);
    socket.on('partner:status', handlePartnerStatus);
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('partner:status', handlePartnerStatus);
      subscription.remove();
      disconnectSocket();
      setPartnerStatus('offline');
    };
  }, [authUser?.token]);

  if (!authUser) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C9A9E9',
        tabBarInactiveTintColor: '#8a80a0',
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: 'rgba(36,27,51,0.95)' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="partner"
        options={{
          title: 'Partner',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null }}
      />
    </Tabs>
  );
}
