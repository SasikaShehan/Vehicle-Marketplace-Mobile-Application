import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFavorites } from '../../../hooks/useFavorites';
import { Heart } from 'lucide-react-native';

export default function FavoritesScreen({ navigation }: any) {
  const { data, isLoading, error } = useFavorites();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('VehicleDetails', { id: item.id })}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.cardContent}>
        <Text style={styles.vehicleTitle}>{item.year} {item.make} {item.model}</Text>
        <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Vehicles</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load favorites.</Text>
        </View>
      ) : data?.data.length === 0 ? (
        <View style={styles.center}>
          <Heart color="#ccc" size={64} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No saved vehicles yet</Text>
        </View>
      ) : (
        <FlatList
          data={data?.data || []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 15, backgroundColor: '#fff', elevation: 2, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { marginBottom: 15 },
  emptyText: { color: '#868e96', fontSize: 18, fontWeight: '500' },
  errorText: { color: 'red' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, flexDirection: 'row', overflow: 'hidden', elevation: 3 },
  imagePlaceholder: { width: 120, height: 100, backgroundColor: '#e9ecef' },
  cardContent: { flex: 1, padding: 15, justifyContent: 'center' },
  vehicleTitle: { fontSize: 16, fontWeight: 'bold', color: '#343a40', marginBottom: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' }
});
