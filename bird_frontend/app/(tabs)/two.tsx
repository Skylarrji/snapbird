import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, ScrollView, View } from 'react-native';
import { Text } from '@/components/Themed';
import tw from 'twrnc';
import { useBirds } from '../context/birdContext';

export type Bird = {
  image: string;
  species: string;
};

const ngrokLink = 'https://4256-65-93-22-248.ngrok-free.app';

export default function Profile() {
  const { birds, setBirds } = useBirds();

  const fetchBirds = async () => {
    try {
      const serverResponse = await fetch(ngrokLink + '/birds/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any',
        },
      });
      const data = await serverResponse.json();
      setBirds(data.birds);
      
    } catch (error) {
      console.error('Error fetching birds:', error);
    }
  };

  useEffect(() => {
    fetchBirds();
  }, []);

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100`}>
      <Text style={tw`text-3xl text-slate-700 text-center font-bold mb-4 mt-4`}>
        Your collection
      </Text>
      <ScrollView contentContainerStyle={tw`flex-wrap flex-row justify-center gap-4`}>
        {birds.map((bird, index) => (
          <View key={`${bird.species}-${index}`} style={tw`flex flex-col items-center justify-center w-36 mb-4`}>
            <Image
              source={{ uri: bird.image }}
              style={tw`w-36 h-36 rounded-t-lg`}
            />
            <View style={tw`rounded-b-lg border-2 border-slate-200 bg-white p-2 w-full`}>
              <Text style={tw`text-base text-slate-700 text-center font-medium`}>{bird.species}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
