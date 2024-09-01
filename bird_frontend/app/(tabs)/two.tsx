import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import tw from 'twrnc';

export type Bird = {
  image: string;
  species: string;
};

type ProfileProps = {
  birds: Bird[];
};

export default function Profile({ birds }: ProfileProps) {
  const [loading, setLoading] = useState<boolean>(true);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birds Information</Text>
      <FlatList
        data={birds}
        keyExtractor={(item) => item.species}
        renderItem={({ item }) => (
          <View style={styles.birdContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.species}>{item.species}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  birdContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  species: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  error: {
    color: 'red',
  },
});
