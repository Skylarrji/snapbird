import React, { useState } from 'react';
import { View, Button, Image, Alert, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import tw from 'twrnc';
import { useFonts } from 'expo-font';

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState<string | undefined>("");
  const [result, setResult] = useState<string>("");

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
        // For web, use FileReader to convert to base64
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          base64 = reader.result?.toString().split(',')[1] || '';

          // Send the base64 string to the server
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
          setResult(data);
          console.log("species: " + data.species);
        };
        reader.readAsDataURL(blob);
      } else {
        // For mobile, ensure the URI is accessible
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          Alert.alert('File not found!');
          return;
        }

        // Convert the image to base64
        base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Upload the base64 image
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
        setResult(data);
        console.log("species: " + data.species);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100`}>
      <Button title="Select Image" onPress={selectImage} />
      {Platform.OS !== 'web' && <Button title="Take Photo" onPress={takePhoto} />}
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 20 }} />}
      <Button title="Upload Image" onPress={uploadImage} />
      <Text style={{ fontFamily: 'MaterialSymbolsRounded', fontSize: 24, color: 'red' }}>favorite</Text>
    </View>
  );
};

export default ImageUpload;
