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



export default function UserHome({ navigation }) {

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
                <Text>UserHome!</Text>
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
