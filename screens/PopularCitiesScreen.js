import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavoritesContext';

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
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
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

  const handleAddToFavorites = (city) => {
    addToFavorites(city);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4682b4" />
      </View>
    );
  }

  const renderWeatherCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.city}>{item.name}</Text>
          <Text style={styles.country}>{item.sys.country}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => handleAddToFavorites(item)}
          disabled={isFavorite && isFavorite(item.id)}
        >
          <Ionicons 
            name={isFavorite && isFavorite(item.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite && isFavorite(item.id) ? "#e63946" : "#4682b4"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.weatherInfo}>
        <Image
          style={styles.icon}
          source={{
            uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
          }}
        />
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
          <Text style={styles.description}>{item.weather[0].main}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="water-outline" size={20} color="#4682b4" />
          <Text style={styles.detailValue}>{item.main.humidity}%</Text>
          <Text style={styles.detailLabel}>Nem</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={20} color="#4682b4" />
          <Text style={styles.detailValue}>{item.main.pressure}</Text>
          <Text style={styles.detailLabel}>Basınç</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="wind" size={20} color="#4682b4" />
          <Text style={styles.detailValue}>{Math.round(item.wind.speed)}</Text>
          <Text style={styles.detailLabel}>Rüzgar</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={weatherList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWeatherCard}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  country: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  icon: {
    width: 100,
    height: 100,
  },
  tempContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  temp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default PopularCitiesScreen;
