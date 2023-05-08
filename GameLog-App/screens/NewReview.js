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

import { NativeBaseProvider } from "native-base";



export default function NewReview({ navigation }) {

    // If running on android, use a loopback IP.
    let ip = ""
    if (Platform.OS == 'web') {
        ip = "http://localhost:8000/"
    }
    else {
        ip = "http://10.0.2.2:8000/"
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
});
