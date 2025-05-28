import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
const WeatherScreen = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const { addToFavorites } = useFavorites();  
  const fetchWeather = async () => {
    try {
      const API_KEY = '1e6470aac8b245f781330e8a02b960cf'; // Örn: OpenWeatherMap
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.log('Hata:', error);
    }
  };
const handleAddToFavorites = () => {
    if (weatherData) {
      addToFavorites(weatherData); // tüm weather objesini ekliyoruz
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hava Durumu</Text>

      <TextInput
        style={styles.input}
        placeholder="Şehir Girin (örn: İstanbul)"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Ara</Text>
      </TouchableOpacity>

      {weatherData && weatherData.main && (
        <View style={styles.result}>
          <Text style={styles.city}>{weatherData.name}</Text>
          <Image
            style={styles.icon}
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            }}
          />
          <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text style={styles.description}>{weatherData.weather[0].description}</Text>

          <View style={styles.extra}>
            <Text>Nem: {weatherData.main.humidity}%</Text>
            <Text>Rüzgar: {weatherData.wind.speed} m/s</Text>
          </View>
          <View>
      
      <TouchableOpacity onPress={handleAddToFavorites} style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Favorilere Ekle</Text>
      </TouchableOpacity>
    </View>
        </View>
      )}
    </View>
  );
};

export default WeatherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87ceeb',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4682b4',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  result: {
    alignItems: 'center',
  },
  city: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 100,
    height: 100,
  },
  temp: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'capitalize',
    color: '#fff',
  },
  extra: {
    marginTop: 10,
    backgroundColor: '#ffffffaa',
    padding: 10,
    borderRadius: 10,
  },
  favoriteButton: {
    backgroundColor: '#e63946',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

