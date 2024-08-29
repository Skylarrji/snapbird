import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, Text, View } from 'react-native';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import tw from 'twrnc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useFonts } from 'expo-font';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'MaterialSymbolsRounded': require('../../assets/fonts/MaterialSymbolsRounded.ttf'),
  });

  if (!fontsLoaded) {
    // Return a loading component if fonts aren't loaded yet
    return null; // or you can return a loading spinner, etc.
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Logo */}
            <Image
              source={require('@/assets/images/bird_logo.png')}
              style={{ width: 30, height: 30, marginRight: 10 }}
              resizeMode="contain"
            />
            {/* Title */}
            <Text style={tw`text-lg font-semibold`}>SnapBird</Text>
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
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Text
                    style={{
                      marginRight: 15,
                      fontFamily: 'MaterialSymbolsRounded',
                      fontSize: 28,
                      color: Colors[colorScheme ?? 'light'].text,
                    }}
                  >
                    info
                  </Text>
                )}
              </Pressable>
            </Link>
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
  );
}
