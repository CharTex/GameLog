import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {AsyncStorage} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Button, NativeBaseProvider, Text, Box } from "native-base";
import { Provider as PaperProvider } from 'react-native-paper';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginImage = require("./assets/final-fantasy-16-artwork.png");

const Tab = createMaterialBottomTabNavigator();

async function ping_API() {
    let response = await fetch("http://localhost:8000/logintoken");
    let data = await response.json();
    alert(data);
}

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Tab.Navigator
      initialRouteName="Login"
      activeColor="green"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: 'grey', borderTopWidth:"5px" }}>

        <Tab.Screen 
        name="Login"
        component={LoginScreen}
        options={{title: 'Login',
        tabBarLabel: "Login",
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="account" color={"black"} size={35}/>)}}
         />

         <Tab.Screen 
        name="Register"
        component={RegisterScreen}
        options={{title: 'Register',
        tabBarLabel: "Register",
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="account" color={"black"} size={35}/>)}}
         />
      </Tab.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

const LoginScreen = ({navigation}) => {
  return (
      <NativeBaseProvider>
      <View style={styles.container}>
      <Button onPress={() => ping_API()}>
      Click Me!
      </Button>
    <Text>Hello World!</Text>
    </View>
    </NativeBaseProvider>
  );
}

const RegisterScreen = ({navigation}) => {
  return (
      <NativeBaseProvider>
      <View style={styles.container}>
      <Button onPress={() => ping_API()}>
      Click Me!
      </Button>
    <Text>Register Page!</Text>
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
