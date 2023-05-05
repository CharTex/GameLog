import * as React from 'react'
import {DarkTheme, NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {AsyncStorage} from 'react-native';

import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native"

import { Button, NativeBaseProvider, Text, Box } from "native-base";
import { Provider as PaperProvider, MD3DarkTheme as DefaultTheme } from 'react-native-paper';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack'


export default function RegisterScreen({ navigation }) {
    return (
      <NativeBaseProvider>
        <View style={styles.container}>
        <Button onPress={() => ping_API()}>
        Click Me!
        </Button>
      <Text>Register Page!</Text>
      </View>
      </NativeBaseProvider>
    )
  }

  async function ping_API() {
    let response = await fetch("http://localhost:8000/logintoken");
    let data = await response.json();
    alert(data);
    }

  
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      marginBottom: 40,
    },
    inputView: {
      backgroundColor: "#FFC0CB",
      borderRadius: 30,
      width: "70%",
      height: 45,
      marginBottom: 20,
      alignItems: "center",
    },
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
    },
    forgot_button: {
      height: 30,
      marginBottom: 30,
    },
    loginBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#FF1493",
    },
  });
  