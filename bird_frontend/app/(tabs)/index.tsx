import React, { useState } from 'react';
import { View, Image, Alert, Platform, Text, Pressable, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import tw from 'twrnc';
import { useFonts } from 'expo-font';

// @ts-expect-error
import defaultImage from '../../assets/images/bird_graphic.png';

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState<string | undefined>("");

  const [fontsLoaded] = useFonts({
    'MaterialSymbolsRounded': require('../../assets/fonts/MaterialSymbolsRounded.ttf'),
  });

  const selectImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No image selected');
      return;
    }

    try {
      let base64: string;

      if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = async () => {
          base64 = reader.result?.toString().split(',')[1] || '';

          const serverResponse = await fetch('https://ba78-24-54-11-154.ngrok-free.app/classify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image_uri: base64,
            }),
          });

          const data = await serverResponse.json();
          console.log("species: " + data.species);
        };
        reader.readAsDataURL(blob);
      } else {
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          Alert.alert('File not found!');
          return;
        }

        base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const response = await fetch('https://ba78-24-54-11-154.ngrok-free.app/classify/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_uri: base64,
          }),
        });
        const data = await response.json();
        console.log("species: " + data.species);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100 gap-6 mx-4`}>
      <Text style={tw`text-3xl text-slate-700 text-center font-bold`}>
        Identify birds instantly with a single click
      </Text>
      <Text style={tw`text-xl text-slate-700 text-center font-base`}>
        Capture or upload a photo to discover the species and build your personal birding journal!
      </Text>

      <Image
        source={imageUri ? { uri: imageUri } : defaultImage}
        style={[
          tw`w-48 h-48 rounded-lg`,
          !imageUri && tw`border-dashed border-2 border-slate-400`
        ]}
      />

      {imageUri &&
        <Pressable onPress={uploadImage} style={tw`bg-sky-400 p-2 px-8 rounded-full`}>
          <Text style={tw`text-white text-center font-semibold`}>Identify</Text>
        </Pressable>
      }

      <View style={tw`flex flex-row gap-4`}>
        <Pressable onPress={selectImage} style={tw`border-2 border-sky-400 p-2 px-4 rounded-full`}>
          <Text style={tw`text-sky-400 text-center font-semibold`}>Upload Image</Text>
        </Pressable>

        {Platform.OS !== 'web' && (
          <Pressable onPress={takePhoto} style={tw`border-2 border-sky-400 p-2 px-4 rounded-full`}>
            <Text style={tw`text-sky-400 text-center font-semibold`}>Take Photo</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ImageUpload;
