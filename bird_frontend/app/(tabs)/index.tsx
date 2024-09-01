import React, { useState } from 'react';
import { View, Image, Alert, Platform, Text, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import tw from 'twrnc';
import { useFonts } from 'expo-font';

// @ts-expect-error
import defaultImage from '../../assets/images/bird_graphic.png';

// replace with url generated when running ngrok; used to make backend requests
const ngrokLink = 'https://ba45-65-93-22-248.ngrok-free.app';

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState<string | undefined>("");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");

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

          const serverResponse = await fetch(ngrokLink + '/classify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image_uri: base64,
            }),
          });

          const data = await serverResponse.json();
          const formattedSpecies = data.species.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase());
          setPopupMessage(`${formattedSpecies}`);
          setPopupVisible(true);
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

        const response = await fetch(ngrokLink + '/classify/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_uri: base64,
          }),
        });
        const data = await response.json();
        // use a regex to find the first letter of every word and capitalize it
        const formattedSpecies = data.species.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase());
        setPopupMessage(`${formattedSpecies}`);
        setPopupVisible(true);
      }
    } catch (error) {
      setPopupMessage('Unknown');
      setPopupVisible(true);
      console.error('Error:', error);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100 gap-6 w-full`}>
      <Text style={tw`text-3xl text-slate-700 text-center font-bold`}>
        Identify birds instantly with a single click
      </Text>
      <Text style={tw`text-lg text-slate-700 text-center mx-6`}>
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

      {popupVisible && <Popup onCancel={closePopup} message={popupMessage} birdImage={imageUri} />}
    </View>
  );
};

// Popup component
const Popup: React.FC<{ onCancel: () => void; message: string; birdImage: string | undefined }> = ({ onCancel, message, birdImage }) => {
  return (
    <View style={tw`absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]`}>
      <View style={tw`w-3/4 max-w-[300px] p-4 pb-6 bg-white rounded-xl`}>

        <View style={tw`flex flex-col items-center justify-center gap-5`}>
          <Text style={tw`text-2xl text-slate-700 text-center font-bold`}>Bird identified</Text>

          <View style={tw`flex flex-col items-center justify-center`}>
            <Image
              source={birdImage ? { uri: birdImage } : defaultImage}
              style={[
                tw`w-48 h-48 rounded-t-lg`,
                !birdImage && tw`border-dashed border-2 border-slate-400`
              ]}
            />

            <View style={tw`rounded-b-lg border-2 border-slate-100 p-2 w-48`}>
              <Text style={tw`text-xl text-slate-700 text-center font-medium`}>{message}</Text>
            </View>
          </View>

          <View style={tw`flex flex-row gap-4`}>
            <Pressable onPress={onCancel} style={tw`border-2 border-sky-400 p-2 px-4 rounded-full`}>
              <Text style={tw`text-sky-400 text-center font-semibold`}>Cancel</Text>
            </Pressable>
            <Pressable onPress={() => { }} style={tw`bg-sky-400 p-2 px-6 flex items-center justify-center rounded-full`}>
              <Text style={tw`text-white text-center font-semibold`}>Save</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </View>
  );
};

export default ImageUpload;
