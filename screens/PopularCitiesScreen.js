import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';

const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Moscow', 'Istanbul'];

const PopularCitiesScreen = () => {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCitiesWeather();
  }, []);

  const fetchAllCitiesWeather = async () => {
    const API_KEY = '1e6470aac8b245f781330e8a02b960cf';
    const promises = cities.map(city =>
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      ).then(res => res.json())
    );
    const results = await Promise.all(promises);
    setWeatherList(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4682b4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={weatherList}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.city}>{item.name}</Text>
            <Image
              style={styles.icon}
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              }}
            />
            <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
            <Text style={styles.description}>{item.weather[0].main}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PopularCitiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  icon: {
    width: 80,
    height: 80,
  },
  temp: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#666',
  },
});
