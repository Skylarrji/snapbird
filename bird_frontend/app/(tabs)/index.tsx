import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState<string | undefined>("");
  const [result, setResult] = useState<string>("");

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
          const serverResponse = await fetch('http://127.0.0.1:8000/classify/', {
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
        // For mobile, use expo-file-system to convert to base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const response = await fetch('http://127.0.0.1:8000/classify/', {
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Select Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 20 }} />}
      <Button title="Upload Image" onPress={uploadImage} />
    </View>
  );
};

export default ImageUpload;
