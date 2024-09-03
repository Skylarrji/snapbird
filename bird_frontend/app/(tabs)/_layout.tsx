import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Pressable, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import InfoPopup from '../infoPopup'
import tw from 'twrnc';
import { BirdProvider } from '../context/birdContext';

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
      <BirdProvider>
        <Tabs // topmost header
          screenOptions={{
            tabBarActiveTintColor: '#38BDF8',
            headerShown: useClientOnlyValue(false, true),
            tabBarStyle: { paddingBottom: 5 },
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
          <Tabs.Screen // bottom page home tab
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Text
                style={{
                  fontFamily: 'MaterialSymbolsRounded',
                  fontSize: 28,
                  color: color,
                }}
              >
                home
              </Text>,
              headerRight: () => ( // when on the home page, set the right hand side of the top header to the info button
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
          <Tabs.Screen // bottom page profile tab
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <Text
                style={{
                  fontFamily: 'MaterialSymbolsRounded',
                  fontSize: 28,
                  color: color,
                }}
              >
                person
              </Text>,
            }}
          />
        </Tabs>

        {isPopupVisible && ( // info popup
          <InfoPopup onClose={() => setPopupVisible(false)} />
        )}
      </BirdProvider>
    </>
  );
}
