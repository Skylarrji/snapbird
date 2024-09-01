import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Pressable, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Popup from '../popup'
import tw from 'twrnc';

export default function TabLayout() {
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
          tabBarActiveTintColor: '#38BDF8',
          headerShown: useClientOnlyValue(false, true),
          tabBarStyle: {paddingBottom: 5},
          headerLeft: () => (
            <View style={tw`flex flex-row items-center ml-4`}>
              <Image
                source={require('@/assets/images/bird_logo.png')}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={tw`text-lg font-semibold text-slate-700`}>SnapBird</Text>
            </View>
          ),

          headerTitle: '', // added to prevent extra page indicator title at the top
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Text
              style={{
                fontFamily: 'MaterialSymbolsRounded',
                fontSize: 28,
                color: color,
                marginBottom: -3
              }}
            >
              home
            </Text>,
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
            title: 'Profile',
            tabBarIcon: ({ color }) => <Text
              style={{
                fontFamily: 'MaterialSymbolsRounded',
                fontSize: 28,
                color: color,
                marginBottom: -3
              }}
            >
              person
            </Text>,
          }}
        />
      </Tabs>

      {isPopupVisible && (
        <Popup onClose={() => setPopupVisible(false)} />
      )}
    </>
  );
}
