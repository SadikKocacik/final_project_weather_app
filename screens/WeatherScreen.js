import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

const WeatherScreen = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToFavorites, isFavorite } = useFavorites();

  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir şehir adı girin.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const API_KEY = '1e6470aac8b245f781330e8a02b960cf';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
      );
      const data = await response.json();
      
      if (data.cod !== 200) {
        setError('Şehir bulunamadı. Lütfen doğru yazdığınızdan emin olun.');
        setWeatherData(null);
      } else {
        setWeatherData(data);
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.log('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = (city) => {
    addToFavorites(city);
    Alert.alert('Başarılı', `${city.name} favorilere eklendi!`);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SearchBar
          value={city}
          onChangeText={setCity}
          onSubmit={fetchWeather}
          placeholder="Şehir Girin (örn: İstanbul)"
        />

        {loading && <LoadingIndicator />}

        {error && (
          <EmptyState
            icon="alert-circle"
            iconColor="#e63946"
            title="Hata"
            message={error}
          />
        )}

        {weatherData && !error && (
          <WeatherCard
            weatherData={weatherData}
            onFavoritePress={handleAddToFavorites}
            isFavorite={isFavorite && isFavorite(weatherData.id)}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
});

export default WeatherScreen;

