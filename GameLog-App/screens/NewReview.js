import * as React from 'react'

import { useState, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Text,
} from "react-native";

import { NativeBaseProvider } from "native-base";

import StarRating from 'react-native-star-rating-widget';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Location from 'expo-location';


export default function NewReview({ navigation }) {

    const [gameName, setGameName] = useState({ value: '', error: '' });
    const [gameDeveloper, setGameDeveloper] = useState({ value: '', error: '' });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState({ value: '', error: '' });

    const [locationCheckboxState, setLocationCheckboxState] = React.useState(false);
    const [publicCheckboxState, setPublicCheckboxState] = React.useState(false);

    const [isCoords, setCoords] = useState()
    const [token, setToken] = useState(0)


    // If running on android, use a loopback IP.
    let ip = ""
    if (Platform.OS == 'web') {
        ip = "http://localhost:8000/"
    }
    else {
        ip = "http://10.0.2.2:8000/"
    }

    // onLoad = async () => {
    //     try {
    //         const storedValue = await AsyncStorage.getItem("@access_token");
    //         setToken(storedValue);
    //     } catch (error) {
    //         Alert.alert('Error', 'There was an error.')
    //     }
    // }

    useEffect(() => {
        const getLocationPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
          if ( 'granted' === status ) {
            let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({})
            setCoords({ latitude, longitude })
          }
        }
        getLocationPermissions()
      }, [])

    function saveReview() {

        getToken().then((token) => {
            let locationString = "None"

        if (isCoords != undefined && locationCheckboxState == true) {
            locationString = isCoords.latitude + "," + isCoords.longitude
        }

        fetch(ip + "reviews", {
            method: 'POST',
            headers: {
              "accept": "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                "game_name": gameName.value,
                "game_developer": gameDeveloper.value,
                "rating": rating,
                "comment": comment.value,
                "location": locationString,
                "public": publicCheckboxState
                  })
          }).then(response => {
            if (response.ok) {
              return response.json()
            }
            else if (response.status === 422) {
              return Promise.reject("Incorrect data sent? Contact a Systems Administrator.")
            }
            else if (response.status === 401) {
              return Promise.reject("Invalid/Expired Authentication. Please log in again.")
            }
            else {
              return Promise.reject("Could not connect to server. Try again later.")
            }
          })
            .then(data => {
                alert("Review Created!")
                setGameName({ value: "", error: '' })
                setGameDeveloper({ value: "", error: '' })
                setRating(0)
                setComment({ value: "", error: '' })
                setLocationCheckboxState(false)
                setPublicCheckboxState(false)
                navigation.navigate("UserHome")
            })
            .catch(error => alert(error))
          }
        )
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

    function invalidCharactersTest(toTest) {
        // Function to remove characters like "" to avoid SQL injection.
        if (toTest.contains('"') || toTest.contains("'")) {
            return false
        }
    }

    function getLocation(checkStatus) {
        
        let locationGot = false
        let latitude = false
        let longitude = false

        try {
            latitude = isCoords.latitude
            longitude = isCoords.longitude
            locationGot = true
            // Double check location
            if (latitude == 0 || longitude == 0) {
                locationGot = false
                alert("Location Refused by OS")
            }
        }
        catch(err) {
            locationGot = false
            alert("Location Refused by OS")
        }

        if (checkStatus) {
            if (locationGot) {
                setLocationCheckboxState(true)
                return
            }
        }

        setLocationCheckboxState(false)
    }

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <Text style={styles.inputTitle}>Game Name:</Text>
                <View style={styles.inputView}>
                    <TextInput textAlign="center" style={styles.inputText} value={gameName.value} onChangeText={(text) => setGameName({ value: text, error: '' })} />
                </View>
                <Text style={styles.inputTitle}>Game Developer:</Text>
                <View style={styles.inputView}>
                    <TextInput textAlign="center" style={styles.inputText} value={gameDeveloper.value} onChangeText={(text) => setGameDeveloper({ value: text, error: '' })} />
                </View>
                <Text style={styles.inputTitle}>Review Score:</Text>
                <StarRating
                    rating={rating}
                    onChange={setRating}
                    maxStars={5}
                    enableHalfStar={true}
                />
                <Text style={styles.textfix}>Comment:</Text>
                <View style={styles.inputView}>
                    <TextInput textAlign="center" style={styles.inputText} value={comment.value} placeholderTextColor="#003f5c" onChangeText={(text) => setComment({ value: text, error: '' })} />
                </View>
                <BouncyCheckbox
                    style={{ marginTop: 16 }}
                    isChecked={locationCheckboxState}
                    text="Submit Location Data?"
                    disableBuiltInState
                    textStyle={{
                        textDecorationLine: "none",
                        color: "black"
                    }}
                    onPress={() => getLocation(!locationCheckboxState)}
                />
                <BouncyCheckbox
                    style={{ marginTop: 16 }}
                    isChecked={publicCheckboxState}
                    text="Make Review Public?"
                    disableBuiltInState
                    textStyle={{
                        textDecorationLine: "none",
                        color: "black"
                    }}
                    onPress={() => setPublicCheckboxState(!publicCheckboxState)}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={saveReview}>
                    <Text>Save Review</Text>
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
    saveBtn: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    inputText: {
        height: 50,
        color: "white"
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
    inputTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textfix: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 15
    }
});
