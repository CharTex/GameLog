import React from "react";

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Button, NativeBaseProvider, Text, Box } from "native-base";

const LoginImage = require("./assets/final-fantasy-16-artwork.png");

async function ping_API() {
    let response = await fetch("http://localhost:8000/logintoken");
    let data = await response.json();
    alert(data);
}

export default function App() {
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
      <Button onPress={() => ping_API()}>
      Click Me Bozo!
      </Button>
    <Text>Hello World!</Text>
    </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
