import React, { useState } from 'react';
import { View, Image, Alert, Platform, Text, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import tw from 'twrnc';
import { useFonts } from 'expo-font';
import { useBirds } from '../context/birdContext';

// @ts-expect-error
import defaultImage from '../../assets/images/bird_graphic.png';

// replace with url generated when running ngrok; used to make backend requests
const ngrokLink = 'https://5767-65-93-22-248.ngrok-free.app';

// home page component
const Home = () => {
  const [imageUri, setImageUri] = useState<string | undefined>(""); // the uri of the current image uploaded/picture taken
  const [popupVisible, setPopupVisible] = useState<boolean>(false); // true when the "bird identified" popup is visible, else false
  const [popupMessage, setPopupMessage] = useState<string>(""); // stores the species that is identified on the popup
  const { setBirds } = useBirds(); // context that holds the birds in the database

  const [fontsLoaded] = useFonts({
    'MaterialSymbolsRounded': require('../../assets/fonts/MaterialSymbolsRounded.ttf'),
  });

  // function that runs when an image is being selected from the camera roll/file system
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

  // function that runs when the user takes a photo on their mobile device
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

  // retrieves the birds from the database and updates the context that is being passed down with them
  const fetchBirds = async () => {
    try {
      const serverResponse = await fetch(ngrokLink + '/birds/', { // send a GET request to the backend
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any', // needed to prevent cors error
        },
      });
      const data = await serverResponse.json();
      setBirds(data.birds);
      setPopupVisible(false);

    } catch (error) {
      console.error('Error fetching birds:', error);
      Alert.alert('Failed to fetch birds. Please try again.');
    }
  };

  // function that runs when the "identify" button is pressed
  const identifyBird = async () => {
    if (!imageUri) {
      Alert.alert('No image selected');
      return;
    }

    try {
      let base64: string;

      if (Platform.OS === 'web') { // the request is made on a web browser
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = async () => {
          base64 = reader.result?.toString().split(',')[1] || ''; // convert image to base64

          const serverResponse = await fetch(ngrokLink + '/classify/', { // send a POST request to the backend
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              base64_uri: base64,
              image_uri: imageUri
            }),
          });

          const data = await serverResponse.json();
          setPopupMessage(`${data.species}`); // set the "bird identified" popup to the species identified
          setPopupVisible(true);
        };
        reader.readAsDataURL(blob);
      } else { // the request is made on mobile
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          Alert.alert('File not found!');
          return;
        }

        base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const response = await fetch(ngrokLink + '/classify/', {  // send a POST request to the backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base64_uri: base64,
            image_uri: imageUri
          }),
        });
        const data = await response.json();
        setPopupMessage(`${data.species}`); // set the "bird identified" popup to the species identified
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
        <Pressable onPress={identifyBird} style={tw`bg-sky-400 p-2 px-8 rounded-full`}>
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

      {popupVisible && <Popup onCancel={closePopup} onSave={fetchBirds} message={popupMessage} birdImage={imageUri} />}
    </View>
  );
};

// popup component that appears with the bird species identified
const Popup: React.FC<{ onCancel: () => void; onSave: () => void; message: string; birdImage: string | undefined }> = ({ onCancel, onSave, message, birdImage }) => {
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
            <Pressable onPress={onSave} style={tw`bg-sky-400 p-2 px-6 flex items-center justify-center rounded-full`}>
              <Text style={tw`text-white text-center font-semibold`}>Save</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </View>
  );
};

export default Home;
