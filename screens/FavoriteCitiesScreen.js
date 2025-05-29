import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import WeatherCard from '../components/WeatherCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

const FavoriteCitiesScreen = () => {
  const [loading, setLoading] = useState(true);
  const { favorites, removeFromFavorites } = useFavorites();
  const [weatherData, setWeatherData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavoriteCitiesWeather = async () => {
    if (favorites.length === 0) {
      setLoading(false);
      setWeatherData([]);
      return;
    }

    const API_KEY = '1e6470aac8b245f781330e8a02b960cf';
    try {
      const promises = favorites.map(city =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric&lang=tr`
        ).then(res => res.json())
      );
      const results = await Promise.all(promises);
      const filtered = results.filter(item => item.cod === 200);
      setWeatherData(filtered);
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Hata', 'Hava durumu bilgileri alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavoriteCitiesWeather();
  }, [favorites]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavoriteCitiesWeather();
  };

  const handleRemoveFromFavorites = (city) => {
    Alert.alert(
      "Favorilerden Çıkar",
      `${city.name} şehrini favorilerden çıkarmak istediğinize emin misiniz?`,
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Evet, Çıkar",
          style: "destructive",
          onPress: () => removeFromFavorites(city.id)
        }
      ]
    );
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon="heart-outline"
        title="Henüz favori şehir eklenmemiş"
        message="Favori şehirlerinizi eklemek için ana sayfadan arama yapabilir veya popüler şehirler sayfasını kullanabilirsiniz."
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <WeatherCard
            weatherData={item}
            onFavoritePress={handleRemoveFromFavorites}
            isFavorite={true}
            favoriteColor="#e63946"
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
    paddingBottom: 32,
  },
});

export default FavoriteCitiesScreen;
