import * as React from 'react'
import { useState } from 'react'

import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";

import { NativeBaseProvider } from "native-base";



export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });

  // If running on android, use a loopback IP.
  let ip = ""
  if (Platform.OS == 'web') {
    ip = "http://localhost:8000/"
  }
  else {
    ip = "http://10.0.2.2:8000/"
  }


  function validateEmail() {
    // Generic Email Validation Regex
    if (email.value.length <= 1 || !email.value) {
      alert("Email must be provided.")
      return false
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
      return true
    }
    alert("Invalid Email.")
    return false
  }

  function validateUsername() {
    // Ensure username meets length limits.
    if (username.value.length <= 3) {
      alert("Username must be more than 3 characters")
      return false
    }
    // Disallow special characters to avoid SQL Injection.
    const onlyLettersPattern = /^[a-z0-9]+$/i;
    if (! /^[a-z0-9]+$/i.test(username.value)) {
      alert("Username cannot contain special characters!")
      return false

    }
    return true
  }

  function validatePassword() {
    // Passwords must contain a uppercase, lowercase, numeral and special character.
    if (! /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{5,20}$/.test(password.value)) {
      alert("Passwords must be between 5 and 20 characters and have an uppercase, lowercase, numeric and special character.")
      return false
    }

    if (!password.value == confirmPassword.value) {
      alert("Passwords are not the same.")
      return false
    }
    return true
  }

  const register = async () => {
    // Validate fields
    if (!validateUsername() || !validateEmail() || !validatePassword()) {
      return false
    }

    // Send the POST Request
    fetch(ip + "accounts", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email.value,
        "username": username.value,
        "password": password.value
      })
    }).then(response => {
      if (response.ok) {
        return response.json()
      }
      else if (response.status === 422) {
        return Promise.reject("Incorrect data sent? Contact a Systems Administrator.")
      }
      else if (response.status === 401) {
        return Promise.reject("New accounts temporarily unavailable. Please try again later.")
      }
      else if (response.status === 500) {
        return Promise.reject("Server-Side verification error. Contact a Systems Administrator")
      }
      else if (response.status === 409) {
        return Promise.reject("Username or Email already in use.")
      }
      else {
        return Promise.reject("Could not connect to server. Try again later.")
      }
    })
      .then(data => {
        // No error codes, so reset the UI and take the user to the login screen.
        alert("Account Created. Please log in.")
        setEmail({ value: "", error: '' })
        setUsername({ value: "", error: '' })
        setPassword({ value: "", error: '' })
        setConfirmPassword({ value: "", error: '' })
        navigation.navigate("Login")
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
        <Text style={styles.inputTitle}>Email:</Text>
        <View style={styles.inputView}>
          <TextInput textAlign="center" style={styles.inputText} value={email.value} onChangeText={(text) => setEmail({ value: text, error: '' })} />
        </View>
        <Text style={styles.inputTitle}>Password:</Text>
        <View style={styles.inputView}>
          <TextInput textAlign="center" style={styles.inputText} value={password.value} secureTextEntryplaceholder="Password" secureTextEntry placeholderTextColor="#003f5c" onChangeText={(text) => setPassword({ value: text, error: '' })} />
        </View>
        <Text style={styles.inputTitle}>Confirm Password:</Text>
        <View style={styles.inputView}>
          <TextInput textAlign="center" style={styles.inputText} value={confirmPassword.value} secureTextEntryplaceholder="Confirm Password" secureTextEntry placeholderTextColor="#003f5c" onChangeText={(text) => setConfirmPassword({ value: text, error: '' })} />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={register}>
          <Text style={styles.loginText}>Register</Text>
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
