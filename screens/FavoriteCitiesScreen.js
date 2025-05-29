import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavoritesContext';

const FavoriteCitiesScreen = () => {
  const [loading, setLoading] = useState(true);
  const { favorites, removeFromFavorites } = useFavorites();
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteCitiesWeather();
    } else {
      setLoading(false);
    }
  }, [favorites]);

  const fetchFavoriteCitiesWeather = async () => {
    const API_KEY = '1e6470aac8b245f781330e8a02b960cf';
    try {
      const promises = favorites.map(city =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
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
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz favori şehir eklenmemiş</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.city}>{item.name}</Text>
              <TouchableOpacity 
                onPress={() => handleRemoveFromFavorites(item)}
                style={styles.favoriteButton}
              >
                <Ionicons name="heart" size={24} color="#e63946" />
              </TouchableOpacity>
            </View>
            {item.weather && item.weather[0] && (
              <>
                <Image
                  style={styles.icon}
                  source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                />
                <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
                <Text style={styles.description}>{item.weather[0].main}</Text>
              </>
            )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8f0',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteButton: {
    padding: 8,
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
    marginTop: 4,
  },
});
