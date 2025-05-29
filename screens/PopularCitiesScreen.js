import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import WeatherCard from '../components/WeatherCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

const cities = [
  'Istanbul', 
  'London', 
  'New York', 
  'Tokyo', 
  'Paris', 
  'Dubai',
  'Singapore',
  'Rome',
  'Barcelona',
  'Sydney'
];

const PopularCitiesScreen = () => {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToFavorites, isFavorite } = useFavorites();

  const fetchAllCitiesWeather = async () => {
    const API_KEY = '1e6470aac8b245f781330e8a02b960cf';
    try {
      const promises = cities.map(city =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
        ).then(res => res.json())
      );
      const results = await Promise.all(promises);
      const filtered = results.filter(item => item.cod === 200);
      setWeatherList(filtered);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllCitiesWeather();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllCitiesWeather();
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (weatherList.length === 0) {
    return (
      <EmptyState
        icon="globe-outline"
        title="Veri Bulunamadı"
        message="Popüler şehirlerin hava durumu bilgileri alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={weatherList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <WeatherCard
            weatherData={item}
            onFavoritePress={addToFavorites}
            isFavorite={isFavorite && isFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4682b4']}
            tintColor="#4682b4"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
});

export default PopularCitiesScreen;
