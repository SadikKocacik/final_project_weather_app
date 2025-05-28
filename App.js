import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherScreen from './screens/WeatherScreen';
import PopularCitiesScreen from './screens/PopularCitiesScreen';
import { Ionicons } from '@expo/vector-icons';
import FavoriteCitiesScreen from './screens/FavoriteCitiesScreen';
const Tab = createBottomTabNavigator();
import { FavoritesProvider } from './components/FavoritesContext';

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Ana Sayfa') {
              iconName = 'home';
            } else if (route.name === 'Popüler Şehirler') {
              iconName = 'globe';
            } else if (route.name === 'Favoriler') {
              iconName = 'heart';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4682b4',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Ana Sayfa" component={WeatherScreen} />
        <Tab.Screen name="Popüler Şehirler" component={PopularCitiesScreen} />
        <Tab.Screen name="Favoriler" component={FavoriteCitiesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    </FavoritesProvider>
  );
}
