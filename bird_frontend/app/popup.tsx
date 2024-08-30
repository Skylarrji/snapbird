import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import tw from 'twrnc';


type PopupProps = {
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ onClose }) => {
    const colorScheme = useColorScheme();

    return (
    <View style={styles.popupContainer}>
        <View style={tw`w-1/2 p-4 bg-white rounded-lg`}>
        
        <View style={tw`flex w-full justify-end`}>
            <Pressable onPress={onClose}>
                <Text
                        style={{
                        fontFamily: 'MaterialSymbolsRounded',
                        fontSize: 24,
                        color: Colors[colorScheme ?? 'light'].text,
                        marginLeft: 'auto'
                        }}
                    >
                        close
                </Text>        
            </Pressable>
        </View>

        <View style={tw`flex flex-col items-center justify-center gap-5`}>
            <Text style={tw`text-2xl text-slate-700 text-center font-bold`}>Tips for bird identification</Text>
            
            <View style={tw`flex flex-row items-center justify-center gap-2`}>
                <View style={tw`flex flex-col items-center justify-center gap-8`}>
                    <Text
                        style={{
                        fontFamily: 'MaterialSymbolsRounded',
                        fontSize: 50,
                        color: Colors[colorScheme ?? 'light'].text,
                        }}
                    >
                            Raven
                    </Text> 

                    <Text
                        style={{
                        fontFamily: 'MaterialSymbolsRounded',
                        fontSize: 20,
                        color: Colors[colorScheme ?? 'light'].text,
                        }}
                    >
                        Raven
                    </Text> 
                </View>

                <View style={tw`flex flex-col items-center justify-center gap-10 w-1/2`}>
                    <Text style={tw`text-lg text-slate-700 text-center font-base`}>Centered, focused and in frame</Text>
                    <Text style={tw`text-lg text-slate-700 text-center font-base`}>Too small</Text>
                </View>
            </View>
        </View>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
  },
});

export default Popup;
