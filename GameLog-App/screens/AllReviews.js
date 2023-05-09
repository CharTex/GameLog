import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card } from '@rneui/themed';

import { useIsFocused } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    StyleSheet,
    View,
    Platform,
    Text,
    FlatList,
    ActivityIndicator
} from "react-native";

export default function AllReviews({ navigation }) {

    // If running on android, use a loopback IP.
    let ip = ""
    if (Platform.OS == 'web') {
        ip = "http://localhost:8000/"
    }
    else {
        ip = "http://10.0.2.2:8000/"
    }

    const [isLoading, setLoading] = useState(true);
    const [reviews, setReviews] = useState({});
    const [me, setMe] = useState(0);

    const getToken = async () => {
        // Retrieve the login token from unencrypted local storage.
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
                return value
            }
        } catch (e) {
            alert(e)
            alert("Error reading local storage!")
            return false
        }
    }

    const getMe = async () => {
        getToken().then((token) => {

            fetch(ip + "me", {
                method: 'GET',
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
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
                    setMe(data.account_type)
                    return data.account_type
                })
                .catch(error => alert(error))
        }
        )
    }

    const getReviews = async () => {
        getToken().then((token) => {

            fetch(ip + "reviews", {
                method: 'GET',
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
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
                    setReviews(data)
                    setLoading(false)
                    return data
                })
                .catch(error => alert(error))
        }
        )
    }

    const renderReview = ({ item }) => {
        return (
            <Card styles={[styles.card]}>
                <Card.Title>Username: {item.username}</Card.Title>
                <Card.Divider/>
                <Text style={{ marginBottom: 10 }}>
                    Game Name: {item.game_name}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Game Developer: {item.game_developer}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Game Rating: {item.rating}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Comments: {item.comment}
                </Text>
            </Card>
        )
    }

    const renderAdmin = ({ item }) => {
        return (
            <Card styles={[styles.card]}>
                <Card.Title>Username: {item.username}</Card.Title>
                <Card.Divider/>
                <Text style={{ marginBottom: 10 }}>
                    Game Name: {item.game_name}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Game Developer: {item.game_developer}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Game Rating: {item.rating}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Comments: {item.comment}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Location: {item.location}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Public: {item.public}
                </Text>

            </Card>
        )
    }

    const isFocused = useIsFocused()

    useEffect(() => {
        if(isFocused){
            getMe().then()
            getReviews().then()
        }
    }, [isFocused])


    if (isLoading) {
        getReviews().then()
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        )
    }

    if (me == "admin") {
        return (
            <View style={[styles.container]}>
                <FlatList
                    data={reviews}
                    renderItem={renderAdmin}
                    keyExtractor={review => review.id}
                />
            </View>
        )
    }
    else {
        alert(me)
    }

    return (
        <View style={[styles.container]}>
            <FlatList
                data={reviews}
                renderItem={renderReview}
                keyExtractor={review => review.id}
            />
        </View>
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
    card: {
        borderRadius: 3,
        borderColor: "black",
    }
});
