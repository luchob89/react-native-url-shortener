import React from "react";
import { Text, TextInput, View, ActivityIndicator, ImageBackground, ScrollView, TouchableOpacity, Platform } from "react-native";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Linking from 'expo-linking';

// API URL
const API_URL = 'https://fcc-url-shortener-microservice-production.up.railway.app/api/shorturl';

// AppState type
type AppState = 'waiting' | 'loading' | 'success' | 'error';

// URLObject type
interface URLObject {
  url: string;
  short_url: number;
}

// Async API call function
const APICall = async (url: string) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url })
    });
    if ( !response.ok ) throw new Error('Error');
    return await response.json();
  }
  catch (e) {
    console.log(e);
  }
}

// Added URL Item component
const Item = ({ url, short_url }: URLObject) => (
  <View className="flex flex-row gap-2 items-center justify-between w-5/6 bg-gray-200 p-5 rounded-xl mb-2">
    <Text numberOfLines={3} ellipsizeMode="tail" className="text-md italic" style={{width:'60%'}}>{url}</Text>
    <FontAwesome name="hand-o-right" size={24} color="black" />
    <TouchableOpacity onPress={() => Linking.openURL(`${API_URL}/${short_url}`)} className="bg-blue-500 p-2 rounded-md">
      <Text className="text-blue-50 text-center font-bold text-md">Visit it!</Text>
    </TouchableOpacity>
  </View>
);

// Main component
export default function Index() {

  // State management
  const [appState, setAppState] = React.useState<AppState>('waiting');
  const [userInput, setUserInput] = React.useState<string>('');
  const [URLsArray, setURLsArray] = React.useState<URLObject[]>([]);

  // Submit handler
  const onPressFunction = async () => {
    // Has to start with "http"
    if ( !userInput.includes('http') ) return setAppState('error');
    // Reset the state
    setAppState('loading');
    // Make the API call
    const response = await APICall(userInput);
    // If there is an error or no response, set the state to error
    if ( response.error || !response.original_url ) return setAppState('error');
    // Create a new object with the response
    const newURLObject = { url: response.original_url, short_url: response.short_url };
    // Add the new object to the array
    setURLsArray([...URLsArray, newURLObject]);
    // Show success message
    setAppState('success');
  }

  // Input change handler
  const handleInputChange = (e: string) => {
    setUserInput(e);
    setAppState('waiting');
  }

  const paddingVerticalScrollView = Platform.OS === 'ios' ? 50 : 20;

  return (
    <SafeAreaProvider>
      <ImageBackground source={require('@/assets/images/fondoamor.jpg')} resizeMode="cover" className="w-screen h-screen">
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingVertical: paddingVerticalScrollView, gap: 5 }}
        >
        <Text className="text-5xl text-gray-50 my-4" style={{fontFamily: 'MachineryScript'}}>Welcome!</Text>
        <Text className="text-2xl text-gray-50 text-center mx-3" style={{fontFamily: 'GoodMatcha'}}>Enter any URL to shorten it.{"\n"} Then you can visit it with just one click!</Text>
        <View className="flex flex-col items-center justify-center w-full my-4">
          <Text className="text-md mb-5 text-gray-50">Example:</Text>
          <View className="flex flex-row gap-2 items-center justify-between w-5/6 bg-gray-200 shadow-xl p-5 rounded-xl">
            <Text className="text-md italic" style={{width:'60%'}}>https://www.google.com</Text>
            <FontAwesome name="hand-o-right" size={24} color="black" />
            <TouchableOpacity onPress={() => Linking.openURL(`${API_URL}/15918`)} className="bg-blue-500 p-2 rounded-md ">
              <Text className="text-gray-50 text-center font-bold text-md">Visit it!</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-xs text-gray-300 self-start ml-10"><Text className="font-bold">Note:</Text> valid URL has to start with "http(s)://...". <Text className="font-bold">Copy, paste!</Text></Text>
        <TextInput 
          onChangeText={handleInputChange}
          value={userInput}
          className="border border-[#444] p-5 rounded-xl bg-[#222] text-slate-200  placeholder:text-gray-500 w-5/6 "
          style={{borderColor: appState === 'error'? 'red' : '#222'}}
          placeholder="Enter URL here..."
          returnKeyType="done"
        />
        {appState === 'error' && <Text className="text-red-600 text-md"><Text className="font-bold">Error!</Text> Please try again</Text>}

        <TouchableOpacity 
          onPress={onPressFunction} 
          className="bg-blue-500 p-3 rounded-md w-1/3 disabled:bg-slate-500 my-2 shadow-xl" 
          disabled={appState === 'loading' || userInput === ''}
        >
          <Text className="text-gray-50 text-center text-2xl" style={{fontFamily: 'MachineryScript'}}>Submit</Text>
        </TouchableOpacity>

        {appState === 'loading' && <ActivityIndicator size="large" color="#fff" />}
        {appState === 'success' && <Text className="text-green-700 text-lg bg-green-200 p-2 w-5/6 text-center rounded-lg mb-2"><Text className="font-bold">Success!</Text> URL saved successfully</Text>}

        {URLsArray.length > 0 &&
          URLsArray.map((item, index) => (
            <Item key={index} url={item.url} short_url={item.short_url} />
          ))
        }
        </ScrollView>
      </ImageBackground>
    </SafeAreaProvider>
  );
}
