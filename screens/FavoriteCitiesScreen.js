import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // expo kullanıyorsan bu paket zaten var

const favoriteCities = ['Istanbul', 'Amsterdam', 'Rome', 'Seoul', 'Sydney'];

const FavoriteCitiesScreen = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteCitiesWeather();
  }, []);

  const fetchFavoriteCitiesWeather = async () => {
    const API_KEY = '1e6470aac8b245f781330e8a02b960cf';
    try {
      const promises = favoriteCities.map(city =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        ).then(res => res.json())
      );
      const results = await Promise.all(promises);
      const filtered = results.filter(item => item && item.id && item.name);
      setWeatherData(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={weatherData}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.city}>{item.name}</Text>
              <Ionicons name="heart" size={24} color="#e63946" /> {/* Kalp ikonu */}
            </View>
            <Image
              style={styles.icon}
              source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
            />
            <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
            <Text style={styles.description}>{item.weather[0].main}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FavoriteCitiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    paddingTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffe4c4',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  icon: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: 8,
  },
  temp: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#666',
    textAlign: 'center',
  },
});
