import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

type PopupProps = {
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ onClose }) => {
    const colorScheme = useColorScheme();

    return (
    <View style={styles.popupContainer}>
        <View style={styles.popup}>
        <Pressable onPress={onClose}>
            <Text
                    style={{
                    marginRight: 15,
                    fontFamily: 'MaterialSymbolsRounded',
                    fontSize: 28,
                    color: Colors[colorScheme ?? 'light'].text,
                    }}
                >
                    close
            </Text>        
        </Pressable>
        <Text>This is the popup content!</Text>
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
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
  },
});

export default Popup;
