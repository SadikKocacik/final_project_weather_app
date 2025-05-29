import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import WeatherScreen from './screens/WeatherScreen';
import PopularCitiesScreen from './screens/PopularCitiesScreen';
import { Ionicons } from '@expo/vector-icons';
import FavoriteCitiesScreen from './screens/FavoriteCitiesScreen';
const Tab = createBottomTabNavigator();
import { FavoritesProvider } from './components/FavoritesContext';

export default function App() {
  return (
    <FavoritesProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4682b4" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Ana Sayfa') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Popüler Şehirler') {
                iconName = focused ? 'globe' : 'globe-outline';
              } else if (route.name === 'Favoriler') {
                iconName = focused ? 'heart' : 'heart-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4682b4',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              height: 60,
              paddingBottom: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: '#4682b4',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Ana Sayfa" 
            component={WeatherScreen}
            options={{
              title: 'Hava Durumu',
            }}
          />
          <Tab.Screen 
            name="Popüler Şehirler" 
            component={PopularCitiesScreen}
            options={{
              title: 'Popüler Şehirler',
            }}
          />
          <Tab.Screen 
            name="Favoriler" 
            component={FavoriteCitiesScreen}
            options={{
              title: 'Favori Şehirler',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
