import React from 'react';
import { View, Text, Pressable } from 'react-native';
import tw from 'twrnc';

type PopupProps = {
    onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ onClose }) => {
    return (
        <View style={tw`absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]`}>
            <View style={tw`w-3/4 max-w-[300px] p-4 bg-white rounded-xl`}>
                <View style={tw`w-full flex justify-end`}>
                    <Pressable onPress={onClose}>
                        <Text
                            style={{
                                fontFamily: 'MaterialSymbolsRounded',
                                fontSize: 24,
                                color: '#334155',
                                marginLeft: 'auto'
                            }}
                        >
                            close
                        </Text>
                    </Pressable>
                </View>

                <View style={tw`flex flex-col items-center justify-center gap-5`}>
                    <Text style={tw`text-2xl text-slate-700 text-center font-bold`}>Tips for bird identification</Text>

                    <View style={tw`flex flex-row w-3/4 items-center justify-center gap-2`}>
                        <View style={tw`flex flex-col w-1/3 items-center justify-center gap-2`}>
                            <View style={tw`h-[90px] flex items-center justify-center`}>
                                <Text
                                    style={{
                                        fontFamily: 'MaterialSymbolsRounded',
                                        fontSize: 50,
                                        color: '#334155',
                                        textAlign: 'center',
                                    }}
                                >
                                    Raven
                                </Text>
                            </View>

                            <View style={tw`h-[90px] flex items-center justify-center`}>
                                <Text
                                    style={{
                                        fontFamily: 'MaterialSymbolsRounded',
                                        fontSize: 24,
                                        color: '#334155',
                                        textAlign: 'center',
                                    }}
                                >
                                    Raven
                                </Text>
                            </View>

                            <View style={tw`h-[90px] flex items-center justify-center`}>
                                <Text
                                    style={{
                                        fontFamily: 'MaterialSymbolsRounded',
                                        fontSize: 50,
                                        color: '#334155',
                                        textAlign: 'center',
                                        opacity: 0.3,
                                    }}
                                >
                                    Raven
                                </Text>
                            </View>

                            <View style={tw`h-[90px] flex items-center justify-center relative`}>
                                {/* top bird */}
                                <Text
                                    style={{
                                        fontFamily: 'MaterialSymbolsRounded',
                                        fontSize: 24,
                                        color: '#334155',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        left: -20,
                                        top: 50,
                                    }}
                                >
                                    Raven
                                </Text>

                                {/* middle bird */}
                                <Text
                                    style={{
                                        fontFamily: 'MaterialSymbolsRounded',
                                        fontSize: 24,
                                        color: '#334155',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        left: 5,
                                        top: 30,
                                    }}
                                >
                                    Raven
                                </Text>

                                {/* bottom bird */}
                                <Text
                                    style={{
                                        fontFamily: 'MaterialSymbolsRounded',
                                        fontSize: 24,
                                        color: '#334155',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        left: -20,
                                        top: 10,
                                    }}
                                >
                                    Raven
                                </Text>
                            </View>
                        </View>

                        <View style={tw`flex flex-col w-2/3 items-center justify-center gap-2`}>
                            <View style={tw`flex h-[90px] items-center justify-center`}>
                                <Text style={tw`text-lg flex text-slate-700 text-center font-base`}>Centered, focused and in frame</Text>
                            </View>

                            <View style={tw`flex h-[90px] items-center justify-center`}>
                                <Text style={tw`text-lg flex text-slate-700 text-center font-base`}>Too small</Text>
                            </View>

                            <View style={tw`flex h-[90px] items-center justify-center`}>
                                <Text style={tw`text-lg flex text-slate-700 text-center font-base`}>Too blurry</Text>
                            </View>

                            <View style={tw`flex h-[90px] items-center justify-center`}>
                                <Text style={tw`text-lg flex text-slate-700 text-center font-base`}>Multiple birds/species visible</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Popup;
