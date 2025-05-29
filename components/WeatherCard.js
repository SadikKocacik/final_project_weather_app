import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WeatherCard = ({ 
  weatherData, 
  onFavoritePress, 
  isFavorite, 
  showFavoriteButton = true,
  favoriteColor = "#e63946",
  style
}) => {
  return (
    <Animated.View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.city}>{weatherData.name}</Text>
          <Text style={styles.country}>{weatherData.sys.country}</Text>
        </View>
        {showFavoriteButton && (
          <TouchableOpacity 
            onPress={() => onFavoritePress(weatherData)}
            style={styles.favoriteButton}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? favoriteColor : "#4682b4"} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.weatherInfo}>
        <Image
          style={styles.icon}
          source={{
            uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
          }}
        />
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text style={styles.description}>{weatherData.weather[0].description}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="water-outline" size={20} color="#4682b4" />
          <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
          <Text style={styles.detailLabel}>Nem</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={20} color="#4682b4" />
          <Text style={styles.detailValue}>{weatherData.main.pressure}</Text>
          <Text style={styles.detailLabel}>Basınç</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="thunderstorm-outline" size={20} color="#4682b4" />
          <Text style={styles.detailValue}>{Math.round(weatherData.wind.speed)}</Text>
          <Text style={styles.detailLabel}>Rüzgar</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  favoriteButton: {
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

export default WeatherCard; 