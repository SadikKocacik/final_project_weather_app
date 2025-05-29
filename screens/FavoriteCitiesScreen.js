import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  RefreshControl,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavoritesContext';

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
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4682b4" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Henüz favori şehir eklenmemiş</Text>
        <Text style={styles.emptySubText}>
          Favori şehirlerinizi eklemek için ana sayfadan arama yapabilir veya popüler şehirler sayfasını kullanabilirsiniz.
        </Text>
      </View>
    );
  }

  const renderWeatherCard = ({ item }) => (
    <Animated.View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.city}>{item.name}</Text>
          <Text style={styles.country}>{item.sys.country}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => handleRemoveFromFavorites(item)}
          style={styles.removeButton}
        >
          <Ionicons name="heart" size={24} color="#e63946" />
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
          <Text style={styles.description}>{item.weather[0].description}</Text>
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
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={weatherData}
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
    paddingBottom: 32,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
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
  removeButton: {
    padding: 8,
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

export default FavoriteCitiesScreen;
