import * as React from 'react'
import { useState } from 'react'

import { AsyncStorage } from 'react-native';

import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Text
} from "react-native";

import { NativeBaseProvider} from "native-base";



export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  let logo = require("../assets/logo-nobg.png")
  let ip = ""
  let tempwidth = "100%"

  if (Platform.OS == 'web') {
    ip = "http://localhost:8000/"
  }
  else {
    ip = "http://10.0.2.2:8000/"
  }

  const login = async () => {
    const response = await fetch(ip + "login", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": username.value,
        "password": password.value
      }),
    })
    const responsetwo = await response
    console.log(response.status)
    if (response.status == 200) {
      alert("Yeah") // Web Specific Alert
      //Alert.alert("Success", "Logged In Successfully") // IOS/Android Specific Alert
    }
    else {
      alert("Help") // Web Specific Alert
      //Alert.alert("Failure", "Unknown Error Occured") // IOS/Android Specific Alert
    }
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Text style={styles.title}> GameLog</Text>
        <Text style={styles.inputTitle}>Username:</Text>
        <View style={styles.inputView}>
          <TextInput textAlign="center" style={styles.inputText} onChangeText={(text) => setUsername({ value: text, error: '' })} />
        </View>
        <Text style={styles.inputTitle}>Password:</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} secureTextEntryplaceholder="Password" secureTextEntry placeholderTextColor="#003f5c" onChangeText={(text) => setPassword({ value: text, error: '' })} />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={login}>
          <Text style={styles.loginText}>LOGIN </Text>
        </TouchableOpacity>
      </View >
    </NativeBaseProvider >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontWeight: "bold",
    fontSize:30,
    color:"#fb5b5a",
    marginBottom: 40,
    paddingTop: 30
  },

  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputView: {
  width:"80%",
  backgroundColor:"#3AB4BA",
  borderRadius:25,
  height:50,
  marginBottom:20,
  justifyContent:"center",
  padding:20
  },
  inputText: {
    height:50,
    color:"white"
  },
  forgotPasswordText:{
    color:"white",
    fontSize:15
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
});
