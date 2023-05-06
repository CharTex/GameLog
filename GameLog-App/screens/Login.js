import * as React from 'react'

import { AsyncStorage } from 'react-native';

import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native"

import { Button, NativeBaseProvider, Text, Box } from "native-base";


export default function LoginScreen({ navigation }) {
  let email = ""
  let password = ""
  let logo = require("../assets/logo-nobg.png")

  async function ping_API() {
    let response = await fetch("http://localhost:8000/logintoken");
    let data = await response.json();
    alert(data);
  }

  return (
    <NativeBaseProvider>

      <View style={styles.container}>
        <View style={styles.loginbox}>
          <Image source={logo}></Image>
          <View style={styles.row}>
            <Text>Email:       </Text>
            <TextInput
              label="Email"
              returnKeyType="next"
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: '' })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              style={styles.inputView}
            />
          </View>
          <View style={styles.row}>
            <Text>Password: </Text>
            <TextInput
              label="Password"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: '' })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
              style={styles.inputView}
            />
          </View>
          <Button style={styles.loginBtn} title="Login" onPress={() => ping_API()}>Login</Button>
        </View>
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
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  loginbox: {
    backgroundColor: "lightgrey",
  },
  image: {
    flex: 2,
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "right",
  },
  loginBtn: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
    color: "white",
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
