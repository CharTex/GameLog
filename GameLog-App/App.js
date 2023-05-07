import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
} from "./screens"

const LoginTabs = createMaterialBottomTabNavigator();

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

export default function App() {
  return (
    <NavigationContainer>
      <LoginNavbar />
    </NavigationContainer>
  );
}
