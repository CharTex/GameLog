import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  RegisterScreen,
  UserHome,
  AllReviews,
  NewReview
} from "./screens"

const LoginTabs = createMaterialBottomTabNavigator();
const MainTabs = createMaterialBottomTabNavigator();
const NavigationStack = createNativeStackNavigator();

function LoginNavbar() {
  return (
    <LoginTabs.Navigator
      initialRouteName="Login"
      activeColor="red"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
    >
      <LoginTabs.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarLabel: 'Login',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <LoginTabs.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
    </LoginTabs.Navigator>
  );
}

function MainNavbar() {
  return (
    <MainTabs.Navigator
      initialRouteName="UserHome"
      activeColor="red"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
    >
      <MainTabs.Screen
        name="UserHome"
        component={UserHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <MainTabs.Screen
        name="AllReviews"
        component={AllReviews}
        options={{
          tabBarLabel: 'All Public Reviews',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
      <MainTabs.Screen
        name="NewReview"
        component={NewReview}
        options={{
          tabBarLabel: 'New Review',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-edit" color={color} size={26} />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
}

export default function App() {
  return (
    
    <NavigationContainer>
      <NavigationStack.Navigator
      initialRouteName="LoginNavigation"
  screenOptions={{
    headerShown: false
  }}
>
  <NavigationStack.Screen name="LoginNavigation" component={LoginNavbar} />
  <NavigationStack.Screen name="MainNavigation" component={MainNavbar} />
</NavigationStack.Navigator>
    </NavigationContainer>
  );
}
