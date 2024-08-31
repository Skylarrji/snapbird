import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Pressable, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Popup from '../popup'
import tw from 'twrnc';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'MaterialSymbolsRounded': require('../../assets/fonts/MaterialSymbolsRounded.ttf'),
  });
  const [isPopupVisible, setPopupVisible] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#334155',
          headerShown: useClientOnlyValue(false, true),
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('@/assets/images/bird_logo.png')}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={tw`text-lg font-semibold text-slate-700`}>SnapBird</Text>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            headerRight: () => (
              <Pressable onPress={() => setPopupVisible(true)}>
                <Text
                  style={{
                    marginRight: 15,
                    fontFamily: 'MaterialSymbolsRounded',
                    fontSize: 28,
                    color: '#334155',
                  }}
                >
                  info
                </Text>
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Tab Two',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
      </Tabs>

      {isPopupVisible && (
        <Popup onClose={() => setPopupVisible(false)} />
      )}
    </>
  );
}
