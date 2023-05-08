import * as React from 'react'

import { useState, useEffect } from 'react'

import { AsyncStorage } from 'react-native';

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

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [locationPermission, setLocationPermission] = useState(false)
    const [isCoords, setCoords] = useState()

    // If running on android, use a loopback IP.
    let ip = ""
    if (Platform.OS == 'web') {
        ip = "http://localhost:8000/"
    }
    else {
        ip = "http://10.0.2.2:8000/"
    }

    useEffect(() => {
        const getLocationPermissions = async () => {
            alert("Checked")
        let { status } = await Location.requestForegroundPermissionsAsync();
          if ( 'granted' === status ) {
            await setLocationPermission( true );
            let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({})
            setCoords({ latitude, longitude })
          }
        }
        getLocationPermissions()
      }, [])

    function saveReview() {
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
                    ref={(ref) => (bouncyCheckboxRef = ref)}
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
                    ref={(ref) => (bouncyCheckboxRef = ref)}
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
