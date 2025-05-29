import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

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

  const handleAddToFavorites = () => {
    if (weatherData) {
      addToFavorites(weatherData);
      Alert.alert('Başarılı', `${weatherData.name} favorilere eklendi!`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Şehir Girin (örn: İstanbul)"
            placeholderTextColor="#666"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={fetchWeather}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchWeather}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4682b4" />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={40} color="#e63946" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {weatherData && !error && (
          <View style={styles.weatherContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.city}>{weatherData.name}</Text>
              <TouchableOpacity 
                onPress={handleAddToFavorites}
                style={styles.favoriteButton}
                disabled={isFavorite && isFavorite(weatherData.id)}
              >
                <Ionicons 
                  name={isFavorite && isFavorite(weatherData.id) ? "heart" : "heart-outline"} 
                  size={28} 
                  color={isFavorite && isFavorite(weatherData.id) ? "#e63946" : "#4682b4"} 
                />
              </TouchableOpacity>
            </View>

            <Image
              style={styles.icon}
              source={{
                uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
              }}
            />
            
            <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
            <Text style={styles.description}>{weatherData.weather[0].description}</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={24} color="#4682b4" />
                <Text style={styles.detailText}>Nem</Text>
                <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="speedometer-outline" size={24} color="#4682b4" />
                <Text style={styles.detailText}>Basınç</Text>
                <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="thunderstorm-outline" size={24} color="#4682b4" />
                <Text style={styles.detailText}>Rüzgar</Text>
                <Text style={styles.detailValue}>{weatherData.wind.speed} m/s</Text>
              </View>
            </View>
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4682b4',
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e63946',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  weatherContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteButton: {
    padding: 8,
  },
  icon: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  detailValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default WeatherScreen;

