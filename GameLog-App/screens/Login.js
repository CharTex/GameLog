import * as React from 'react'
import { useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Text,
} from "react-native";

import { NativeBaseProvider } from "native-base";



export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const [token, setToken] = useState(0)

  // If running on android, use a loopback IP.
  let ip = ""
  if (Platform.OS == 'web') {
    ip = "http://localhost:8000/"
  }
  else {
    ip = "http://10.0.2.2:8000/"
  }

  const storeToken = async (value) => {
    // Save the login token to unencrypted local storage.
    try {
      await AsyncStorage.setItem('@storage_Key', value)
      return true
    } catch (e) {
      alert("Error saving to local storage!")
      return false
    }
  }

  const getToken = async () => {
    // Retrieve the login token from unencrypted local storage.
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        return value
      }
    } catch(e) {
      alert("Error reading local storage!")
      return false
    }
  }


  function validateUsername() {
    if (username.value.length <= 3) {
      alert("Username must be more than 3 characters")
      return false
    }
    // Disallow special characters to avoid SQL Injection.
    const onlyLettersPattern = /^[a-z0-9]+$/i;
    if (! /^[a-z0-9]+$/i.test(username.value)) {
      alert("Username cannot contain special characters or spaces!")
      return false

    }
    return true
  }

  const login = async (value) => {
    // Validate fields
    if (!validateUsername()) {
      return false
    }

    // Generate the string that will be sent to the API Server.
    let post_string = "grant_type=&username=" + username.value +
      "&password=" + password.value + "&scope=&client_id=&client_secret="


    fetch(ip + "login", {
      method: 'POST',
      headers: {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: post_string
    }).then(response => {
      if (response.ok) {
        return response.json()
      }
      else if (response.status === 422) {
        return Promise.reject("Incorrect data sent? Contact a Systems Administrator.")
      }
      else if (response.status === 401) {
        return Promise.reject("Incorrect Username or Password.")
      }
      else {
        return Promise.reject("Could not connect to server. Try again later.")
      }
    })
      .then(data => {
        alert("Login Successful")
        setUsername({ value: "", error: '' })
        setPassword({ value: "", error: '' })

        // Save the token
        storeToken(data.access_token)

        // Immediately get the token after to confirm it saved.
        getToken().then((value) => {
          console.log("Retreved Data: " + value)
        }
        )

        // Change to the main page.
        navigation.navigate("MainNavigation", { screen: "UserHome" })
      })
      .catch(error => alert(error))
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Text style={styles.title}> GameLog</Text>
        <Text style={styles.inputTitle}>Username:</Text>
        <View style={styles.inputView}>
          <TextInput textAlign="center" style={styles.inputText} value={username.value} onChangeText={(text) => setUsername({ value: text, error: '' })} />
        </View>
        <Text style={styles.inputTitle}>Password:</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} secureTextEntryplaceholder="Password" value={password.value} secureTextEntry placeholderTextColor="#003f5c" onChangeText={(text) => setPassword({ value: text, error: '' })} />
        </View>
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
  title: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#fb5b5a",
    marginBottom: 40,
    paddingTop: 30
  },

  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#3AB4BA",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  forgotPasswordText: {
    color: "white",
    fontSize: 15
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
});
